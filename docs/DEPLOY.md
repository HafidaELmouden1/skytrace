# Déployer SkyTrace gratuitement

L'application est un serveur FastAPI qui lit des FITS et calcule des cartes de
différence : il lui faut un vrai processus Python, avec `astropy` et `numpy`,
et le droit de tourner plus de 10 ms par requête. Le choix d'hébergeur découle
de cette contrainte.

## Ce que Cloudflare permettre, et ce qu'il ne peut pas

| Offre | Gratuit ? | Convient à SkyTrace ? |
|---|---|---|
| **Cloudflare Pages** | oui, bande passante illimitée | non : n'héberge que des fichiers statiques |
| **Cloudflare Workers** | oui, 100 000 requêtes/jour, **10 ms de CPU par invocation** | non : pas de `astropy`, pas de WCS, pas de rendu FITS |
| **Cloudflare Containers** | non, inclus seulement dans le plan Workers Paid à 5 $/mois | oui, mais payant |

Sources : [Workers pricing](https://developers.cloudflare.com/workers/platform/pricing/),
[Containers pricing](https://developers.cloudflare.com/containers/platform/pricing).

Cloudflare reste utile plus tard : une fois les images pré-rendues, une version
100 % statique (Pages) affiche la galerie et les comparaisons sans serveur, avec
un temps de réponse immédiat. Ce serait un export à écrire, pas un déploiement.

## La voie gratuite : Render (Docker, sans carte bancaire)

Le plan Free donne 0,1 CPU / 512 Mo, 750 heures d'instance par mois, un domaine
en `*.onrender.com` et le TLS. Contreparties : l'instance s'endort après 15 min
sans trafic et met environ une minute à se réveiller
([doc Render](https://render.com/docs/free)).

### Mise en ligne, une fois

1. Créer un compte sur <https://dashboard.render.com/register> avec **GitHub**.
2. *New* → **Blueprint** → choisir le dépôt `HafidaELmouden1/skytrace`.
   Render lit `render.yaml` et propose le service `skytrace` en plan Free.
3. **Apply**. La construction prend 5 à 10 minutes : elle installe les
   dépendances puis télécharge les cutouts décrits dans `data/manifest.json`
   depuis IRSA (fait réseau rapide, ~200 Mo).
4. Ouvrir l'URL affichée, du type `https://skytrace.onrender.com`.

### Après chaque `git push`

`autoDeploy` est actif : Render reconstruit l'image et remplace l'instance sans
intervention. Pour forcer une reconstruction : *Manual Deploy → Clear build
cache & deploy*.

### Ce que l'instance hébergée ne conserve pas

Le disque est éphémère. Les boutons « collecter » (`POST /api/collect`,
`/api/targets/{slug}/fetch`) téléchargent bien de nouvelles poses depuis IRSA,
mais elles disparaissent au redémarrage suivant : sur l'instance publique, la
série livrée avec l'image reste la référence. Pour publier une nouvelle série,
régénérer le paquet de données et reconstruire (voir plus bas).

### Garder l'instance éveillée

`.github/workflows/keep-warm.yml` appelle `/api/health` toutes les 10 minutes
entre 6 h et 20 h. Il utilise la variable de dépôt `SKYTRACE_URL` si elle
existe, sinon `https://skytrace.onrender.com`. Pour la définir :
*Settings → Secrets and variables → Actions → Variables → New variable*.

750 heures par mois couvrent environ 24 jours pleins : un réveil limité à la
journée reste dans le quota.

## Les données ne sont pas dans git

`data/frames` pèse plus de 400 Mo : les FITS ne sont pas versionnés. À la place,
`data/manifest.json` décrit chaque pose retenue — `obs_id`, cible, position
céleste, URL du service IRSA, taille — et `scripts/fetch_manifest.py` les
retélécharge à la construction, sur le réseau de l'hébergeur. Le build est donc
reproductible sans transférer les fichiers depuis un poste local.

Après une nouvelle collecte, régénérer le manifeste :

```bash
uv run --python 3.13 --with astropy --with numpy python scripts/build_manifest.py
git add data/manifest.json && git commit -m "Refresh the observation manifest"
```

Pour figer un instantané exact (sans dépendre d'IRSA au build), passer une
archive en argument de construction :

```bash
tar -czf skytrace-data.tar.gz data cache
# puis dans Render : Environment → Build argument DATA_URL=<url de l'archive>
```

## Lancer l'image en local

```bash
docker build -t skytrace:local .
docker run --rm -p 8000:8000 -v "$PWD/data:/app/data" -v "$PWD/cache:/app/cache" skytrace:local
```

Le disque monté contient déjà les FITS : `fetch_manifest.py` les voit présents
et ne télécharge rien. Pour forcer le téléchargement, supprimer `data/frames`
ou construire l'image sans volume.

## Version statique, hébergée gratuitement

L'application complète demande un serveur, mais l'interface se précalcule :
`scripts/export_static.py` interroge les mêmes fonctions que l'API, écrit les
JSON et les images dans `site/`, et injecte un petit intercepteur qui répond à
chaque appel `/api/…` depuis un fichier. Les pages, la galerie, les époques, le
catalogue de sources et les comparaisons restent identiques.

```bash
uv run --python 3.13 --with fastapi --with "uvicorn[standard]" \
  --with astropy --with numpy --with pillow python scripts/export_static.py --out site
```

Ce qui est précalculé : toutes les poses (images, métadonnées, descriptions) et
les comparaisons entre passes consécutives, plus la première et la dernière de
chaque champ — 304 comparaisons pour 309 poses. Une paire arbitraire n'existe
pas dans un fichier statique : l'interface l'annonce au lieu d'afficher une
image fausse.

`site/` se dépose tel quel sur n'importe quel hébergeur de fichiers : GitHub
Pages (ce qui est en ligne), Cloudflare Pages (glisser le dossier), Netlify.
`404.html` fait office de page par défaut pour que `/explore`, `/gallery` et
`/about` fonctionnent sans configuration de routage.

En ligne : <https://hafidaelmouden1.github.io/> — dépôt
[`HafidaELmouden1.github.io`](https://github.com/HafidaELmouden1/HafidaELmouden1.github.io).
Pour republier après une nouvelle collecte :

```bash
python scripts/export_static.py --out site
rm -rf ../skytrace-site && cp -r site ../skytrace-site
cd ../skytrace-site && git init -b main && git add -A \
  && git commit -m "Refresh the static export" \
  && git remote add origin https://github.com/HafidaELmouden1/HafidaELmouden1.github.io.git \
  && git push -f origin main
```

## Un lien public immédiat, sans hébergeur

Tant que la machine reste allumée, un tunnel Cloudflare expose le serveur local
sur une URL HTTPS publique, sans compte :

```bash
cloudflared tunnel --url http://localhost:8000
```

Pratique pour une démonstration en direct ou pour faire valider une version
avant le déploiement ; l'URL disparaît avec le processus.

## Alternatives gratuites

| Plateforme | Offre gratuite | Remarque |
|---|---|---|
| **Koyeb** | une instance Free, 512 Mo, mise à l'échelle à zéro | équivalent à Render, interface plus sobre |
| **Google Cloud Run** | 2 M requêtes/mois | carte bancaire demandée à l'inscription |
| **Oracle Cloud Always Free** | 4 cœurs ARM, 24 Go | carte demandée ; la plus généreuse, mais lourde à mettre en place |
| **Hugging Face Spaces (Docker)** | — | depuis 2026, le matériel `cpu-basic` exige un abonnement PRO |

Sources : [Koyeb instances](https://koyeb.com/docs/reference/instances),
[HF Spaces](https://huggingface.co/docs/huggingface_hub/guides/manage-spaces).
