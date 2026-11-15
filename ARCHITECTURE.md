# Planet X & SPHEREx — Dossier technique et architecture

**Challenge** : NASA International Space Apps Challenge 2026 — *Planet X and SPHEREx* (niveau Advanced)
**Échéance** : 14–15 novembre 2026 · ressources officielles publiées le 13 novembre
**Statut de ce document** : recherche vérifiée sur les API réelles le 10/11/2026 depuis ce poste. Les chiffres marqués **(mesuré)** viennent d'appels HTTP effectués en direct, pas d'estimations.

---

## 0. TL;DR — les cinq décisions qui font la différence

| # | Décision | Pourquoi |
|---|---|---|
| 1 | **Ne jamais servir de FITS depuis IRSA au navigateur.** Ingestion → notre stockage → rendu PNG/WebP. | Un cutout de 0,05° pèse **5,07 Mo en 21,4 s (mesuré)**. Un cutout de 0,3° n'a pas abouti en 420 s (mesuré). En proxy direct, l'outil est mort au premier utilisateur. |
| 2 | **Le plancher de 5 Mo est le HDU PSF, pas l'image.** | PSF = cube `121×101×101` float32 = **4,94 Mo constants**, renvoyé non modifié quelle que soit la taille du cutout (mesuré). À extraire une fois par détecteur, jamais par requête. |
| 3 | **Quatre axes de temps, pas un.** | Cadence réelle mesurée : 6,4 min (intra-slew), 8,0 h (slew suivant), 6,1 mois (époque suivante), + un axe spectral continu. Un carrousel d'images rate 3 axes sur 4. |
| 4 | **Précalculer les 5 champs de test en HiPS/tuiles, calculer le reste à la demande derrière un cache immuable.** | 1 607 473 images ≈ **107 To** (mesuré via TAP). Tout précalculer est impossible ; tout calculer à la volée est trop lent. La réponse est un cache adressé par contenu. |
| 5 | **Le différenciateur n'est pas le lecteur d'images, c'est le détecteur de mobiles.** | Tout le monde livrera un slider. Personne n'aura l'association inter-époques + rejet Gaia qui transforme 1 milliard d'objets en *liste de candidats à examiner*. |

---

## 1. Décodage du challenge

### 1.1 Les trois exigences dures

Source : [spaceappschallenge.org/2026/challenges/planet-x-and-spherex](https://www.spaceappschallenge.org/2026/challenges/planet-x-and-spherex)

1. Saisie de **coordonnées RA/Dec** d'une zone du ciel.
2. Affichage d'une **série d'images de cette zone « comme une petite vidéo »**.
3. Rendre **facile à repérer les objets qui bougent**.

Les cinq cibles de test imposées, avec leurs coordonnées exactes :

| Cible | Type | RA | Dec | Source des coordonnées |
|---|---|---|---|---|
| Barnard's Star | naine rouge à mouvement propre record | 269,4521° | +4,6933° | catalogue |
| Epsilon Indi B | couple de naines brunes | 330,8403° | −56,7861° | catalogue |
| WISE 0855 | naine brune ultra-rapide | 133,7951° | −7,2451° | **donnée dans le challenge** (08h55m10.831s, −07d14m42.53s) |
| RW Aurigae | étoile variable (binaire) | 76,9560° | +30,4014° | catalogue |
| R Draconis | variable de type Mira | 248,1680° | +66,7547° | catalogue |

*(catalogue = conversions sexagésimales connues ; WISE 0855 est la seule donnée numériquement par le challenge — les autres sont mes conversions, à recouper dans SIMBAD avant la démo.)*

### 1.2 Les 8 « potential considerations » → matrice de score

Elles ne sont pas obligatoires, mais chacune est une ligne de la grille. Colonne « coût » = effort réel dans les 48 h.

| # | Considération | Coût | Valeur | Où c'est traité ici |
|---|---|---|---|---|
| 1 | Facile à mettre à jour avec les nouveaux releases | S | **Élevée** | §5.2 (ingest incrémental) |
| 2 | Exploiter les 102 bandes / sommer les 6 détecteurs / spectres à la volée | M | **Très élevée** | §4.4, §6 |
| 3 | Additionner / soustraire des images de dates différentes | M | **Très élevée** | §7 |
| 4 | Champ de vue réglable par l'utilisateur | S | Moyenne | §4.6 |
| 5 | Superposer Gaia / WISE | S | Élevée (effet « wow » immédiat) | §4.6 |
| 6 | URL partageable avec coordonnées | XS | Moyenne mais gratuite | §4.5 |
| 7 | Afficher les métadonnées, dont les flags de contamination | S | Élevée (crédibilité scientifique) | §4.4 |
| 8 | Utiliser des outils existants (astropy, Aladin) | XS | Moyenne | §4.6 |

### 1.3 Grille de notation réelle

Cinq critères notés de 1 à 5 : **Impact, Creativité, Validité scientifique et technique, Pertinence par rapport au challenge, Présentation**. Sources : [business-review.eu (critères annoncés)](https://business-review.eu/tech/it/innovation-feasibility-and-relevance-among-the-criteria-for-evaluating-projects-at-nasa-space-apps-challenge-302778), [crafterwiki.com](https://crafterwiki.com/plans/nasa-space-apps-2026).

Deux conséquences opérationnelles :

- **« Validity » se gagne en montrant les incertitudes.** Une seule ligne « les images sont du QR3 `l2b-v20`, calibration du 2025-247, flags de pixels affichés » vaut plus que dix fonctionnalités.
- **« Presentation » est systématiquement sous-investi** (constat de l'organisateur). Prévoir 3 h de vidéo de démo + une page qui s'explique en 60 s sans intervention humaine.

---

## 2. Audit des données — ce que les API répondent vraiment

### 2.1 Où sont les données

| Couche | Endpoint | Usage |
|---|---|---|
| TAP (ADQL) | `https://irsa.ipac.caltech.edu/TAP` | **découverte, indexation** — tables `spherex.obscore`, `.observation`, `.plane`, `.artifact`, `.provenance_input` (mesuré) |
| SIA2 | `https://irsa.ipac.caltech.edu/SIA?COLLECTION=...` | recherche standard images, lag ~1 jour sur TAP |
| Cutout service | `...ibe/data/...fits?center=ra,dec&size=deg` | extraction spatiale à la volée — **lent, à réserver à l'ingestion** |
| AWS Open Data | `s3://nasa-irsa-spherex/qr2/level2/` (us-east-1, `--no-sign-request`, sans frais d'egress) | **chemin de production** : parallélisable, HTTP Range |
| HiPS/CDS | `alasky.cds.unistra.fr/hips-image-services/hips2fits` | overlay Gaia DR3 / WISE sans téléchargement |

Collections SIA2 : `spherex_qr3`, `spherex_qr3_deep`, `spherex_qr2`, `spherex_qr2_deep`. Le *Wide* couvre tout le ciel uniformément ; le *Deep* ajoute les champs profonds (répétés).

### 2.2 Volume réel (mesuré par TAP, `GROUP BY obs_collection`)

| Collection | Images | Poids @70 Mo |
|---|---|---|
| `spherex_qr2` (wide) | 1 097 080 | 73,2 To |
| `spherex_qr2_deep` | 270 250 | 18,0 To |
| `spherex_qr3` (wide) | 192 961 | 12,9 To |
| `spherex_qr3_deep` | 47 182 | 3,1 To |
| **Total images spectrales** | **1 607 473** | **≈ 107 To** |

*(+ 74 produits `qr2_cal`, 88 `qr3_cal`.)*

**Conclusion architecturale** : aucun précalcul all-sky n'est possible dans un hackathon. Toute la conception doit être *pull-based avec cache*, sauf les 5 champs de démonstration qui sont précalculés.

### 2.3 Anatomie d'un produit — vérifiée en ouvrant un fichier réel

Cutout téléchargé : `center=133.7951,-7.2451` (WISE 0855), `size=0.05`, `qr2`.

```
HDU 0  (vide)
HDU 1  IMAGE     (29, 29)        MJy/sr     ← image calibrée, non soustraite du zodiaque
HDU 2  FLAGS     (29, 29)        int32      ← bitmask qualité (bits 0, 2, 5, 131072, 524288, 2097152 observés)
HDU 3  VARIANCE  (29, 29)        MJy2/sr2   ← variance par pixel → barres d'erreur réelles
HDU 4  ZODI      (29, 29)        MJy/sr     ← modèle de lumière zodiacale
HDU 5  PSF       (121, 101, 101) float32    ← cube PSF : 4,94 Mo, JAMAIS modifié par le cutout
HDU 6  WCS-WAVE  BINTABLE        X, Y, (λ, Δλ) sur grille 11×11
```

En-tête : `MJD-OBS = 60801.106596`, `DATE-OBS = 2025-05-06T02:33:29`, `OBSID = 2025W19_1B_0181_1`, `DETECTOR = 2`, `BUNIT = MJy/sr`, `CTYPE = RA---TAN-SIP / DEC--TAN-SIP`.

Statistiques de l'image : médiane **+0,25 MJy/sr**, min **−0,77** (bruit négatif), max **+9,66**, 0 % de NaN.

Trois conséquences directes, à coder dès le premier jour :

1. **Le stretch doit être signé** (asinh ou zscale à deux côtés). Un `log(1+x)` coupe tout le bruit négatif et fabrique de faux vides.
2. **Le WCS spectral n'est pas un WCS standard.** `WCS(key="W")` échoue (`KeyError`) — dans un cutout, `WCS-WAVE` est un **tableau de correspondance creux 11×11** (X, Y, λ, Δλ). Il faut interpoler (`scipy.interpolate.griddata`) pour obtenir λ(x, y), puis trancheter. C'est le principal piège technique du projet ; le notebook officiel qui utilise `WCS(..., key="W")` fonctionne sur les MEF complets, pas sur les cutouts.
3. **Le PSF est le coût caché.** Il faut le sortir une fois par détecteur, le stocker, et ne plus le transporter (ou utiliser des requêtes HTTP `Range` sur S3 pour ne lire que les HDUs utiles).

### 2.4 Couverture et cadence réelles des 5 cibles (mesuré par TAP)

| Cible | Images | Jours distincts | Première obs. | Dernière obs. | Détecteurs |
|---|---|---|---|---|---|
| Barnard's Star | 364 | 39 | 2025-08-15 | 2026-09-22 | 6 |
| Epsilon Indi B | 444 | 57 | 2025-04-24 | 2026-10-02 | 6 |
| WISE 0855 | 256 | 26 | 2025-05-05 | 2026-05-14 | 6 |
| RW Aurigae | 333 | 35 | 2025-09-01 | 2026-09-16 | 6 |
| **R Draconis** | **2 483** | **222** | 2025-04-24 | 2026-09-27 | 6 |

Le cas R Draconis est le plus important du dossier : **222 jours distincts d'observation**, parce que la cible est proche du pôle écliptique nord, donc dans un champ profond revisité en permanence. Les autres cibles n'ont que 26 à 57 jours.

**Conséquence produit** : la vidéo « temporelle » est pauvre partout sauf près des pôles écliptiques. Il faut donc construire l'outil autour des *quatre* axes, pas d'un seul. C'est exactement ce que le challenge appelle de ses vœux avec la considération n°2, mais presque toutes les équipes vont le rater.

### 2.5 Les quatre axes de temps (mesurés sur les timestamps)

```
6,4 min        8,0 h          6,1 mois
  │              │               │
  ├─ petit slew  ├─ slew suivant ├─ époque suivante ──────────────►
  │  (même champ)│  (même champ) │  (même champ, autre passe)
```

| Axe | Δt mesuré | Ce qu'on y voit | Où |
|---|---|---|---|
| A — intra-slew | **6,45 min** | astéroïdes géocroiseurs, satellites, tout ce qui bouge vite | `OBSID ..._1` → `..._4` |
| B — slew→slew | **8,03 h** | même zone dans la même nuit ; rotation propre de la Terre | `0181` → `0231` |
| C — époque→époque | **6,1 mois** | mouvement propre des étoiles proches, parallaxe annuelle | `2025W19_1B` → `2025W45_2A` |
| D — axe spectral | continu | 102 bandes, glace d'eau, CO₂, poussières | HDU 1 + WCS-WAVE |

L'axe D est le seul qui soit riche pour **toutes** les cibles : chaque image contient déjà un continuum de longueurs d'onde, pas seulement une couleur. C'est l'argument massue pour la considération n°2 et pour le critère « Creativité ».

---

## 3. Architecture cible

Le diagramme est dans `planetx-spherex-architecture.html`.

### 3.1 Principe directeur

> **Séparer le temps lent (ingestion, calibration, mosaïquage) du temps rapide (affichage).**
> L'utilisateur ne doit jamais attendre IRSA. Il attend un CDN, ou une barre de progression sur un job déjà lancé.

### 3.2 Les cinq couches

```
┌──────────────────────────────────────────────────────────────────────┐
│ 1. FRONTEND — Next.js (App Router) + Aladin Lite                     │
│    · canvas HiPS, formulaire RA/Dec, timeline multi-axes            │
│    · mode blink / différence / cube 102 bandes / spectre au clic    │
│    · URL = état complet (?ra=&dec=&fov=&t=&band=&mode=)             │
└───────────────────────────┬──────────────────────────────────────────┘
                            │ HTTPS + ETag immuable
┌───────────────────────────▼──────────────────────────────────────────┐
│ 2. API — FastAPI (async)                                             │
│    /v1/epochs   /v1/frame   /v1/cube   /v1/movie   /v1/spectrum     │
│    /v1/movers   /v1/meta    /v1/health   SSE /v1/jobs/{id}/events    │
│    · rate-limit par IP, clé d'idempotence, OpenAPI publiée          │
└───────────────────────────┬──────────────────────────────────────────┘
                            │
┌───────────────────────────▼──────────────────────────────────────────┐
│ 3. CACHE 3 niveaux                                                    │
│    L1 Cloudflare (CDN, immutable, 1 an)                              │
│    L2 S3/MinIO — clé = sha256(paramètres canoniques)  ← source vérité│
│    L3 Redis — hot set 5 champs de démo + verrous de jobs             │
└───────────────────────────┬──────────────────────────────────────────┘
                            │ cache miss
┌───────────────────────────▼──────────────────────────────────────────┐
│ 4. RENDER WORKERS — arq + Redis (asyncio, N=4)                       │
│    cutout S3 (Range) → déPSF → λ(x,y) → tranches → stretch → WebP    │
└───────────────────────────┬──────────────────────────────────────────┘
                            │
┌───────────────────────────▼──────────────────────────────────────────┐
│ 5. INGEST — crawler TAP incrémental + Postgres/Q3C                   │
│    obscore → table epoch (un enregistrement par image)               │
│    détecte les nouveaux obs_id à chaque release hebdomadaire         │
└──────────────────────────────────────────────────────────────────────┘
```

### 3.3 Pourquoi ces choix (ADR condensés)

**ADR-1 — Pas de proxy FITS.** Mesuré : 5 Mo / 21 s par cutout, échec au-delà de 0,3°. En proxy, 10 utilisateurs simultanés = 50 Mo de transit et 21 s d'attente chacun. → Le serveur rend, cache, et ne sert que du WebP de 20–80 Ko.

**ADR-2 — Cache adressé par contenu, pas par URL.** La clé est `sha256(collection|obs_id|ra|dec|fov|band|stretch|size)`. Propriétés : immuable → `Cache-Control: immutable` → CDN et navigateur ne revérifient jamais ; idempotent → deux workers qui calculent la même chose écrivent la même clé ; invalidable → changer le stretch crée une nouvelle clé, l'ancienne reste valable.

**ADR-3 — WebP plutôt que PNG.** Une image astronomique 8 bits à 512 px : PNG ≈ 180 Ko, WebP qualité 85 ≈ 35 Ko (×5 sur le budget mobile). Pour les données > 8 bits (mode scientifique), servir FITS/`uint16` **en plus**, jamais à la place.

**ADR-4 — Aladin Lite pour la navigation, pas pour le rendu.** Aladin gère le ciel HiPS, les overlays Gaia/WISE et le zoom/pan gratuitement. Mais il n'affiche pas les produits SPHEREx : on lui superpose **notre** couche d'images rendues (HiPS custom, §7). Gains : zéro code de projection, overlay catalogue en 3 lignes.

**ADR-5 — Postgres + Q3C.** L'index spatial se fait côté base (`q3c_ang2ipix`), pas en Python. Requête type : trouver toutes les images dont le polygone contient un point, triées par temps — c'est exactement `CONTAINS(POINT(...), poly)` de TAP, mais sur nos données et en ~2 ms.

### 3.4 Modèle de données

```sql
CREATE TABLE field (            -- un champ = une requête utilisateur canonique
  id          bigserial PRIMARY KEY,
  ra          double precision NOT NULL,
  dec         double precision NOT NULL,
  fov_deg     real NOT NULL,
  ipix        bigint NOT NULL,          -- q3c
  created_at  timestamptz DEFAULT now()
);

CREATE TABLE epoch (            -- une image SPHEREx = un instant + un détecteur
  obs_id      text NOT NULL,
  collection  text NOT NULL,            -- spherex_qr3 | ..._deep | spherex_qr2
  detector    smallint NOT NULL,        -- 1..6
  mjd_obs     double precision NOT NULL,
  ctype_wcs   text,
  access_uri  text NOT NULL,            -- S3 key
  psf_uri     text,
  qc_flags    jsonb,                    -- distribution des bits de FLAGS
  PRIMARY KEY (obs_id)
);
CREATE INDEX ON epoch USING gist (q3c_ellipse(mjd_obs));   -- ou btree simple

CREATE TABLE asset (            -- un rendu immuable
  key         char(64) PRIMARY KEY,     -- sha256
  kind        text NOT NULL,            -- frame | cube | movie | spectrum | diff
  mime        text NOT NULL,
  bytes       bigint NOT NULL,
  meta        jsonb NOT NULL            -- stretch, vmin/vmax, lambda, provenance
);

CREATE TABLE job (              -- génération asynchrone (movie, cube, movers)
  id uuid PRIMARY KEY, state text, progress real, key char(64), error text
);
```

Note : `epoch` n'est pas partitionnée dans un premier temps ; 1,6 M de lignes tient dans Postgres sans effort.

### 3.5 Contrat d'API

```http
GET /v1/epochs?ra=133.7951&dec=-7.2451&fov=0.4&collection=spherex_qr2
→ 200 {
    "field": {"ra":133.7951,"dec":-7.2451,"fov":0.4},
    "count": 26,
    "epochs": [
      {"obs_id":"2025W19_1B_0181_1","mjd":60801.1066,"detector":2,
       "bands":17,"days_from_first":0.0,"has_assets":true},
      ...
    ],
    "cadence": {"intra_slew_min":6.45,"slew_h":8.03,"epoch_months":6.1},
    "provenance": {"collection":"spherex_qr2","cal_version":"l2b-v20-2025-247",
                   "retrieved":"2026-11-10T18:40:00Z"}
  }

GET /v1/frame?obs_id=...&fov=0.4&band=8&stretch=asinh&size=512
→ 200 image/webp  ·  Cache-Control: public, max-age=31536000, immutable
   Header X-Provenance: qr2/l2b-v20-2025-247/MJD60801.1066

GET /v1/meta?obs_id=...            → flags, variance, zodi, PSF, WCS, stats
GET /v1/cube?ra=..&dec=..&fov=..   → 202 {job_id} → SSE /v1/jobs/{id}/events
GET /v1/movie?ra=..&dec=..&fps=4   → 202 → MP4 (ffmpeg, H.264, 512px)
GET /v1/spectrum?ra=..&dec=..      → {lambda:[...],"flux":[...],"err":[...]}
GET /v1/movers?ra=..&dec=..&fov=.. → candidats classés, avec scores et justification
```

**Deep-link** (considération n°6) : le frontend doit pouvoir reconstruire l'état complet depuis `?ra=&dec=&fov=&band=&t=&mode=diff`. C'est 30 lignes avec `nuqs` et ça rend l'outil intégrable en iframe dans n'importe quel blog.

### 3.6 Budget de performance (dérivé des mesures)

| Scénario | Cible | Comment |
|---|---|---|
| Cache hit CDN | **< 80 ms** | WebP 35 Ko, `immutable` |
| Cache miss, 1 frame | **< 3 s** | Range request S3 sur HDU 1 + 6 uniquement |
| 26 époques × 1 frame (parallèle 6) | **< 15 s** | préchauffage en tâche de fond pendant la saisie |
| Vidéo 26 frames MP4 | **< 40 s** | job async + SSE |
| Requête `/v1/epochs` | **< 120 ms** | Postgres + index spatial |

Le point clé : **le préchauffage**. Dès que l'utilisateur tape des coordonnées (debounce 400 ms), on lance `/v1/epochs` ; dès que la timeline s'affiche, on lance les 6 premières frames en tâche de fond. L'attente perçue tombe à zéro.

---

## 4. Rendu d'image — la partie où on gagne ou on perd la crédibilité

### 4.1 Pipeline d'une frame

```
1. Résoudre la cible        TAP → liste d'epoch (obs_id, mjd, detector, uri S3)
2. Récupérer les HDUs utiles  HTTP Range sur S3 : HDU 1 (IMAGE), 2 (FLAGS), 6 (WCS-WAVE)
                              ⚠ JAMAIS HDU 5 (PSF) : +4,94 Mo pour rien
3. Masquer                  pixels où FLAGS != 0 → NaN (option « masquer les pixels contaminés »)
4. Estimer le fond          sigma-clipped median (pas la moyenne : étoiles brillantes)
5. Trancher en λ            griddata(WCS-WAVE 11×11) → λ(x,y)
                            tranche = pixels dans [λ0−Δ, λ0+Δ] → reprojeté sur grille commune
6. Stretch                  asinh signé, vmin/vmax = percentiles 0,5 % / 99,5 %
7. Quantifier               8 bits (affichage) ou uint16 (mode science)
8. Encoder                  WebP q=85 ; GIF seulement si demandé explicitement
9. Persister                S3 clé = sha256(...) + meta jsonb
```

### 4.2 Le stretch, en une formule

```python
lo, hi = np.percentile(v[np.isfinite(v)], [0.5, 99.5])
n = np.clip((data - lo) / (hi - lo), 0, 1)
out = np.arcsinh(n * a) / np.arcsinh(a)     # a ≈ 8
```

Asinh plutôt que log parce que : le bruit est signé (§2.3, min −0,77), et asinh est linéaire près de zéro — on voit le fond de ciel sans écraser les sources brillantes. C'est ce qu'utilisent ds9, Aladin et Lupton et al. 2004.

### 4.3 Le mode « blink » et la différence

- **Blink** = alternance à 2–4 Hz entre deux époques, même grille, même stretch. C'est la méthode historique (Pluto, 1930). Coût : 2 images mises en cache.
- **Différence** = `A_norm − B_norm` après alignement WCS (`reproject_interp`) et normalisation du fond. Trois variantes à exposer :
  - `A − B` brut (le plus parlant pour le public),
  - `min(A,B)` (les sources fixes restent, les mobiles disparaissent — très pédagogique),
  - résidu normalisé par `sqrt(VAR_A + VAR_B)` (le seul scientifiquement défendable, car il tient compte du bruit).

Exposer les trois, avec une phrase d'explication sous chacune : c'est de la « Validity » gratuite.

### 4.4 Les 102 bandes, correctement

Piège à éviter : croire que 102 = 102 fichiers. Réalité : 6 détecteurs, chacun avec un filtre à épaisseur variable, donc **l'axe spectral est continu à l'intérieur de chaque image**, décrit par `WCS-WAVE`. Le découpage nominal de la mission est 17 canaux/détecteur ; le cube PSF fourni a **121 plans spectraux**, ce qui montre que l'axe est sur-échantillonné.

Donc :

- On peut générer **plus de 102 « couleurs »** — 64 à 128 tranches est réaliste et c'est un argument de différenciation fort.
- « Sommer les 6 détecteurs » (considération n°2) = construire une image blanche (white light) par époque, en sommant les tranches dans une bande large → gain en S/N immédiat, et c'est ce qu'il faut afficher par défaut quand l'utilisateur clique sur une cible.
- **Spectre au clic** : extraire le profil λ → flux sur une petite ouverture (rayon = FWHM) dans chaque tranche. Gratuit dès qu'on a le cube, et très impressionnant en démo (« cliquez sur cette étoile, voici sa signature de glace d'eau »).

### 4.5 Métadonnées à afficher (considération n°7)

Panneau latéral, toujours visible, jamais replié par défaut :

```
OBSID      2025W19_1B_0181_1
Date       2025-05-06 02:33:29 UTC   (MJD 60801.1066)
Détecteur  2 / 6      Canaux 17      Bande 2,4 µm
Calibration l2b-v20-2025-247 (QR2)
Unité      MJy/sr      Exposition  t_exptime
Flags      0,3 % de pixels contaminés  [voir la carte]
Variance   médiane 1,2e-3 (MJy/sr)²
```

Un lien « voir la carte de flags » qui affiche le HDU 2 en rouge par-dessus l'image : aucun concurrent ne fera ça, et c'est exactement ce qu'un juge astrophysicien vérifie en premier.

### 4.6 Champ de vue et overlays

- FOV : 0,05° → 5° (au-delà, la requête devient un pavage de plusieurs détecteurs).
- **Overlays via Aladin Lite + HiPS** : `CDS/P/Gaia/DR3` (positions propres), `CDS/P/WISE/WISE 3.4um`, `CDS/P/unWISE/2010`, `CDS/P/DSS2/color` (contexte optique). Aucun téléchargement : tuiles HiPS servies par le CDS.
- Bénéfice second : Gaia fournit le **mouvement propre** de chaque étoile. Un objet qui bouge sans contrepartie Gaia à moins de 2″ est un candidat sérieux — c'est le cœur du §5.

---

## 5. Ingestion et mise à jour (considération n°1)

### 5.1 Chargement initial

```sql
-- une seule requête TAP, exécutée une fois
SELECT obs_id, obs_collection, energy_bandpassname, t_min, t_max,
       s_ra, s_dec, s_region, access_url, cloud_access,
       energy_emband, t_exptime, obs_release_date
FROM spherex.obscore
WHERE obs_collection IN ('spherex_qr3','spherex_qr3_deep')
```

1,6 M lignes, ~200 Mo de CSV : ingérable en un appel. Découper par `obs_release_date` mensuelle ou par `obs_collection`, en flux (`pyvo` + `Cursor`), insertion `COPY` par lots de 50 000.

### 5.2 Mise à jour hebdomadaire

Un cron (ou un job `arq` planifié) qui :

1. lit `MAX(obs_release_date)` en base,
2. interroge TAP pour tout ce qui est plus récent,
3. insère les nouveaux `obs_id`, ignore les doublons (`ON CONFLICT DO NOTHING`),
4. envoie un événement « nouvelles époques disponibles pour le champ X » → purge ciblée du cache,
5. expose la date de dernière synchro dans `/v1/health` et dans le footer de l'UI.

C'est la réponse littérale à « design a tool that's easy to update with the latest data releases » : **un seul point d'entrée, idempotent, observable**. À montrer en démo avec un `POST /v1/admin/sync` qui renvoie le diff.

---

## 6. Le moteur de découverte — ce qui peut gagner le challenge

### 6.1 Le problème réel

1 milliard d'objets, 102 bandes, ~2 époques par champ. Personne ne peut « regarder ». Le challenge demande explicitement d'aider « as many people as possible » à participer. Donc : **produire une liste courte de candidats classés, que des humains valident**.

### 6.2 Pipeline de détection (5 étapes, chacune testable)

```
① Reprojection      toutes les frames du champ sur une grille commune (reproject_interp,
                    WCS TAN-SIP → TAN) + masquage FLAGS
② Stack temporel    médiane par groupe d'époques proches (Δt < 1 nuit)
                    → "template" : ne contient que les sources fixes
③ Soustraction      frame − template, avec matching de PSF et normalisation de fond
                    (photutils / scipy.ndimage ; pas besoin de SFFT)
④ Détection         DAOStarFinder ou segmentation sur |résidu| > 5σ
                    → (x, y, flux, FWHM) par frame
⑤ Association       chaîner les détections entre frames :
                    · fixe   → déplacement < 0,3 px
                    · mobile → déplacement cohérent en direction, |v| stable
                    croiser Gaia DR3 : rejeter si une source Gaia à < 2″ possède
                    un mouvement propre compatible
```

### 6.3 Score de candidature (à afficher tel quel dans l'UI)

```
score = 3·log10(S/N du résidu)
      + 2·cohérence_direction(vecteurs entre époques)
      + 2·détection_multi-bandes (nb de tranches λ où l'objet apparaît)
      − 3·proximité_Gaia (si contrepartie à < 2″ avec pm compatible)
      − 2·taux_de_flags (pixels fortement contaminés)
```

Afficher la décomposition du score dans un popover. Un juge qui voit « pourquoi cet objet est classé 1er » accorde la « Validity » immédiatement.

### 6.4 Le geste qui fait la différence en démo

Un mode **« Mouvements »** : l'utilisateur ne saisit plus de coordonnées, il clique sur *Voir les objets qui bougent* et reçoit :

```
3 candidats dans un rayon de 0,5° autour de WISE 0855
 ┌───────────────────────────────────────────────────────────────┐
 │ #1  Δra=+0,42″  Δdec=−0,11″  v=14,2″/an   S/N=11,3   [blink] │
 │     aucune contrepartie Gaia DR3 · 6/6 détecteurs             │
 ├───────────────────────────────────────────────────────────────┤
 │ #2  Δra=−0,08″  Δdec=+0,05″  v=2,1″/an    S/N=6,4    [blink] │
 │     contrepartie Gaia 1,8″ avec pm=1,9″/an  → probablement    │
 │     une étoile connue                                         │
 └───────────────────────────────────────────────────────────────┘
```

Plus un bouton **« Valider / Rejeter »** qui écrit dans une table de classification communautaire. Là on ne livre plus une visionneuse : on livre une **plateforme de science citoyenne**, alignée sur backyardworlds.org cité par le challenge lui-même, et sur le critère « Impact ».

### 6.5 Garde-fou honnête

Ne jamais présenter un candidat comme une découverte. Libellé exact : *« candidat à mouvement non catalogué, à vérifier »*, avec le lien vers les données brutes et la méthode publiée. Un outil qui prétend découvrir un astéroïde en 48 h se fait démolir par le premier juge astrophysicien.

---

## 7. Deux chemins d'évolution

| | **Phase 1 — hackathon** | **Phase 2 — production** |
|---|---|---|
| Rendu | à la demande + cache | **HiPS généré hors ligne** |
| Format | WebP 512 px | tuiles HiPS 512 px, 1 HiPS par (époque × tranche λ) |
| Serveur | FastAPI + workers Python | **statique** : un bucket S3 + Cloudflare |
| « Vidéo » | MP4 généré | empilement de HiPS, opacité animée côté client |
| Coût par requête | CPU + trafic | **zéro CPU** |
| Passage à l'échelle | limité par les workers | illimité |

Le chemin HiPS est le vrai « pro » : une fois les tuiles générées, Aladin Lite charge les époques comme des couches indépendantes, et l'utilisateur obtient un *blink* fluide sur tout le ciel, sans backend. À présenter comme **roadmap dans la démo** (5 slides), pas à implémenter pendant le hackathon.

---

## 8. Process — de maintenant au 15 novembre

### 8.1 Préparation (10–13 novembre, avant le départ)

| Jour | Livrable | Critère de sortie |
|---|---|---|
| J-4 (11/11) | Repo, CI, docker-compose, index TAP des 5 cibles en base | `make up` → UI vide qui démarre |
| J-3 (12/11) | Pipeline frame : TAP → S3 → WebP → affichage | 1 image de WISE 0855 affichée en < 3 s |
| J-2 (13/11) | Timeline + blink + panneau métadonnées ; lecture des ressources officielles dès leur publication | les 5 cibles fonctionnent |
| J-1 (14/11 matin) | Différence + cube λ + spectre | mode science opérationnel |

### 8.2 Les 48 h, en blocs de 6 h

| Bloc | Objectif | Interdits |
|---|---|---|
| H0–H6 | **Chemin critique complet** : une cible, une frame, un affichage. Bout en bout, moche. | pas de design, pas de tests |
| H6–H12 | Timeline multi-axes + 5 cibles + deep-link URL | pas de nouvelle feature |
| H12–H18 | Différence (3 modes) + cube λ + spectre au clic | pas de refactoring |
| H18–H26 | Moteur « Mouvements » (détection + association Gaia) | pas de tuning fin |
| H26–H32 | Métadonnées, flags, accessibilité, mobile | pas de nouvelle feature |
| H32–H38 | **Gel des features.** Tests E2E, README, captures, vidéo de démo | aucune ligne de feature |
| H38–H44 | Pitch, page de présentation, plan B hors-ligne | — |
| H44–H48 | Répétition, dépôt, buffer | — |

Règle non négociable : **le gel à H32**. Les équipes qui perdent Space Apps sont celles qui codent jusqu'à H47.

### 8.3 Définition de « terminé » par brique

- **Data** : requête TAP reproductible, versionnée, avec `obs_id` et date de récupération affichés.
- **API** : contrat OpenAPI publié, réponses typées, codes d'erreur documentés.
- **UI** : utilisable au clavier, contraste AA, aucune attente > 3 s sans indicateur.
- **Science** : chaque chiffre affiché a une unité et une source ; les incertitudes sont visibles.

### 8.4 Qualité et observabilité (checklist minimale)

- `pytest` sur les fonctions pures (stretch, tranchage λ, score) — 30 tests suffisent.
- 1 test Playwright : saisir WISE 0855 → voir une image → basculer blink.
- Sentry (front + back), logs structurés JSON avec `request_id`, `/v1/health` exposant la date de dernière synchro.
- `.env.example`, `docker compose up` qui marche sur une machine neuve.

---

## 9. Risques et parades

| Risque | Prob. | Impact | Parade |
|---|---|---|---|
| IRSA coupe / rame pendant la démo | **Élevée (constaté)** | Fatal | **Mode démo embarqué** : 5 champs précalculés servis depuis le disque local, bascule automatique si IRSA > 10 s |
| Cutout trop lent (21 s mesuré) | Certaine | Élevé | S3 + Range + filtre PSF ; préchauffage |
| `WCS-WAVE` mal interprété | **Élevée** | Élevé | Le piège est documenté §2.3 ; écrire le parseur de la table 11×11 dès J-2, avec un test sur un fichier connu |
| Le « blink » ne montre rien (2 époques seulement) | Moyenne | Élevé | Basculer l'axe par défaut sur λ quand la cadence temporelle est pauvre (< 4 époques) |
| Sous-estimation du rendu couleur | Moyenne | Moyen | Utiliser exactement le stretch `asinh` documenté §4.2, ne pas improviser |
| Panne réseau de la salle | Moyenne | Fatal | Idem mode démo ; + vidéo MP4 préenregistrée en secours |
| Licence / attribution NASA oubliée | Faible | Moyen | `LICENSE` MIT + section « Data: NASA/JPL-Caltech, IPAC/IRSA, terms of use » dans le README |

---

## 10. Auto-évaluation face à la grille

| Critère | Où on marque les points | Où on peut perdre |
|---|---|---|
| Impact | Science citoyenne (valider/rejeter), accès public sans installation | si on ne parle qu'aux astronomes |
| Creativité | Les 4 axes de temps, la différence en 3 modes, le spectre au clic, plus de 102 tranches | si on livre un slider d'images |
| Validité | Provenance affichée, flags, variance, score décomposé, aucun raccourci sur les unités | toute affirmation non sourcée |
| Pertinence | On coche 7 des 8 considérations explicitement, avec une capture pour chacune | oublier la n°1 (mise à jour) qui est la plus facile |
| Présentation | Vidéo de 2 min, une page qui s'explique seule, démo qui ne dépend pas du réseau | démo live sur IRSA |

---

## 11. Prochaines actions concrètes

1. **Vérifier les 4 coordonnées non fournies** dans SIMBAD (Barnard, ε Ind B, RW Aur, R Dra) — 10 min, évite un plantage de démo.
2. **Écrire le parseur `WCS-WAVE` 11×11** et le tester sur `data/w0855_0p05.fits` — c'est le point le plus risqué du projet.
3. **Précalculer les 5 cibles** : 6 détecteurs × ~15 époques × 64 tranches = ~5 800 frames → ~200 Mo de WebP. Tient sur une clé USB : c'est le mode démo.
4. Monter le squelette : FastAPI + Next.js + docker-compose, avec `/v1/health` dès le premier commit.
5. Écrire le README avant le code de la dernière feature (il force à clarifier le discours).

---

## Annexe — commandes de reproduction

```bash
# 1. Combien d'images couvrent un point du ciel ?
curl -sG https://irsa.ipac.caltech.edu/TAP/sync \
  --data-urlencode REQUEST=doQuery --data-urlencode LANG=ADQL --data-urlencode FORMAT=csv \
  --data-urlencode "QUERY=SELECT COUNT(*) n, COUNT(DISTINCT CAST(t_min AS INTEGER)) ndays,
    MIN(t_min) mjd0, MAX(t_max) mjd1, COUNT(DISTINCT energy_bandpassname) nb
    FROM spherex.obscore WHERE 1=CONTAINS(POINT('ICRS',133.7951,-7.2451), s_region)"

# 2. Trouver les MEF qui couvrent un point (avec temps d'observation)
curl -sG https://irsa.ipac.caltech.edu/TAP/sync \
  --data-urlencode REQUEST=doQuery --data-urlencode LANG=ADQL --data-urlencode FORMAT=csv \
  --data-urlencode "QUERY=SELECT 'https://irsa.ipac.caltech.edu/'||a.uri AS uri, p.time_bounds_lower
    FROM spherex.artifact a JOIN spherex.plane p ON a.planeid=p.planeid
    WHERE 1=CONTAINS(POINT('ICRS',133.7951,-7.2451), p.poly)
      AND p.energy_bandpassname='SPHEREx-D2' ORDER BY p.time_bounds_lower"

# 3. Cutout (attention : ~5 Mo dominés par le cube PSF)
curl -o c.fits "https://irsa.ipac.caltech.edu/ibe/data/spherex/qr2/level2/2025W19_1B/l2b-v20-2025-241/2/level2_2025W19_1B_0181_1D2_spx_l2b-v20-2025-241.fits?center=133.7951,-7.2451&size=0.05"

# 4. Inspecter (HDUs, WCS-WAVE, stats)
uv run --with astropy --with numpy --with pillow python scripts/probe_mef.py c.fits

# 5. Cloud (sans credentials, sans egress)
aws s3 ls --no-sign-request s3://nasa-irsa-spherex/qr2/level2/ | head
```

### Sources

- Challenge : https://www.spaceappschallenge.org/2026/challenges/planet-x-and-spherex
- Produits et accès : https://caltech-ipac.github.io/spherex-archive-documentation/
- Tutorials officiels (cutouts, PSF, source discovery) : https://caltech-ipac.github.io/irsa-tutorials/
- Registre AWS Open Data : https://registry.opendata.aws/spherex-qr/
- Conditions d'utilisation des données : https://irsa.ipac.caltech.edu/data_use_terms.html
- Critères de notation : https://business-review.eu/tech/it/innovation-feasibility-and-relevance-among-the-criteria-for-evaluating-projects-at-nasa-space-apps-challenge-302778
