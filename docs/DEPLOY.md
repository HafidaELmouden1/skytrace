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
3. **Apply**. La construction prend 5 à 8 minutes : elle installe les
   dépendances puis télécharge les données (149 Mo) depuis la release
   `data-v1` du dépôt.
4. Ouvrir l'URL affichée, du type `https://skytrace.onrender.com`.

### Après chaque `git push`

`autoDeploy` est actif : Render reconstruit l'image et remplace l'instance sans
intervention. Pour forcer une reconstruction : *Manual Deploy → Clear build
cache & deploy*.

### Garder l'instance éveillée

`.github/workflows/keep-warm.yml` appelle `/api/health` toutes les 10 minutes
entre 6 h et 20 h. Il utilise la variable de dépôt `SKYTRACE_URL` si elle
existe, sinon `https://skytrace.onrender.com`. Pour la définir :
*Settings → Secrets and variables → Actions → Variables → New variable*.

750 heures par mois couvrent environ 24 jours pleins : un réveil limité à la
journée reste dans le quota.

## Les données ne sont pas dans git

`data/` et `cache/` pèsent 150 Mo. Ils sont publiés à part, dans la release
[`data-v1`](https://github.com/HafidaELmouden1/skytrace/releases/tag/data-v1),
et l'image les télécharge à la construction. Pour les régénérer après une
nouvelle collecte :

```bash
tar -czf skytrace-data.tar.gz data cache
gh release upload data-v1 skytrace-data.tar.gz --clobber
```

Puis *Manual Deploy → Clear build cache & deploy*.

## Lancer l'image en local

```bash
docker build --build-arg DATA_URL= -t skytrace:local .
docker run --rm -p 8000:8000 -v "$PWD/data:/app/data" -v "$PWD/cache:/app/cache" skytrace:local
```

`DATA_URL=` vide la valeur par défaut : l'image n'essaie pas de télécharger les
données et utilise celles montées depuis le disque.

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
