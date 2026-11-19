/* SkyTrace — logique de l'interface : routage, langue, explorateur. */

const I18N = {
  fr: {
    'brand.tag': 'SPHEREx · NASA',
    'nav.home': 'Accueil', 'nav.explore': 'Explorer', 'nav.learn': 'Comprendre',
    'nav.targets': 'Atlas du ciel',
    'track.btn': 'Objets mobiles',
    'track.title': 'Objets qui se déplacent',
    'track.close': 'Fermer',
    'track.working': 'Comparaison des poses successives…',
    'track.error': 'Comparaison impossible pour ce champ.',
    'track.none': 'Aucun déplacement mesurable : rien ne change de position au-delà du bruit.',
    'track.found': '{n} déplacements mesurés, dont {c} confirmés sur au moins trois poses.',
    'track.confirmed': 'confirmé',
    'track.unconfirmed': 'à confirmer',
    'nav.about': 'SPHEREx',
    'about.eyebrow': 'La mission',
    'about.title': 'SPHEREx, un télescope qui voit l\u2019invisible',
    'about.lede': 'Chaque six mois, SPHEREx photographie le ciel entier dans 102 couleurs infrarouge. Cette application montre ces images, et ce qui change d\u2019une campagne à l\u2019autre.',
    'about.f1': 'bandes spectrales',
    'about.f2': 'infrarouge proche',
    'about.f3': 'pour tout le ciel',
    'about.f3value': '6 mois',
    'about.f4': 'détecteurs',
    'about.f5': 'orbite héliosynchrone',
    'about.h1': 'Pourquoi l\u2019infrarouge',
    'about.p1': 'La lumière visible est arrêtée par la poussière. L\u2019infrarouge la traverse : il révèle les nuages où naissent les étoiles, la glace d\u2019eau accrochée aux grains, et des galaxies si lointaines que leur lumière a été étirée hors du spectre visible.',
    'about.h2': 'Comment le ciel est balayé',
    'about.p2': 'Le télescope ne pointe pas un objet : il balaie le ciel en bandes successives et enregistre une centaine d\u2019expositions par orbite. Chaque pose couvre plusieurs degrés de ciel, découpée en six images par les six détecteurs.',
    'about.h3': 'Ce que montre une image',
    'about.p3': 'Chaque carré de couleur est un pixel mesuré par SPHEREx, large de 6,2 secondes d\u2019arc. Un point brillant est une étoile ou une galaxie ; une tache allongée est souvent deux sources que le pixel ne sépare pas.',
    'about.h4': 'Pourquoi comparer six mois',
    'about.p4': 'Une même région revient tous les six mois. Comparer deux passages montre ce qui a changé : une étoile variable, une protubérance, un objet du système solaire qui s\u2019est déplacé. C\u2019est cette différence qui intéresse la mission.',
    'about.h5': 'D\u2019où viennent les données',
    'about.p5': 'Les images sont téléchargées à la demande depuis l\u2019archive IRSA (Caltech/IPAC), qui conserve les produits de la mission. Cette application ne fabrique aucune image : elle lit les fichiers FITS et les rend lisibles.',
    'about.h6': 'Ce que l\u2019application ne fait pas',
    'about.p6': 'Elle ne découvre rien. Un changement de luminosité ou une source sans contrepartie est un candidat, jamais une découverte : le bruit, la calibration et la taille du pixel produisent les mêmes signatures.',
    'about.credit': 'Données : NASA/JPL-Caltech, archive IRSA à Caltech/IPAC. DOI 10.26131/IRSA678.',
    'bands.title': 'Les six détecteurs, du proche au moyen infrarouge',
    'bands.lede': 'Chaque détecteur couvre une tranche de longueur d’onde. Les barres ci-dessous sont mesurées sur les images réellement présentes dans cette installation.',
    'bands.frames': 'images',
    'bands.loading': 'Mesure des bandes…',
    'cmp.btn': '6 mois',
    'cmp.title': 'Frise des campagnes',
    'cmp.close': 'Fermer',
    'cmp.pass': 'Passage',
    'cmp.frames': 'poses',
    'cmp.setA': 'Époque 1',
    'cmp.setB': 'Époque 2',
    'cmp.loading': 'Lecture des campagnes…',
    'cmp.chooseTwo': 'Choisis deux passages à comparer.',
    'cmp.sameEpoch': 'Choisis deux passages différents.',
    'cmp.epoch1': 'Époque 1',
    'cmp.epoch2': 'Époque 2',
    'cmp.m.a': 'sources, époque 1',
    'cmp.m.b': 'sources, époque 2',
    'cmp.m.matched': 'appariées',
    'cmp.m.unmatched': 'sans contrepartie',
    'cmp.working': 'Recherche de deux passages séparés de six mois…',
    'cmp.nopair': 'Aucune paire d\u2019images séparées d\u2019environ six mois dans le même détecteur.',
    'cmp.noteDiff': 'Deux passages du même champ, {d} jours d’écart, détecteurs D{det} et D{detB} : seule la position est comparable, pas la luminosité.',
    'cmp.note': 'Deux passages du même champ, {d} jours d\u2019écart, même détecteur D{det}.',
    'cmp.failed': 'La comparaison a échoué.',
    'cmp.diffalt': 'Carte de différence entre les deux passages',
    'cmp.diffnote': '{n} pics au niveau pixel. Rouge : plus brillant en 2026. Bleu : plus brillant en 2025.',
    'nav.archive': 'Archive',
    'arch.kicker': 'Relevé infrarouge du ciel entier',
    'arch.title': 'Archive IRSA en direct',
    'arch.lede': "Interroge l'archive de la NASA pour n'importe quelle position. Plus d'un million d'expositions y sont conservées : cette page montre ce qui existe avant tout téléchargement.",
    'arch.ra': 'Ascension droite (°)',
    'arch.dec': 'Déclinaison (°)',
    'arch.radius': 'Rayon (°)',
    'arch.from': 'Depuis',
    'arch.to': "Jusqu'à",
    'arch.search': 'Interroger IRSA',
    'arch.querying': 'Interrogation de l’archive IRSA… (environ 25 secondes)',
    'arch.failed': "L'archive n'a pas répondu. Réessaie.",
    'arch.found': '{n} expositions couvrent ce point dans un rayon de {r}°, dont {l} déjà téléchargées.',
    'arch.empty': 'Aucune exposition à cette position dans cette fenêtre de dates.',
    'arch.date': 'Date',
    'arch.det': 'Dét.',
    'arch.band': 'Bande',
    'arch.collection': 'Collection',
    'arch.state': 'État',
    'arch.loaded': 'chargée',
    'arch.remote': 'archivée',
    'arch.open': 'Ouvrir',
    'arch.download': 'Télécharger',
    'arch.collecting': 'En cours…',
    'arch.started': 'Lancé',
    'nav.gallery': 'Galerie',
    'gallery.searchPlaceholder': 'Chercher un objet, une date, un détecteur…',
    'gallery.sort': 'Trier',
    'gallery.sort.recent': 'Les plus récentes',
    'gallery.sort.oldest': 'Les plus anciennes',
    'gallery.sort.sources': 'Les plus riches en étoiles',
    'gallery.sort.brightest': 'Les plus brillantes',
    'gallery.detector': 'Détecteur',
    'gallery.count': '{n} photographies affichées sur {total}',
    'gallery.stat.detectors': 'détecteurs utilisés',
    'gallery.eyebrow': 'Photothèque',
    'gallery.title': 'Toutes les photographies',
    'gallery.lede': 'Chaque vignette est une vraie image SPHEREx. Ouvre-en une pour voir le même endroit du ciel changer au fil du temps.',
    'gallery.loading': 'Chargement des images…',
    'gallery.error': 'Impossible de charger les images.',
    'gallery.empty': 'Aucune image pour ce champ.',
    'gallery.all': 'Tout',
    'gallery.alt': 'Image du ciel du',
    'gallery.stat.frames': 'photographies',
    'gallery.stat.fields': 'champs du ciel',
    'gallery.stat.days': 'nuits observées',
    'gallery.card': 'Prise le {date} par le détecteur {detector}. On y distingue {sources} points brillants — des étoiles, et parfois une galaxie lointaine. Bande {band} µm, {pct} % de l’image exploitable.',
    'nav.cta': 'Choisir un lieu',

    'targets.eyebrow': 'Atlas du ciel',
    'targets.title': 'Choisir où regarder',
    'targets.lead': "Chaque entrée pointe vers une parcelle réelle du ciel. Choisis une cible du challenge, ou saisis tes propres coordonnées — SPHEREx ne couvre pas encore tout le ciel, certains champs ne renvoient rien.",
    'targets.custom': 'Position libre',
    'targets.customHint': "Ascension droite en degrés (0–360) et déclinaison (−90 à +90). Le collecteur interroge IRSA, garde une pose par date et valide chaque cutout.",
    'targets.collect': 'Collecter ce champ',
    'targets.open': 'Ouvrir',
    'targets.load': 'Collecter',
    'targets.ready': 'PRÊT',
    'targets.empty': 'NON CHARGÉ',
    'targets.working': 'COLLECTE…',
    'targets.failed': 'ÉCHEC',
    'targets.starting': 'Collecte lancée — les images arrivent dans quelques minutes.',
    'targets.running': 'Collecte en cours…',
    'targets.done': 'Collecte terminée. Les nouvelles époques apparaissent dans l’explorateur.',
    'targets.noobs': 'Aucune observation exploitable pour ce champ.',
    'targets.obs': 'observations',
    'sheet.btn': 'Fiche',
    'sheet.eyebrow': 'Objet du défi',
    'sheet.close': 'Fermer',
    'sheet.open': 'Voir les images',
    'sheet.source': 'Repères publiés ; les images de cette installation servent à les confronter au ciel, jamais à annoncer une découverte.',

    'free.kicker': 'Position libre',
    'free.title': 'Un point du ciel, au choix',
    'free.lede': "Deux nombres suffisent : l'ascension droite et la déclinaison. La collecte interroge l'archive IRSA à cette position et rapporte les expositions qu'elle y trouve — parfois aucune.",
    'free.presetsLabel': 'Exemples de coordonnées',
    'free.p1': "Galaxie d'Andromède (M31)",
    'free.p2': "Nébuleuse d'Orion (M42)",
    'free.p3': 'Centre galactique',
    'free.p4': 'Amas de la Vierge',
    'free.p5': 'Grand Nuage de Magellan',
    'free.label': 'Position libre',
    'free.starting': 'Collecte lancée — les images arrivent dans une à trois minutes.',
    'free.running': "Collecte en cours : l'archive répond image par image…",
    'free.indexing': 'Indexation des nouvelles images…',
    'free.failed': "La collecte n'a pas démarré : l'archive n'a pas répondu.",
    'free.loaded': '{n} observations de ce point, du {from} au {to}.',
    'free.single': 'Une seule observation de ce point, le {from}. Rien à comparer dans le temps.',
    'free.none': "L'archive n'a rendu aucune exposition exploitable à cette position : hors de la couverture du relevé, ou entièrement rejetée par la calibration.",
    'free.detectors': 'Détecteurs',
    'free.open': "Ouvrir dans l'explorateur",
    'read.eyebrow': 'Lecture',
    'read.title': 'Ce que chaque nombre veut dire',
    'read.lede': "Tout ce qui s'affiche pour un champ choisi provient du fichier de la NASA, sans retouche. Voici les six informations à lire avant d'interpréter une image.",
    'read.t1': 'La taille',
    'read.d1': "Le cutout fait 0,1° de côté, soit 59 pixels de 6,2″. Deux sources séparées de moins de douze secondes d'arc tombent dans le même pixel.",
    'read.t2': 'La date',
    'read.d2': "Date civile en temps universel, lue dans l'en-tête de l'exposition. Deux poses d'une même nuit sont séparées d'environ huit heures.",
    'read.t3': 'Le détecteur',
    'read.d3': 'D1 à D6, chacun couvre une tranche entre 0,75 et 5 µm. Deux détecteurs différents ne se comparent ni en éclat ni en couleur.',
    'read.t4': 'Les sources',
    'read.d4': 'Nombre de taches détectées à plus de 5σ, et le pic de la plus brillante, exprimé en σ au-dessus du fond.',
    'read.t5': 'Les pixels valides',
    'read.d5': "Part de l'image que la calibration ne rejette pas. En dessous de 50 %, la moitié du champ est vide et les mesures sont fragiles.",
    'read.t6': "L'unité et la couleur",
    'read.d6': "La brillance est en MJy/sr, une brillance de surface. L'image affichée empile le cube spectral en luminance : c'est lisible, ce n'est pas une couleur vraie.",
    'read.callout': "Une exposition seule ne prouve rien sur un objet. La même parcelle de ciel revient tous les six mois : c'est la répétition, pas l'image unique, qui rend une comparaison possible. Un écart entre deux dates reste un candidat, à confirmer.",

    'home.images': 'images',
    'home.h1a': "Le ciel n'est",
    'home.h1b': 'jamais immobile',
    'home.lead': "SPHEREx observe le ciel entier dans 102 bandes infrarouges, tous les six mois. SkyTrace montre ces observations réelles et ce qui change d'une campagne à l'autre.",
    'home.cta1': 'Parcourir les images',
    'home.cta2': 'Comparer deux dates',
    'home.stat1': 'observations',
    'home.stat2': 'jours couverts',
    'home.stat3': 'détecteurs',
    'home.stat4': 'bandes',
    'mod1.kicker': 'Relevé infrarouge du ciel entier',
    'mod1.title': 'Explorateur de données SPHEREx',
    'mod1.lede': "Choisis une région du ciel. L'outil interroge l'archive IRSA et ne garde que les expositions exploitables, avec leurs métadonnées réelles.",
    'mod1.cta': 'Saisir des coordonnées',
    'mod1.cta2': 'Voir toutes les images',
    'mod2.kicker': 'Comparaison multi-époques',
    'mod2.title': 'Machine temporelle',
    'mod2.lede': 'Deux observations de la même région, prises dans la même bande spectrale à des dates différentes, alignées pixel par pixel.',
    'mod2.cta': 'Ouvrir la machine temporelle',
    'mod2.pairs': '{n} champs sur {total} ont au moins deux dates comparables',
    'mod3.kicker': 'Analyse des différences',
    'mod3.title': 'Signaux cosmiques',
    'mod3.lede': "Une soustraction pixel à pixel entre deux dates souligne ce qui a changé. Chaque tache reste un candidat non vérifié : rayons cosmiques, artéfacts et calibration produisent les mêmes signatures.",
    'mod3.cta': 'Lancer une soustraction',
    'det.eyebrow': 'Six détecteurs',
    'det.title': 'Les six détecteurs de SPHEREx',
    'det.lede': "Chaque détecteur couvre une tranche du proche infrarouge. Clique sur une bande pour voir les images correspondantes.",
    'det.d1': "La lumière juste au-delà de ce que l'œil perçoit : étoiles et galaxies lointaines.",
    'det.d2': "Traverse la poussière fine et révèle les amas d'étoiles cachés.",
    'det.d3': "Montre la charpente stellaire des galaxies là où la poussière bloque le visible.",
    'det.d4': "Détecte la glace d'eau et les molécules organiques des nurseries stellaires.",
    'det.d5': "Bande fine accordée sur la glace de dioxyde de carbone des disques protoplanétaires.",
    'det.d6': "Mesure la poussière chaude et le monoxyde de carbone gelé.",
    'home.step1.t': 'Le relevé infrarouge',
    'home.step1.d': "SPHEREx balaie le ciel avec six détecteurs. Chaque exposition enregistre la brillance de surface en MJy/sr sur une parcelle de plusieurs degrés.",
    'home.step2.t': "L'alignement même bande",
    'home.step2.d': 'Deux dates ne se comparent que si elles partagent la même bande. Les images sont reprojetées sur une grille commune, orientée au nord.',
    'home.step3.t': 'La différence transparente',
    'home.step3.d': "Soustraire l'époque ancienne de la récente révèle les variations. Chaque détection est publiée comme candidate, jamais comme découverte.",
    'home.images': 'images',

    'home.eyebrow': 'Mission SPHEREx · Data Release 1',
    'home.stat3': 'détecteurs', 'home.stat4': 'canaux spectraux',
    'home.tag': "0,1° · naine brune",
    'home.steps.eyebrow': 'Trois gestes', 'home.steps.title': "D'un point du ciel à une comparaison",
    'home.step1.t': 'Choisir un point',
    'home.step1.d': "Une cible du challenge. L'outil interroge l'archive IRSA de la NASA et ne garde que les observations exploitables.",
    'home.step2.t': 'Charger les dates',
    'home.step2.d': 'Chaque date est une observation réelle : identifiant, détecteur, longueur d\'onde, qualité des pixels.',
    'home.step3.t': 'Comparer',
    'home.step3.d': 'Lecture séquentielle, alternance entre deux époques, et spectre construit sur les poses successives.',
    'home.features.eyebrow': "Dans l'explorateur", 'home.features.title': 'Quatre façons de lire le ciel',
    'home.f1.t': 'Frise temporelle',
    'home.f1.d': "Les observations classées par date, avec l'écart réel depuis la première : minutes, heures ou mois.",
    'home.f2.t': 'Comparaison A / B',
    'home.f2.d': 'Alternance rapide entre deux époques. Ce qui apparaît, disparaît ou se déplace devient visible.',
    'home.f3.t': 'Spectre sur les poses',
    'home.f3.d': "SPHEREx mesure une couleur en décalant la source d'un canal à chaque pose. Le spectre en est la trace.",
    'home.f4.t': 'Traçabilité',
    'home.f4.d': "Chaque image affiche son identifiant d'observation, sa calibration et la part de pixels rejetés.",
    'home.data.eyebrow': 'Provenance', 'home.data.title': 'Des données publiques, citées',
    'home.data.lead': "Images spectrales de niveau 2 du Data Release 1, servies par l'Infrared Science Archive du Caltech/IPAC. Aucune donnée simulée.",
    'home.data1.t': 'Archive', 'home.data2.t': 'Version des images', 'home.data3.t': 'Mission',

    'explore.eyebrow': 'Explorateur',
    'explore.title': 'WISE 0855 — naine brune',
    'explore.lead': 'Même parcelle de ciel, plusieurs instants. Utilisez la frise ou lancez la séquence pour voir ce qui change.',
    'explore.refresh': 'Actualiser les données', 'explore.loading': 'Chargement des observations…',
    'explore.prev': 'Précédente', 'explore.next': 'Suivante', 'explore.play': 'Lire la séquence',
    'explore.blink': 'Comparer A/B', 'explore.last': 'Dernière',
    'explore.pixelnote': "Un cutout de 0,1° fait 59 pixels : chaque carré est un pixel SPHEREx réel (6,2″), pas un artefact d'affichage.",
    'explore.targets': 'Cibles du challenge',
    'explore.targetsHint': 'Les cinq objets imposés. Un badge indique les fichiers déjà présents sur la machine.',
    'explore.obs': 'Observation',
    'explore.obsHint': "Ce que le fichier de la NASA contient pour l'image affichée.",
    'explore.spec': 'Spectre — 4 poses',
    'explore.specHint': "Chaque pose décale la source d'un canal du filtre. Ces points sont la vraie mesure de couleur de SPHEREx.",

    'learn.eyebrow': 'Comprendre', 'learn.title': "Lire une image d'archive",
    'learn.lead': "Ce qu'il faut savoir pour interpréter ce que l'explorateur affiche — et ce qu'il ne faut pas en conclure.",
    'learn.h1': 'La mission en trois phrases',
    'learn.p1': "SPHEREx est un télescope spatial de la NASA lancé en mars 2025. Il observe le ciel entier en lumière infrarouge proche, de 0,75 à 5 micromètres, et refait le tour du ciel tous les six mois. Chaque image n'est pas une simple photo : elle contient un spectre, c'est-à-dire une décomposition en longueurs d'onde.",
    'learn.h2': 'Pourquoi les pixels sont si gros',
    'learn.p2': "La résolution de SPHEREx est de 6,2 secondes d'arc par pixel. Un cutout de 0,1 degré ne fait donc que 59 pixels de large. Ce n'est pas un défaut d'affichage : c'est la taille réelle de l'information disponible. Deux objets séparés de moins de douze secondes d'arc ne sont pas distinguables.",
    'learn.callout': "Un écart visible entre deux images ne prouve pas à lui seul qu'un objet a bougé. Il peut venir d'une calibration différente, d'un pixel défectueux ou d'un résidu de fond de ciel. Un déplacement ne devient une piste qu'accompagné d'une mesure et d'une incertitude.",
    'learn.h3': 'Les quatre axes de temps',
    'learn.p3': "Les observations ne sont pas réparties au hasard. Elles suivent quatre échelles que l'explorateur distingue :",
    'learn.t.axis': 'Axe', 'learn.t.dt': 'Écart', 'learn.t.what': "Ce qu'on y voit",
    'learn.axis.intra': 'Intra-slew', 'learn.axis.night': 'Nuit',
    'learn.axis.epoch': 'Époque', 'learn.axis.spectral': 'Spectral',
    'learn.a1.dt': '≈ 6 minutes', 'learn.a1.w': 'Astéroïdes proches, satellites, tout ce qui file vite',
    'learn.a2.dt': '≈ 8 heures', 'learn.a2.w': 'La même zone revisitée dans la même nuit',
    'learn.a3.dt': '≈ 6 mois', 'learn.a3.w': 'Mouvement propre des étoiles proches, parallaxe',
    'learn.a4.dt': 'continu', 'learn.a4.w': 'Les 102 canaux, une couleur par canal',
    'learn.h4': 'Ce que SPHEREx ne peut pas faire',
    'learn.l1': "Mesurer une position au milliarcseconde : c'est le domaine de Gaia.",
    'learn.l2': "Voir un déplacement lent sur six mois : à 1″/an, cela fait un douzième de pixel.",
    'learn.l3': 'Séparer deux sources distantes de moins de 12″.',
    'learn.l4': "Soustraire le zodiaque automatiquement : le modèle existe, l'appliquer est un choix.",
    'learn.h5': 'Données et crédits',
    'learn.k.doi': 'DOI', 'learn.k.calib': 'Calibration',
    'learn.k.units': 'Unités', 'learn.k.licence': 'Licence',
    'learn.p5': "Les images proviennent du Data Release 1 de SPHEREx, archivé à l'Infrared Science Archive (Caltech/IPAC). Les cutouts sont produits par le service de découpe d'IRSA et traités localement.",

    'describe.title': 'Ce que montre cette image :',
    'motion.btn': 'Détecter le mouvement',
    'motion.back': 'Revenir aux images',
    'motion.title': 'Différence entre deux époques',
    'motion.working': 'Calcul de la différence…',
    'motion.failed': 'Impossible de comparer ces deux époques.',
    'motion.empty': 'Aucun pic au-dessus de 5σ entre ces deux époques : rien ne change au-delà du bruit.',
    'motion.peaks': 'pics au-dessus de 5σ',
    'motion.dipole': 'dipôle',
    'motion.residual': 'résidu',
    'motion.dipoleCount': 'en dipôle (signature d’un déplacement)',
    'motion.noDipole': 'aucun en dipôle : ce sont des résidus de PSF',
    'verdict.none': 'Aucune source sans contrepartie : rien ne change au-delà du bruit.',
    'verdict.isolated': '{n} source(s) sur {total} sans contrepartie à l’autre époque. Candidat à examiner, pas une découverte : étoile variable, rayon cosmique ou bord de champ donnent la même signature.',
    'verdict.many': '{n} sources sur {total} sans contrepartie. Trop nombreuses pour un déplacement réel : couverture, bande ou seuil à vérifier avant toute conclusion.',
    'motion.pixelpeaks': '{n} pics au niveau pixel, avant comparaison des catalogues',
    'motion.tolerance': 'appariement à ±{t}″',
    'motion.crossband': 'Détecteurs différents : la couleur n’est pas comparable, seule la position l’est.',
    'motion.note': 'Un pic ici est une différence, pas un objet qui bouge : calibration, bande et bruit laissent des résidus.',
    'foot.left': 'SkyTrace · données NASA/JPL-Caltech · IPAC/IRSA · citer 10.26131/IRSA678',
    'foot.link': 'Méthode et limites',

    'dyn.ref': 'référence', 'dyn.min': 'min', 'dyn.h': 'h', 'dyn.d': 'j',
    'dyn.span': 'Écart total', 'dyn.axis': 'Axes disponibles',
    'dyn.intra': 'poses consécutives (minutes)', 'dyn.night': 'nuit suivante', 'dyn.epoch': 'époque suivante',
    'dyn.skipped': 'Ignorée', 'dyn.noLocal': "Aucun fichier local pour cette cible.",
    'dyn.frames': 'observations',
    'dyn.compat': "Détecteurs différents : la comparaison traverse des longueurs d'onde différentes. Le déplacement reste comparable, l'éclat ne l'est pas.",
    'dyn.specEmpty': 'Pas assez de canaux pour tracer un spectre.',
    'dyn.channels': 'canaux', 'dyn.step': 'pas médian'
  },

  en: {
    'home.h1a': 'The sky is never',
    'home.h1b': 'standing still',
    'home.lead': 'SPHEREx observes the entire sky in 102 infrared bands, every six months. SkyTrace shows these real observations and what changes between passes.',
    'home.cta1': 'Browse the images',
    'home.cta2': 'Compare two dates',
    'home.stat1': 'observations',
    'home.stat2': 'days covered',
    'home.stat3': 'detectors',
    'home.stat4': 'bands',
    'mod1.kicker': 'Infrared all-sky survey',
    'mod1.title': 'SPHEREx Data Explorer',
    'mod1.lede': 'Pick a region of the sky. The tool queries the IRSA archive and keeps only usable exposures, with their real metadata.',
    'mod1.cta': 'Enter coordinates',
    'mod1.cta2': 'See every image',
    'mod2.kicker': 'Multi-epoch comparison',
    'mod2.title': 'Time Machine',
    'mod2.lede': 'Two observations of the same region, taken in the same spectral band on different dates, aligned pixel for pixel.',
    'mod2.cta': 'Open the time machine',
    'mod2.pairs': '{n} of {total} fields have at least two comparable dates',
    'mod3.kicker': 'Spectral difference analysis',
    'mod3.title': 'Cosmic Signals',
    'mod3.lede': 'A pixel-by-pixel subtraction between two dates highlights what changed. Every spot stays an unverified candidate: cosmic rays, artefacts and calibration produce the same signature.',
    'mod3.cta': 'Run a subtraction',
    'det.eyebrow': 'Six detectors',
    'det.title': "SPHEREx's six detectors",
    'det.lede': 'Each detector covers a slice of the near infrared. Click a band to see the matching images.',
    'det.d1': 'Light just beyond what the eye sees: stars and distant galaxies.',
    'det.d2': 'Passes through thin dust and reveals hidden star clusters.',
    'det.d3': 'Shows the stellar backbone of galaxies where dust blocks visible light.',
    'det.d4': 'Detects water ice and organic molecules inside star-forming nurseries.',
    'det.d5': 'A narrow band tuned to frozen carbon dioxide in planet-forming disks.',
    'det.d6': 'Measures warm dust and frozen carbon monoxide.',
    'home.step1.t': 'The infrared survey',
    'home.step1.d': 'SPHEREx sweeps the sky with six detectors. Each exposure records surface brightness in MJy/sr over a patch several degrees wide.',
    'home.step2.t': 'Same-band alignment',
    'home.step2.d': 'Two dates only compare when they share a band. Images are reprojected onto a common north-up grid.',
    'home.step3.t': 'The transparent difference',
    'home.step3.d': 'Subtracting the earlier pass from the later one reveals variations. Every detection is published as a candidate, never as a discovery.',
    'brand.tag': 'SPHEREx · NASA',
    'nav.home': 'Home', 'nav.explore': 'Explore', 'nav.learn': 'Learn',
    'nav.targets': 'Sky atlas', 'nav.cta': 'Pick a place',
    'track.btn': 'Moving objects',
    'track.title': 'Objects that move',
    'track.close': 'Close',
    'track.working': 'Comparing successive poses…',
    'track.error': 'This field cannot be compared.',
    'track.none': 'No measurable displacement: nothing moves beyond noise.',
    'track.found': '{n} displacements measured, {c} confirmed on at least three poses.',
    'track.confirmed': 'confirmed',
    'track.unconfirmed': 'needs confirmation',
    'nav.about': 'SPHEREx',
    'about.eyebrow': 'The mission',
    'about.title': 'SPHEREx, a telescope that sees the invisible',
    'about.lede': 'Every six months SPHEREx photographs the entire sky in 102 infrared colours. This application shows those images, and what changes between survey passes.',
    'about.f1': 'spectral bands',
    'about.f2': 'near infrared',
    'about.f3': 'for the whole sky',
    'about.f3value': '6 months',
    'about.f4': 'detectors',
    'about.f5': 'sun-synchronous orbit',
    'about.h1': 'Why infrared',
    'about.p1': 'Visible light is stopped by dust. Infrared passes through it: it reveals the clouds where stars are born, the water ice stuck to grains, and galaxies so distant that their light has been stretched out of the visible spectrum.',
    'about.h2': 'How the sky is swept',
    'about.p2': 'The telescope does not point at one object: it scans the sky in successive strips and records about a hundred exposures per orbit. Each exposure covers several degrees of sky, split into six images by the six detectors.',
    'about.h3': 'What an image shows',
    'about.p3': 'Every coloured square is a pixel measured by SPHEREx, 6.2 arcseconds wide. A bright point is a star or a galaxy; an elongated blob is often two sources the pixel cannot separate.',
    'about.h4': 'Why compare six months',
    'about.p4': 'The same region comes back every six months. Comparing two passes shows what changed: a variable star, an outburst, a solar system object that moved. That difference is what the mission is after.',
    'about.h5': 'Where the data comes from',
    'about.p5': 'Images are downloaded on demand from the IRSA archive (Caltech/IPAC), which holds the mission products. This application invents no image: it reads FITS files and makes them readable.',
    'about.h6': 'What the application does not do',
    'about.p6': 'It discovers nothing. A change in brightness or a source without a counterpart is a candidate, never a discovery: noise, calibration and pixel size all produce the same signature.',
    'about.credit': 'Data: NASA/JPL-Caltech, IRSA archive at Caltech/IPAC. DOI 10.26131/IRSA678.',
    'cmp.btn': '6 months',
    'cmp.pass': 'Pass',
    'cmp.frames': 'exposures',
    'cmp.setA': 'Epoch 1',
    'cmp.setB': 'Epoch 2',
    'cmp.loading': 'Reading the survey passes…',
    'cmp.chooseTwo': 'Pick two passes to compare them.',
    'cmp.sameEpoch': 'Pick two different passes.',
    'cmp.epoch1': 'Epoch 1',
    'cmp.epoch2': 'Epoch 2',
    'cmp.m.a': 'sources, epoch 1',
    'cmp.m.b': 'sources, epoch 2',
    'cmp.m.matched': 'matched',
    'cmp.m.unmatched': 'without counterpart',
    'bands.title': 'The six detectors, from near to mid infrared',
    'bands.lede': 'Each detector covers a slice of wavelength. The bars below are measured on the images actually present in this installation.',
    'bands.frames': 'images',
    'bands.loading': 'Measuring the bands…',
    'cmp.title': 'Survey cadence',
    'cmp.close': 'Close',
    'cmp.working': 'Looking for two passes six months apart...',
    'cmp.nopair': 'No pair of images about six months apart in the same detector.',
    'cmp.noteDiff': 'Two passes of the same field, {d} days apart, detectors D{det} and D{detB}: only position is comparable, not brightness.',
    'cmp.note': 'Two passes of the same field, {d} days apart, same detector D{det}.',
    'cmp.failed': 'The comparison failed.',
    'cmp.diffalt': 'Difference map between the two passes',
    'cmp.diffnote': '{n} pixel-level peaks. Red: brighter in 2026. Blue: brighter in 2025.',
    'nav.archive': 'Archive',
    'arch.kicker': 'Infrared all-sky survey',
    'arch.title': 'IRSA archive, live',
    'arch.lede': "Query the NASA archive for any position. More than a million exposures are stored there: this page shows what exists before anything is downloaded.",
    'arch.ra': 'Right ascension (°)',
    'arch.dec': 'Declination (°)',
    'arch.radius': 'Radius (°)',
    'arch.from': 'From',
    'arch.to': 'To',
    'arch.search': 'Query IRSA',
    'arch.querying': 'Querying the IRSA archive… (about 25 seconds)',
    'arch.failed': 'The archive did not answer. Try again.',
    'arch.found': '{n} exposures cover this point within {r}°, {l} of them already downloaded.',
    'arch.empty': 'No exposure at this position in this date window.',
    'arch.date': 'Date',
    'arch.det': 'Det.',
    'arch.band': 'Band',
    'arch.collection': 'Collection',
    'arch.state': 'State',
    'arch.loaded': 'loaded',
    'arch.remote': 'archived',
    'arch.open': 'Open',
    'arch.download': 'Download',
    'arch.collecting': 'Working…',
    'arch.started': 'Started',
    'nav.gallery': 'Gallery',
    'gallery.searchPlaceholder': 'Search an object, a date, a detector…',
    'gallery.sort': 'Sort',
    'gallery.sort.recent': 'Newest first',
    'gallery.sort.oldest': 'Oldest first',
    'gallery.sort.sources': 'Richest in stars',
    'gallery.sort.brightest': 'Brightest',
    'gallery.detector': 'Detector',
    'gallery.count': '{n} of {total} photographs shown',
    'gallery.stat.detectors': 'detectors used',
    'gallery.eyebrow': 'Photo library',
    'gallery.title': 'Every photograph',
    'gallery.lede': 'Each thumbnail is a real SPHEREx image. Open one to watch the same patch of sky change over time.',
    'gallery.loading': 'Loading images…',
    'gallery.error': 'The images could not be loaded.',
    'gallery.empty': 'No image for this field.',
    'gallery.all': 'All',
    'gallery.alt': 'Sky image from',
    'gallery.stat.frames': 'photographs',
    'gallery.stat.fields': 'sky fields',
    'gallery.stat.days': 'nights observed',
    'gallery.card': 'Taken on {date} by detector {detector}. About {sources} bright points stand out — stars, and occasionally a distant galaxy. {band} µm band, {pct}% of the frame usable.',

    'targets.eyebrow': 'Sky atlas',
    'targets.title': 'Choose where to look',
    'targets.lead': 'Every entry points at a real patch of sky. Pick a challenge target, or enter your own coordinates — SPHEREx does not cover the whole sky yet, so some fields return nothing.',
    'targets.custom': 'Custom position',
    'targets.customHint': 'Right ascension in degrees (0–360) and declination (−90 to +90). The collector queries IRSA, keeps one exposure per date and validates each cutout.',
    'targets.collect': 'Collect this field',
    'targets.open': 'Open',
    'targets.load': 'Collect',
    'targets.ready': 'READY',
    'targets.empty': 'NOT LOADED',
    'targets.working': 'COLLECTING…',
    'targets.failed': 'FAILED',
    'targets.starting': 'Collection started — images arrive in a few minutes.',
    'targets.running': 'Collection running…',
    'targets.done': 'Collection finished. New epochs appear in the explorer.',
    'targets.noobs': 'No usable observation for this field.',
    'targets.obs': 'observations',
    'sheet.btn': 'Fact sheet',
    'sheet.eyebrow': 'Challenge target',
    'sheet.close': 'Close',
    'sheet.open': 'Open the images',
    'sheet.source': 'Published reference values; the images in this installation put them to the test on the sky, and never announce a discovery.',

    'free.kicker': 'Custom position',
    'free.title': 'Any point in the sky',
    'free.lede': 'Two numbers are enough: right ascension and declination. The collection queries the IRSA archive at that position and reports the exposures it holds there — sometimes none.',
    'free.presetsLabel': 'Example coordinates',
    'free.p1': 'Andromeda galaxy (M31)',
    'free.p2': 'Orion nebula (M42)',
    'free.p3': 'Galactic centre',
    'free.p4': 'Virgo cluster',
    'free.p5': 'Large Magellanic Cloud',
    'free.label': 'Custom position',
    'free.starting': 'Collection started — images arrive in one to three minutes.',
    'free.running': 'Collecting: the archive answers image by image…',
    'free.indexing': 'Indexing the new images…',
    'free.failed': 'The collection did not start: the archive did not answer.',
    'free.loaded': '{n} observations of this point, from {from} to {to}.',
    'free.single': 'A single observation of this point, on {from}. Nothing to compare over time.',
    'free.none': 'The archive returned no usable exposure at this position: outside the survey footprint, or entirely rejected by the calibration.',
    'free.detectors': 'Detectors',
    'free.open': 'Open in the explorer',
    'read.eyebrow': 'Reading guide',
    'read.title': 'What each number means',
    'read.lede': 'Everything shown for a chosen field comes from the NASA file, untouched. These are the six pieces of information to read before interpreting an image.',
    'read.t1': 'Size',
    'read.d1': 'The cutout is 0.1° across, which is 59 pixels of 6.2″. Two sources closer than twelve arcseconds land on the same pixel.',
    'read.t2': 'Date',
    'read.d2': 'Civil date in universal time, read from the exposure header. Two exposures in the same night sit about eight hours apart.',
    'read.t3': 'Detector',
    'read.d3': 'D1 to D6, each covering a slice between 0.75 and 5 µm. Two different detectors compare neither in brightness nor in colour.',
    'read.t4': 'Sources',
    'read.d4': 'Number of blobs detected above 5σ, and the peak of the brightest one, in σ above the background.',
    'read.t5': 'Valid pixels',
    'read.d5': 'Share of the frame the calibration does not reject. Below 50%, half the field is empty and the measurements are fragile.',
    'read.t6': 'Unit and colour',
    'read.d6': 'Brightness is in MJy/sr, a surface brightness. The displayed image stacks the spectral cube into luminance: readable, but not true colour.',
    'read.callout': 'A single exposure proves nothing about an object. The same patch of sky comes back every six months: repetition, not one image, is what makes a comparison possible. A difference between two dates stays a candidate, to be confirmed.',

    'home.eyebrow': 'SPHEREx mission · Data Release 1',
    'home.stat3': 'detectors', 'home.stat4': 'spectral channels',
    'home.tag': '0.1° · brown dwarf',
    'home.steps.eyebrow': 'Three steps', 'home.steps.title': 'From a point in the sky to a comparison',
    'home.step1.t': 'Pick a point',
    'home.step1.d': 'A challenge target. The tool queries NASA IRSA and keeps only usable observations.',
    'home.step2.t': 'Load the dates',
    'home.step2.d': 'Each date is a real observation: identifier, detector, wavelength, pixel quality.',
    'home.step3.t': 'Compare',
    'home.step3.d': 'Sequential playback, A/B alternation, and a spectrum built from successive pointings.',
    'home.features.eyebrow': 'Inside the explorer', 'home.features.title': 'Four ways to read the sky',
    'home.f1.t': 'Time track',
    'home.f1.d': 'Observations ordered by date, with the real gap from the first one: minutes, hours or months.',
    'home.f2.t': 'A / B comparison',
    'home.f2.d': 'Fast alternation between two epochs. What appears, vanishes or shifts becomes visible.',
    'home.f3.t': 'Spectrum from pointings',
    'home.f3.d': 'SPHEREx measures colour by shifting the source one channel per pointing. The spectrum is the trace.',
    'home.f4.t': 'Provenance',
    'home.f4.d': 'Every image shows its observation id, calibration and share of rejected pixels.',
    'home.data.eyebrow': 'Provenance', 'home.data.title': 'Public data, properly cited',
    'home.data.lead': 'Level 2 spectral images from Data Release 1, served by the Infrared Science Archive (Caltech/IPAC). Nothing simulated.',
    'home.data1.t': 'Archive', 'home.data2.t': 'Image version', 'home.data3.t': 'Mission',

    'explore.eyebrow': 'Explorer', 'explore.title': 'WISE 0855 — brown dwarf',
    'explore.lead': 'Same patch of sky, several instants. Use the track or play the sequence to see what changes.',
    'explore.refresh': 'Refresh data', 'explore.loading': 'Loading observations…',
    'explore.prev': 'Previous', 'explore.next': 'Next', 'explore.play': 'Play sequence',
    'explore.blink': 'Compare A/B', 'explore.last': 'Latest',
    'explore.pixelnote': 'A 0.1° cutout is 59 pixels wide: every square is one real SPHEREx pixel (6.2″), not a display artefact.',
    'explore.targets': 'Challenge targets',
    'explore.targetsHint': 'The five required objects. A badge marks files already on this machine.',
    'explore.obs': 'Observation', 'explore.obsHint': 'What the NASA file contains for the image shown.',
    'explore.spec': 'Spectrum — 4 pointings',
    'explore.specHint': 'Each pointing shifts the source one filter channel. These points are how SPHEREx measures colour.',

    'learn.eyebrow': 'Learn', 'learn.title': 'Reading an archive image',
    'learn.lead': 'What you need to interpret what the explorer shows — and what you must not conclude from it.',
    'learn.h1': 'The mission in three sentences',
    'learn.p1': 'SPHEREx is a NASA space telescope launched in March 2025. It surveys the whole sky in near-infrared light from 0.75 to 5 micrometres, and repeats the full sky every six months. Each image is not a plain picture: it carries a spectrum, a decomposition into wavelengths.',
    'learn.h2': 'Why the pixels are so large',
    'learn.p2': 'SPHEREx resolves 6.2 arcseconds per pixel. A 0.1 degree cutout is therefore only 59 pixels wide. This is not a display flaw: it is the actual size of the information. Two objects closer than twelve arcseconds cannot be separated.',
    'learn.callout': 'A visible difference between two images does not by itself prove that an object moved. It may come from a different calibration, a bad pixel or a residual sky background. A shift becomes a lead only when accompanied by a measurement and an uncertainty.',
    'learn.h3': 'The four time axes',
    'learn.p3': 'Observations are not spread at random. They follow four scales that the explorer separates:',
    'learn.t.axis': 'Axis', 'learn.t.dt': 'Gap', 'learn.t.what': 'What it reveals',
    'learn.axis.intra': 'Intra-slew', 'learn.axis.night': 'Night',
    'learn.axis.epoch': 'Epoch', 'learn.axis.spectral': 'Spectral',
    'learn.a1.dt': '≈ 6 minutes', 'learn.a1.w': 'Near-Earth asteroids, satellites, anything fast',
    'learn.a2.dt': '≈ 8 hours', 'learn.a2.w': 'The same field revisited within one night',
    'learn.a3.dt': '≈ 6 months', 'learn.a3.w': 'Proper motion of nearby stars, parallax',
    'learn.a4.dt': 'continuous', 'learn.a4.w': 'The 102 channels, one colour per channel',
    'learn.h4': 'What SPHEREx cannot do',
    'learn.l1': 'Measure a position to the milliarcsecond: that is Gaia territory.',
    'learn.l2': 'See slow motion across six months: at 1″/year that is one twelfth of a pixel.',
    'learn.l3': 'Separate two sources closer than 12″.',
    'learn.l4': 'Subtract the zodiacal light automatically: the model exists, applying it is a choice.',
    'learn.h5': 'Data and credits',
    'learn.k.doi': 'DOI', 'learn.k.calib': 'Calibration',
    'learn.k.units': 'Units', 'learn.k.licence': 'Licence',
    'learn.p5': 'Images come from the SPHEREx Data Release 1, archived at the Infrared Science Archive (Caltech/IPAC). Cutouts are produced by the IRSA cutout service and processed locally.',

    'describe.title': 'What this frame contains:',
    'motion.btn': 'Detect motion',
    'motion.back': 'Back to frames',
    'motion.title': 'Difference between two epochs',
    'motion.working': 'Computing the difference…',
    'motion.failed': 'These two epochs cannot be compared.',
    'motion.empty': 'No peak above 5σ between these epochs: nothing changes beyond noise.',
    'motion.peaks': 'peaks above 5σ',
    'motion.dipole': 'dipole',
    'motion.residual': 'residual',
    'motion.dipoleCount': 'dipole-shaped (signature of motion)',
    'motion.noDipole': 'none dipole-shaped: these are PSF residuals',
    'verdict.none': 'No source without a counterpart: nothing changes beyond noise.',
    'verdict.isolated': '{n} of {total} sources have no counterpart at the other epoch. Worth checking, not a discovery: variable stars, cosmic rays and field edges look the same.',
    'verdict.many': '{n} of {total} sources have no counterpart. Too many for real motion: check coverage, band and threshold before concluding anything.',
    'motion.pixelpeaks': '{n} pixel-level peaks, before catalogue comparison',
    'motion.tolerance': 'matched within ±{t}″',
    'motion.crossband': 'Different detectors: brightness is not comparable, only position is.',
    'motion.note': 'A peak here is a difference, not a moving object: calibration, band and noise all leave residuals.',
    'foot.left': 'SkyTrace · data NASA/JPL-Caltech · IPAC/IRSA · cite 10.26131/IRSA678',
    'foot.link': 'Method and limits',

    'dyn.ref': 'reference', 'dyn.min': 'min', 'dyn.h': 'h', 'dyn.d': 'd',
    'dyn.span': 'Total span', 'dyn.axis': 'Available axes',
    'dyn.intra': 'consecutive pointings (minutes)', 'dyn.night': 'following night', 'dyn.epoch': 'following epoch',
    'dyn.skipped': 'Skipped', 'dyn.noLocal': 'No local files for this target yet.',
    'dyn.frames': 'observations',
    'dyn.compat': 'Different detectors: the comparison crosses different wavelengths. Displacement stays comparable, brightness does not.',
    'dyn.specEmpty': 'Not enough channels to draw a spectrum.',
    'dyn.channels': 'channels', 'dyn.step': 'median step'
  }
};

const state = {
  lang: 'en', epochs: [], i: 0, playing: false, blinking: false, timer: null,
  stats: null, target: localStorage.getItem('skytrace.v2.target') || 'wise0855'
};
const el = (id) => document.getElementById(id);
const t = (key) => (I18N[state.lang] && I18N[state.lang][key]) || I18N.fr[key] || key;

/* ------------------------------------------------------------------ langue */

function applyLang(lang) {
  state.lang = lang;
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-i18n]').forEach((node) => {
    const key = node.getAttribute('data-i18n');
    if (I18N[lang] && I18N[lang][key]) node.textContent = I18N[lang][key];
  });
  document.querySelectorAll('.lang button').forEach((b) => {
    b.classList.toggle('on', b.dataset.lang === lang);
  });
  localStorage.setItem('skytrace.v2.lang', lang);
  renderDynamic();
  setExploreTitle();
  if (el('freePresets')) { renderFreePresets(); renderFreeResult(); }
  if (openSlug) renderSheet(openSlug);
  if (cadence.passes.length && !el('compareBox').hidden) { renderCadence(); runCompare(); }
}

/* ------------------------------------------------------------------ routage */

const ROUTES = { '/': 'home', '/targets': 'targets', '/archive': 'archive', '/gallery': 'gallery', '/about': 'about', '/explore': 'explore', '/learn': 'learn' };

function currentRoute() {
  const path = window.location.pathname.replace(/\/$/, '') || '/';
  return ROUTES[path] || 'home';
}

function showRoute() {
  const name = currentRoute();
  const params = new URLSearchParams(location.search);
  const wanted = params.get('target');
  if (wanted) state.target = wanted;
  document.querySelectorAll('.view').forEach((v) => { v.hidden = v.id !== `view-${name}`; });
  document.querySelectorAll('.nav-links a').forEach((a) => {
    const target = a.getAttribute('href');
    a.classList.toggle('active', ROUTES[target] === name);
  });
  window.scrollTo({ top: 0, behavior: 'instant' });
  if (name !== 'targets') closeSheet();
  if (name === 'explore') loadEpochs();
  if (name === 'home') { loadStats(); loadHomeModules(); }
  if (name === 'targets') loadAtlas();
  if (name === 'gallery') loadGallery();
  if (name === 'archive') initArchive();
  if (name === 'about') renderBands();
}

document.addEventListener('click', (ev) => {
  const link = ev.target.closest('a[data-route]');
  if (!link) return;
  ev.preventDefault();
  const href = link.getAttribute('href');
  if (window.location.pathname !== href) {
    history.pushState({}, '', href);
    showRoute();
  }
});
window.addEventListener('popstate', showRoute);

/* ------------------------------------------------------------------ données */

function fmtDate(mjd, withTime) {
  const ms = (mjd + 2400000.5 - 2440587.5) * 86400000;
  const d = new Date(ms);
  const locale = state.lang === 'en' ? 'en-GB' : 'fr-FR';
  const day = d.toLocaleDateString(locale, { day: '2-digit', month: 'short', year: 'numeric' });
  if (!withTime) return day;
  return `${day} · ${d.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })} UT`;
}

function shortDate(mjd) {
  const ms = (mjd + 2400000.5 - 2440587.5) * 86400000;
  const d = new Date(ms);
  return `${String(d.getUTCDate()).padStart(2, '0')}/${String(d.getUTCMonth() + 1).padStart(2, '0')}`;
}

function delta(first, mjd) {
  const d = mjd - first;
  if (Math.abs(d) < 1e-6) return t('dyn.ref');
  if (Math.abs(d) < 1) return `+${Math.round(d * 1440)} ${t('dyn.min')}`;
  if (Math.abs(d) < 365) return `+${d.toFixed(1)} ${t('dyn.d')}`;
  return `+${(d / 365.25).toFixed(1)} ${t('dyn.d') === 'j' ? 'ans' : 'yr'}`;
}

async function loadStats() {
  try {
    // The home page reports the whole archive, not one field.
    const s = await fetch('/api/stats').then((r) => r.json());
    state.stats = s;
    if (el('statFrames')) el('statFrames').textContent = s.frames ?? '—';
    if (el('statDays')) el('statDays').textContent = s.days ? Math.round(s.days) : '—';
    if (el('statDet')) el('statDet').textContent = s.detectors ?? '—';

    if (s.frames && el('heroImg')) {
      const eps = await fetch(`/api/epochs?target=${state.target}`).then((r) => r.json());
      if (eps.epochs && eps.epochs.length) {
        el('heroImg').src = `/api/frames/${eps.epochs[0].obs_id}.webp`;
      }
    }
  } catch (err) {
    /* l'accueil reste lisible même si l'API ne répond pas */
  }
}

function setExploreTitle() {
  const title = el('exploreTitle');
  if (!title) return;
  title.textContent = targetLabel(state.target);
}

async function loadEpochs() {
  const empty = el('viewerEmpty');
  empty.hidden = false;
  setExploreTitle();
  try {
    const data = await fetch(`/api/epochs?target=${state.target}`).then((r) => r.json());
    state.epochs = data.epochs || [];
    el('chipFrames').textContent = `${data.count} ${t('dyn.frames')}`;
    if (!state.epochs.length) {
      empty.textContent = t('targets.noobs');
      return;
    }
    empty.hidden = true;
    buildTrack();
    show(0);
  } catch (err) {
    state.epochs = [];
    el('chipFrames').textContent = '0';
    empty.textContent = t('targets.noobs');
  }
  loadTargets();
  loadSpectrum();
}

async function loadTargets() {
  try {
    const data = await fetch('/api/targets').then((r) => r.json());
    el('targets').innerHTML = data.targets.map((target, k) => {
      const badge = target.frames ? `<span class="badge">${target.frames}</span>` : '';
      return `<button data-k="${k}" class="${target.frames ? 'on' : ''}" ${target.frames ? '' : 'disabled'}>
                ${target.name}${badge}
              </button>`;
    }).join('');
  } catch (err) { /* la liste reste vide */ }
}

async function loadSpectrum() {
  try {
    const data = await fetch('/api/spectrum').then((r) => r.json());
    drawSpectrum(data);
  } catch (err) {
    el('spectrum').innerHTML = `<p class="note">${t('dyn.specEmpty')}</p>`;
  }
}

/* ------------------------------------------------------------------ atlas */

async function loadAtlas() {
  const atlas = el('atlas');
  if (!atlas) return;
  atlas.innerHTML = '<div class="skeleton" style="height:260px"></div>';

  const notes = {
    en: {
      barnard: '10.3″/yr proper motion',
      'eps-indi-b': 'tight pair, unresolvable at 6.2″',
      wise0855: 'fastest known object, ~8″/yr',
      'rw-aur': 'brightness variability, no motion',
      'r-dra': 'deep field, 222 observed days',
    },
    fr: {
      barnard: 'mouvement propre 10,3″/an',
      'eps-indi-b': 'couple serré, non séparable à 6,2″',
      wise0855: 'objet le plus rapide connu, ~8″/an',
      'rw-aur': "variabilité d'éclat, pas de mouvement",
      'r-dra': 'champ profond, 222 jours observés',
    },
  };

  let data;
  try {
    data = await fetch('/api/targets').then((r) => r.json());
  } catch (err) {
    atlas.innerHTML = `<p class="note">${t('targets.noobs')}</p>`;
    return;
  }

  atlas.innerHTML = data.targets.map((tg) => {
    const ready = tg.frames > 0;
    const running = tg.status === 'running';
    const cls = running ? 'working' : ready ? 'ready' : (tg.status === 'failed' ? 'failed' : 'empty');
    const label = running ? t('targets.working') : ready ? t('targets.ready')
                : (tg.status === 'failed' ? t('targets.failed') : t('targets.empty'));

    const thumb = ready && tg.preview
      ? `<img src="/api/frames/${tg.preview}.webp" alt="${tg.name}">`
      : `<div class="empty-thumb">${t('targets.empty')}</div>`;

    const action = ready
      ? `<button class="btn btn-sm btn-primary" data-open="${tg.slug}">${t('targets.open')}</button>`
      : `<button class="btn btn-sm" data-fetch="${tg.slug}" ${running ? 'disabled' : ''}>${t('targets.load')}</button>`;

    return `<article class="target-card">
      <div class="thumb">${thumb}</div>
      <div class="body">
        <h3>${tg.name} <span class="state ${cls}">${label}</span></h3>
        <div class="sub">RA ${tg.ra.toFixed(3)}° · Dec ${tg.dec.toFixed(3)}°</div>
        <p class="desc">${(notes[state.lang] && notes[state.lang][tg.slug]) || tg.note || ''}</p>
        <div class="row">
          ${ready ? `<span class="chip"><b>${tg.frames}</b> ${t('targets.obs')}</span>` : ''}
          ${action}
          <button class="btn btn-sm btn-ghost" data-sheet="${tg.slug}" aria-controls="sheetBox">${t('sheet.btn')}</button>
        </div>
      </div>
    </article>`;
  }).join('');

  atlas.querySelectorAll('[data-sheet]').forEach((b) => {
    b.onclick = () => openSheet(b.dataset.sheet);
  });

  atlas.querySelectorAll('[data-open]').forEach((b) => {
    b.onclick = () => {
      state.target = b.dataset.open;
      localStorage.setItem('skytrace.v2.target', state.target);
      history.pushState({}, '', '/explore');
      showRoute();
    };
  });

  atlas.querySelectorAll('[data-fetch]').forEach((b) => {
    b.onclick = async () => {
      b.disabled = true;
      b.textContent = t('targets.working');
      el('collectNote').textContent = t('targets.starting');
      try {
        await fetch(`/api/targets/${b.dataset.fetch}/fetch`, { method: 'POST' });
        pollAtlas();
      } catch (err) {
        el('collectNote').textContent = t('targets.noobs');
      }
    };
  });
}

let atlasPoll = null;

function pollAtlas() {
  clearInterval(atlasPoll);
  atlasPoll = setInterval(async () => {
    const data = await fetch('/api/targets').then((r) => r.json()).catch(() => null);
    if (!data) return;
    const busy = data.targets.some((tg) => tg.status === 'running');
    if (busy) {
      el('collectNote').textContent = t('targets.running');
      return;
    }
    clearInterval(atlasPoll);
    el('collectNote').textContent = t('targets.done');
    await fetch('/api/refresh', { method: 'POST' });
    loadAtlas();
  }, 8000);
}

/* ---------------------------------------------------------- position libre */

const FREE_PRESETS = [
  { key: 'free.p1', ra: 10.6847, dec: 41.2692 },
  { key: 'free.p2', ra: 83.8221, dec: -5.3911 },
  { key: 'free.p3', ra: 266.4168, dec: -29.0078 },
  { key: 'free.p4', ra: 187.7059, dec: 12.3911 },
  { key: 'free.p5', ra: 80.8938, dec: -69.7561 },
];

function sexagesimal(ra, dec) {
  // Round to whole seconds before splitting so the carry can never produce
  // a "60" field.
  const arc = Math.round((ra / 15) * 3600);
  const hh = Math.floor(arc / 3600);
  const mm = Math.floor((arc - hh * 3600) / 60);
  const ss = arc - hh * 3600 - mm * 60;

  const sign = dec < 0 ? '−' : '+';
  const darc = Math.round(Math.abs(dec) * 3600);
  const dd = Math.floor(darc / 3600);
  const dm = Math.floor((darc - dd * 3600) / 60);
  const ds = darc - dd * 3600 - dm * 60;

  const pad = (v) => String(v).padStart(2, '0');
  return `RA ${hh}h ${pad(mm)}m ${pad(ss)}s · Dec ${sign}${dd}° ${pad(dm)}′ ${pad(ds)}″`;
}

function updateSexa() {
  const out = el('coordSexa');
  if (!out) return;
  const ra = Number(el('inRa').value);
  const dec = Number(el('inDec').value);
  out.textContent = Number.isFinite(ra) && Number.isFinite(dec) && ra >= 0 && ra <= 360
    ? sexagesimal(ra, dec)
    : '';
}

function renderFreePresets() {
  const row = el('freePresets');
  if (!row) return;
  row.innerHTML = FREE_PRESETS.map((p, k) =>
    '<button type="button" class="region" data-preset="' + k + '">' +
      '<b>' + t(p.key) + '</b>' +
      '<span>RA ' + p.ra.toFixed(2) + '° · Dec ' + p.dec.toFixed(2) + '°</span>' +
    '</button>'
  ).join('');

  row.querySelectorAll('[data-preset]').forEach((b) => {
    b.onclick = () => {
      const p = FREE_PRESETS[Number(b.dataset.preset)];
      el('inRa').value = p.ra;
      el('inDec').value = p.dec;
      updateSexa();
      el('inRa').focus();
    };
  });
}

let freePoll = null;
let freeField = null;

async function collectFree(ra, dec) {
  const note = el('collectNote');
  const box = el('freeResult');
  note.textContent = t('free.starting');
  if (box) { box.hidden = true; box.innerHTML = ''; }

  try {
    const res = await fetch(`/api/collect?ra=${ra}&dec=${dec}&slug=custom&limit=12`, { method: 'POST' });
    if (!res.ok) throw new Error(String(res.status));
  } catch (err) {
    note.textContent = t('free.failed');
    return;
  }
  pollFree();
}

// The collector runs in its own process, so the page watches its state rather
// than waiting on the request.
function pollFree() {
  clearInterval(freePoll);
  let ticks = 0;
  freePoll = setInterval(async () => {
    ticks += 1;
    if (ticks > 90) {
      clearInterval(freePoll);
      el('collectNote').textContent = t('free.failed');
      return;
    }
    let status;
    try {
      status = (await fetch('/api/collect/status?slug=custom').then((r) => r.json())).status;
    } catch (err) {
      return;
    }
    if (status === 'running') {
      el('collectNote').textContent = t('free.running');
      return;
    }
    clearInterval(freePoll);
    if (status === 'failed') {
      el('collectNote').textContent = t('free.none');
      return;
    }
    el('collectNote').textContent = t('free.indexing');
    await fetch('/api/refresh', { method: 'POST' }).catch(() => {});
    galleryCache = null;
    await showFreeResult();
  }, 7000);
}

async function showFreeResult() {
  const note = el('collectNote');
  try {
    freeField = await fetch('/api/field/custom').then((r) => r.json());
  } catch (err) {
    freeField = null;
  }

  if (!freeField || !freeField.count) {
    note.textContent = t('free.none');
    el('freeResult').hidden = true;
    return;
  }
  note.textContent = '';
  renderFreeResult();
}

function renderFreeResult() {
  const box = el('freeResult');
  if (!box || !freeField || !freeField.count) return;

  const items = freeField.items;
  const first = items[0];
  const last = items[items.length - 1];
  const shot = items.slice().reverse().find((i) => i.image);
  const detectors = freeField.detectors.map((d) => 'D' + d);
  const line = items.length > 1
    ? t('free.loaded').replace('{n}', items.length).replace('{from}', first.date).replace('{to}', last.date)
    : t('free.single').replace('{from}', first.date);

  box.innerHTML =
    (shot ? '<figure class="free-thumb"><img src="' + shot.image + '" alt="' + t('gallery.alt') + ' ' + shot.date + '"></figure>' : '') +
    '<div class="free-body">' +
      '<p class="free-line">' + line + '</p>' +
      '<p class="note">' + t('free.detectors') + ' ' + detectors.join(' · ') + ' · 6,2″ / pixel</p>' +
      '<button class="btn btn-sm btn-primary" data-open-field>' + t('free.open') + '</button>' +
    '</div>';
  box.hidden = false;

  box.querySelector('[data-open-field]').onclick = () => {
    state.target = 'custom';
    localStorage.setItem('skytrace.v2.target', state.target);
    history.pushState({}, '', '/explore?target=custom');
    showRoute();
  };
}

function bindFreeRegion() {
  renderFreePresets();
  updateSexa();
  ['inRa', 'inDec'].forEach((id) => {
    const field = el(id);
    if (field) field.oninput = updateSexa;
  });

  const form = el('coordForm');
  if (!form) return;
  form.onsubmit = (ev) => {
    ev.preventDefault();
    const ra = Number(el('inRa').value);
    const dec = Number(el('inDec').value);
    if (!Number.isFinite(ra) || !Number.isFinite(dec)) return;
    if (ra < 0 || ra > 360 || dec < -90 || dec > 90) return;
    collectFree(ra.toFixed(4), dec.toFixed(4));
  };
}

/* ------------------------------------------------------------------- fiches */

const SHEETS = {
  barnard: {
    name: { fr: "Étoile de Barnard", en: "Barnard’s Star" },
    facts: [
      { k: { fr: "Type", en: "Type" }, v: { fr: "naine rouge", en: "red dwarf" } },
      { k: { fr: "Distance", en: "Distance" }, v: { fr: "6 années-lumière", en: "6 light-years" } },
      { k: { fr: "Repère", en: "Landmark" }, v: { fr: "10,3″ par an sur le ciel", en: "10.3″ per year across the sky" } },
    ],
    text: {
      fr: "Une étoile rouge sombre, à peine plus large qu’une planète géante, à six années-lumière de nous : c’est l’une des voisines les plus proches du Soleil. Elle glisse sur le ciel plus vite qu’aucune autre étoile, un peu plus de dix secondes d’arc par an, parce qu’elle passe tout près de notre système. Sur deux poses prises à quelques mois d’écart, elle n’occupe donc plus le même pixel. C’est le déplacement le plus facile à mesurer de tout le ciel.",
      en: "A dark red star, barely wider than a gas giant, six light-years away: one of the closest neighbours of the Sun. It slides across the sky faster than any other star, a little over ten arcseconds a year, because it passes close to our system. On two exposures taken months apart it no longer sits on the same pixel. It is the easiest motion to measure in the whole sky.",
    },
  },
  "eps-indi-b": {
    name: { fr: "Epsilon Indi B", en: "Epsilon Indi B" },
    facts: [
      { k: { fr: "Type", en: "Type" }, v: { fr: "naine brune", en: "brown dwarf" } },
      { k: { fr: "Distance", en: "Distance" }, v: { fr: "12 années-lumière", en: "12 light-years" } },
      { k: { fr: "Repère", en: "Landmark" }, v: { fr: "paire sous un seul pixel", en: "pair inside a single pixel" } },
    ],
    text: {
      fr: "Une naine brune : un objet trop peu massif pour briller comme une étoile, mais bien plus chaud qu’une planète. Elle accompagne Epsilon Indi, une étoile orangée visible à l’œil nu, à douze années-lumière de nous. Vue d’ici, la paire est si serrée que SPHEREx ne peut pas la séparer : les deux astres partagent un seul pixel de 6,2 secondes d’arc. Sur nos images, elle apparaît donc comme une tache légèrement allongée, pas comme deux points.",
      en: "A brown dwarf: an object with too little mass to shine like a star, yet far hotter than a planet. It keeps company with Epsilon Indi, an orange star visible to the naked eye, twelve light-years away. From here the pair sits so close that SPHEREx cannot split it: both bodies share one 6.2-arcsecond pixel. In our images it shows as a slightly elongated patch, not as two points.",
    },
  },
  wise0855: {
    name: { fr: "WISE 0855", en: "WISE 0855" },
    facts: [
      { k: { fr: "Type", en: "Type" }, v: { fr: "naine brune froide", en: "cold brown dwarf" } },
      { k: { fr: "Distance", en: "Distance" }, v: { fr: "7 années-lumière", en: "7 light-years" } },
      { k: { fr: "Repère", en: "Landmark" }, v: { fr: "~8″ par an sur le ciel", en: "~8″ per year across the sky" } },
    ],
    text: {
      fr: "Une naine brune parmi les plus froides que l’on connaisse, à environ sept années-lumière, repérée en 2014 dans les données du télescope WISE. Elle n’émet presque pas de lumière visible : SPHEREx la capte dans l’infrarouge, là où la chaleur qu’elle conserve encore reste mesurable. Elle file d’environ huit secondes d’arc par an, ce qui la rend facile à retrouver d’une campagne à l’autre. Nos images la montrent comme une source faible, à confirmer par les passages suivants.",
      en: "One of the coldest brown dwarfs known, about seven light-years away, spotted in 2014 in data from the WISE telescope. It gives off almost no visible light: SPHEREx catches it in the infrared, where the heat it still holds can be measured. It races along at roughly eight arcseconds a year, which makes it easy to find again from one survey pass to the next. Our images show a faint source, to be confirmed by later passes.",
    },
  },
  "rw-aur": {
    name: { fr: "RW Aurigae", en: "RW Aurigae" },
    facts: [
      { k: { fr: "Type", en: "Type" }, v: { fr: "étoile jeune, variable", en: "young variable star" } },
      { k: { fr: "Distance", en: "Distance" }, v: { fr: "450 années-lumière", en: "450 light-years" } },
      { k: { fr: "Repère", en: "Landmark" }, v: { fr: "éclat qui varie, position fixe", en: "brightness varies, position fixed" } },
    ],
    text: {
      fr: "Une jeune étoile encore prise dans le disque de gaz et de poussière où se forment les planètes, à environ 450 années-lumière, dans la région de formation d’étoiles du Taureau. Son éclat change fortement d’une année à l’autre : la poussière du disque, ou la matière qu’elle projette, cache parfois une partie de sa surface. Elle ne se déplace pas de façon mesurable sur le ciel, donc c’est la luminosité, et non la position, qu’il faut suivre. Entre deux passages, un écart d’éclat est un indice à vérifier, pas une preuve.",
      en: "A young star still caught in the disc of gas and dust where planets form, about 450 light-years away in the Taurus star-forming region. Its brightness swings strongly from year to year: dust in the disc, or the material it throws off, sometimes hides part of its surface. It does not move measurably across the sky, so brightness rather than position is what to follow. Between two passes, a gap in brightness is a clue to check, not a proof.",
    },
  },
  "r-dra": {
    name: { fr: "R Draconis", en: "R Draconis" },
    facts: [
      { k: { fr: "Type", en: "Type" }, v: { fr: "géante rouge variable (Mira)", en: "red giant variable (Mira)" } },
      { k: { fr: "Cycle", en: "Cycle" }, v: { fr: "environ 245 jours", en: "about 245 days" } },
      { k: { fr: "Champ", en: "Field" }, v: { fr: "222 jours d’images", en: "222 days of images" } },
    ],
    text: {
      fr: "Une étoile géante rouge qui gonfle et se contracte lentement, sur un cycle d’environ huit mois. À son plus fort, on la distingue dans de petites jumelles ; à son plus faible, il faut un télescope : c’est une variable de type Mira. Elle est trop lointaine pour que SPHEREx suive son éclat avec précision, mais le champ qui l’entoure contient des centaines de sources stables. Ces sources servent de repères, et nos images de ce champ couvrent 222 jours, assez pour les suivre dans le temps.",
      en: "A red giant star that swells and shrinks slowly, on a cycle of about eight months. At its brightest it shows in small binoculars; at its faintest it takes a telescope: astronomers call it a Mira variable. It sits too far away for SPHEREx to follow its brightness closely, but the field around it holds hundreds of steady sources. Those sources act as references, and our images of that field cover 222 days, enough to follow them over time.",
    },
  },
};

let openSlug = null;

function renderSheet(slug) {
  const box = el('sheetBox');
  const sheet = SHEETS[slug];
  if (!box || !sheet) return;
  const lang = state.lang;
  openSlug = slug;

  box.innerHTML = `
    <div class="sheet-head">
      <div>
        <p class="eyebrow">${t('sheet.eyebrow')}</p>
        <h2>${sheet.name[lang]}</h2>
      </div>
      <button class="btn btn-sm" id="btnSheetClose">${t('sheet.close')}</button>
    </div>
    <dl class="sheet-facts">
      ${sheet.facts.map((f) => `<div><dt>${f.k[lang]}</dt><dd>${f.v[lang]}</dd></div>`).join('')}
    </dl>
    <p class="sheet-text">${sheet.text[lang]}</p>
    <div class="sheet-foot">
      <button class="btn btn-sm btn-primary" id="btnSheetOpen">${t('sheet.open')}</button>
      <p class="note">${t('sheet.source')}</p>
    </div>`;

  box.hidden = false;
  box.setAttribute('tabindex', '-1');
  el('btnSheetClose').onclick = closeSheet;
  el('btnSheetOpen').onclick = () => {
    state.target = slug;
    localStorage.setItem('skytrace.v2.target', slug);
    history.pushState({}, '', '/explore');
    showRoute();
  };
  box.focus({ preventScroll: true });
  box.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function openSheet(slug) {
  renderSheet(slug);
}

function closeSheet() {
  const box = el('sheetBox');
  if (!box) return;
  box.hidden = true;
  box.innerHTML = '';
  openSlug = null;
}

/* ------------------------------------------------------------------ archive */

const ARCHIVE_FIELDS = [
  { slug: 'wise0855', ra: 133.7951, dec: -7.2451 },
  { slug: 'barnard', ra: 269.4521, dec: 4.6933 },
  { slug: 'r-dra', ra: 248.1680, dec: 66.7547 },
  { slug: 'south-deep', ra: 59.9, dec: -66.5 },
  { slug: 'north-deep', ra: 276.0, dec: 65.0 },
  { slug: 'equator-strip', ra: 170.0, dec: -4.0 },
];

function initArchive() {
  const presets = el('archivePresets');
  if (presets && !presets.dataset.ready) {
    presets.dataset.ready = '1';
    presets.innerHTML = ARCHIVE_FIELDS.map((f) =>
      '<button type="button" class="region" data-ra="' + f.ra + '" data-dec="' + f.dec + '">' +
      '<b>' + targetLabel(f.slug) + '</b><span>' + f.ra.toFixed(2) + '°, ' + f.dec.toFixed(2) + '°</span></button>'
    ).join('');
    presets.querySelectorAll('button').forEach((b) => {
      b.onclick = () => {
        el('archRa').value = b.dataset.ra;
        el('archDec').value = b.dataset.dec;
        el('archiveForm').requestSubmit();
      };
    });
  }

  const form = el('archiveForm');
  if (form && !form.dataset.ready) {
    form.dataset.ready = '1';
    form.onsubmit = (ev) => {
      ev.preventDefault();
      runArchiveSearch();
    };

    // A link can carry a position, so a shared URL opens the same query.
    const params = new URLSearchParams(location.search);
    if (params.get('ra') && params.get('dec')) {
      el('archRa').value = params.get('ra');
      el('archDec').value = params.get('dec');
      if (params.get('radius')) el('archRadius').value = params.get('radius');
      runArchiveSearch();
    }
  }
}

async function runArchiveSearch() {
  const status = el('archiveStatus');
  const out = el('archiveResults');
  const ra = el('archRa').value;
  const dec = el('archDec').value;
  const radius = el('archRadius').value || 0.05;
  const from = el('archFrom').value;
  const to = el('archTo').value;

  status.textContent = t('arch.querying');
  out.innerHTML = '';

  const params = new URLSearchParams({ ra: ra, dec: dec, radius: radius });
  if (from) params.set('date_from', from);
  if (to) params.set('date_to', to);

  let data;
  try {
    const response = await fetch('/api/irsa/search?' + params.toString());
    if (!response.ok) throw new Error('search failed');
    data = await response.json();
  } catch (err) {
    status.textContent = t('arch.failed');
    return;
  }

  status.textContent = t('arch.found')
    .replace('{n}', data.total)
    .replace('{l}', data.loaded)
    .replace('{r}', radius);

  if (!data.items.length) {
    out.innerHTML = '<p class="hint">' + t('arch.empty') + '</p>';
    return;
  }

  out.innerHTML =
    '<div class="archive-table"><table><thead><tr>' +
      '<th>' + t('arch.date') + '</th><th>' + t('arch.det') + '</th>' +
      '<th>' + t('arch.band') + '</th><th>' + t('arch.collection') + '</th>' +
      '<th>' + t('arch.state') + '</th><th></th>' +
    '</tr></thead><tbody>' +
    data.items.map((it) =>
      '<tr><td class="mono">' + it.date.slice(0, 16).replace('T', ' ') + '</td>' +
      '<td class="mono">' + (it.detector ? 'D' + it.detector : '—') + '</td>' +
      '<td class="mono dim">' + (it.band || '—') + '</td>' +
      '<td class="mono dim">' + it.collection.replace('spherex_', '') + '</td>' +
      '<td>' + (it.downloaded
        ? '<span class="badge ok">' + t('arch.loaded') + '</span>'
        : '<span class="badge">' + t('arch.remote') + '</span>') + '</td>' +
      '<td>' + (it.downloaded
        ? '<a class="link" href="/explore?target=' + nearestField(it.ra, it.dec) + '" data-route>' + t('arch.open') + '</a>'
        : '<button class="link" data-collect="' + it.obs_id + '" data-ra="' + it.ra + '" data-dec="' + it.dec + '">' + t('arch.download') + '</button>') +
      '</td></tr>'
    ).join('') +
    '</tbody></table></div>';

  out.querySelectorAll('[data-collect]').forEach((b) => {
    b.onclick = async () => {
      b.disabled = true;
      b.textContent = t('arch.collecting');
      try {
        await fetch('/api/collect?ra=' + b.dataset.ra + '&dec=' + b.dataset.dec + '&slug=custom&limit=4', { method: 'POST' });
        b.textContent = t('arch.started');
      } catch (err) {
        b.textContent = t('arch.failed');
      }
    };
  });
}

function nearestField(ra, dec) {
  let best = 'barnard';
  let bestSep = 1e9;
  ARCHIVE_FIELDS.forEach((f) => {
    const sep = Math.hypot((ra - f.ra) * Math.cos((dec * Math.PI) / 180), dec - f.dec);
    if (sep < bestSep) { best = f.slug; bestSep = sep; }
  });
  return best;
}

/* ------------------------------------------------------------------ accueil */

const DETECTORS = [
  { id: 1, band: '0,75–1,09 µm', group: 'SWIR' },
  { id: 2, band: '1,10–1,62 µm', group: 'SWIR' },
  { id: 3, band: '1,63–2,41 µm', group: 'SWIR' },
  { id: 4, band: '2,42–3,82 µm', group: 'MWIR' },
  { id: 5, band: '3,83–4,41 µm', group: 'MWIR' },
  { id: 6, band: '4,42–5,00 µm', group: 'MWIR' },
];

async function loadHomeModules() {
  let data = galleryCache;
  if (!data) {
    try {
      data = await (await fetch('/api/gallery')).json();
      galleryCache = data;
    } catch (err) {
      return;
    }
  }

  const summary = data.summary || {};
  const regions = el('quickRegions');
  if (regions) {
    regions.innerHTML = TARGETS_LIST.map((tg) => {
      const count = (summary[tg.slug] || {}).frames || 0;
      return '<a class="region" href="/explore?target=' + tg.slug + '" data-route>' +
        '<b>' + targetLabel(tg.slug) + '</b>' +
        '<span>' + count + ' ' + t('home.images') + '</span></a>';
    }).join('');
  }

  const grid = el('detectorGrid');
  if (grid) {
    const counts = {};
    data.items.forEach((i) => { counts[i.detector] = (counts[i.detector] || 0) + 1; });
    grid.innerHTML = DETECTORS.map((d) => {
      const count = counts[d.id] || 0;
      return '<a class="detector" href="/gallery" data-route data-det-jump="' + d.id + '" style="--det:' +
        (DETECTOR_COLOURS[d.id] || '#7aa2ff') + '">' +
        '<header><span class="det-id">D' + d.id + '</span><span class="det-group">' + d.group + '</span></header>' +
        '<span class="det-band">' + d.band + '</span>' +
        '<p>' + t('det.d' + d.id) + '</p>' +
        '<footer>' + count + ' ' + t('home.images') + '</footer></a>';
    }).join('');

    grid.querySelectorAll('[data-det-jump]').forEach((link) => {
      link.addEventListener('click', () => {
        galleryView.detector = link.dataset.detJump;
        galleryView.filter = 'all';
        galleryView.query = '';
      });
    });
  }

  const pairs = el('pairCount');
  if (pairs) {
    let compatible = 0;
    Object.values(summary).forEach((s) => {
      if (s.frames >= 2) compatible += 1;
    });
    pairs.textContent = t('mod2.pairs')
      .replace('{n}', compatible)
      .replace('{total}', Object.keys(summary).length);
  }
}

/* ------------------------------------------------------------------ galerie */

const TARGETS_LIST = [
  { slug: 'barnard', name: "Barnard's Star", fr: "Étoile de Barnard" },
  { slug: 'eps-indi-b', name: 'Epsilon Indi B', fr: 'Epsilon Indi B' },
  { slug: 'wise0855', name: 'WISE 0855', fr: 'WISE 0855' },
  { slug: 'rw-aur', name: 'RW Aurigae', fr: 'RW Aurigae' },
  { slug: 'r-dra', name: 'R Draconis', fr: 'R Draconis' },
  { slug: 'south-deep', name: 'South Deep Field', fr: 'Champ profond sud' },
  { slug: 'north-deep', name: 'North Deep Field', fr: 'Champ profond nord' },
  { slug: 'equator-strip', name: 'Equatorial Strip', fr: 'Bande équatoriale' },
];

const DETECTOR_COLOURS = {
  1: '#7aa2ff', 2: '#4cd99c', 3: '#ffb020', 4: '#ff6b8a', 5: '#b78cff', 6: '#4fd8e8',
};

let galleryCache = null;
const galleryView = { filter: 'all', detector: 'all', query: '', sort: 'recent' };

function targetLabel(slug) {
  if (slug === 'custom') return t('free.label');
  const found = TARGETS_LIST.find((t) => t.slug === slug);
  if (!found) return slug;
  return state.lang === 'fr' ? found.fr : found.name;
}

function searchableText(item) {
  return [
    targetLabel(item.slug),
    item.slug,
    item.obs_id,
    item.date,
    item.date.slice(0, 4),
    'd' + item.detector,
    item.detector + ' um',
    item.wavelength_um.toFixed(2),
  ].join(' ').toLowerCase();
}

async function loadGallery() {
  const grid = el('galleryGrid');
  if (!galleryCache) {
    try {
      galleryCache = await (await fetch('/api/gallery')).json();
    } catch (err) {
      grid.innerHTML = '<p class="hint">' + t('gallery.error') + '</p>';
      return;
    }
  }
  renderGallery();
}

function describeFrame(item) {
  return t('gallery.card')
    .replace('{date}', item.date)
    .replace('{detector}', item.detector)
    .replace('{sources}', item.sources)
    .replace('{band}', item.wavelength_um.toFixed(2))
    .replace('{pct}', Math.round(item.valid_fraction * 100));
}

function renderGallery() {
  const data = galleryCache;
  if (!data) return;

  const summary = data.summary || {};
  el('galleryStats').innerHTML =
    '<div class="stat"><b>' + data.total + '</b><span>' + t('gallery.stat.frames') + '</span></div>' +
    '<div class="stat"><b>' + Object.keys(summary).length + '</b><span>' + t('gallery.stat.fields') + '</span></div>' +
    '<div class="stat"><b>' + Object.values(summary).reduce((a, s) => a + s.days, 0) + '</b><span>' + t('gallery.stat.days') + '</span></div>' +
    '<div class="stat"><b>' + new Set(data.items.map((i) => i.detector)).size + '</b><span>' + t('gallery.stat.detectors') + '</span></div>';

  const chips = [['all', data.total, null]].concat(
    TARGETS_LIST.map((tg) => [tg.slug, (summary[tg.slug] || {}).frames || 0, tg])
  );

  const detectors = [...new Set(data.items.map((i) => i.detector))].sort();

  el('galleryFilters').innerHTML =
    '<div class="search-row">' +
      '<input id="gallerySearch" type="search" autocomplete="off" ' +
        'placeholder="' + t('gallery.searchPlaceholder') + '" value="' + galleryView.query.replace(/"/g, '&quot;') + '">' +
      '<select id="gallerySort" aria-label="' + t('gallery.sort') + '">' +
        ['recent', 'oldest', 'sources', 'brightest'].map((k) =>
          '<option value="' + k + '"' + (galleryView.sort === k ? ' selected' : '') + '>' + t('gallery.sort.' + k) + '</option>'
        ).join('') +
      '</select>' +
    '</div>' +
    '<div class="chip-row">' +
      chips.map(([slug, count, tg]) =>
        '<button class="chip ' + (galleryView.filter === slug ? 'on' : '') + '" data-filter="' + slug + '">' +
        (slug === 'all' ? t('gallery.all') : targetLabel(slug)) + '<span>' + count + '</span></button>'
      ).join('') +
    '</div>' +
    '<div class="chip-row det-row">' +
      '<span class="chip-label">' + t('gallery.detector') + '</span>' +
      [['all', t('gallery.all')]].concat(detectors.map((d) => [String(d), 'D' + d])).map(([value, label]) =>
        '<button class="chip mini ' + (galleryView.detector === value ? 'on' : '') + '" data-det="' + value + '">' + label + '</button>'
      ).join('') +
    '</div>';

  el('gallerySearch').oninput = (ev) => {
    galleryView.query = ev.target.value.trim().toLowerCase();
    renderGallery();
    const field = el('gallerySearch');
    field.focus();
    field.setSelectionRange(field.value.length, field.value.length);
  };
  el('gallerySort').onchange = (ev) => { galleryView.sort = ev.target.value; renderGallery(); };
  el('galleryFilters').querySelectorAll('[data-filter]').forEach((b) => {
    b.onclick = () => { galleryView.filter = b.dataset.filter; renderGallery(); };
  });
  el('galleryFilters').querySelectorAll('[data-det]').forEach((b) => {
    b.onclick = () => { galleryView.detector = b.dataset.det; renderGallery(); };
  });

  const query = galleryView.query;
  let items = data.items.filter((item) => {
    if (galleryView.filter !== 'all' && item.slug !== galleryView.filter) return false;
    if (galleryView.detector !== 'all' && String(item.detector) !== galleryView.detector) return false;
    if (query && !searchableText(item).includes(query)) return false;
    return true;
  });

  const order = {
    recent: (a, b) => b.mjd - a.mjd,
    oldest: (a, b) => a.mjd - b.mjd,
    sources: (a, b) => b.sources - a.sources,
    brightest: (a, b) => b.brightest - a.brightest,
  };
  items = items.sort(order[galleryView.sort] || order.recent);

  el('galleryCount').textContent = t('gallery.count')
    .replace('{n}', items.length)
    .replace('{total}', data.total);

  if (!items.length) {
    el('galleryGrid').innerHTML = '<p class="hint">' + t('gallery.empty') + '</p>';
    return;
  }

  el('galleryGrid').innerHTML = items.map((item, index) =>
    '<article class="gcard" style="--det:' + (DETECTOR_COLOURS[item.detector] || '#7aa2ff') + ';--i:' + Math.min(index, 24) + '">' +
      '<a href="/explore?target=' + item.slug + '" data-route class="gcard-img">' +
        '<img src="' + item.image + '" alt="' + t('gallery.alt') + ' ' + item.date + '" loading="lazy" decoding="async">' +
        '<span class="gcard-det">D' + item.detector + '</span>' +
        '<span class="gcard-field">' + targetLabel(item.slug) + '</span>' +
      '</a>' +
      '<div class="gcard-body">' +
        '<time>' + item.date + '</time>' +
        '<p>' + describeFrame(item) + '</p>' +
      '</div>' +
    '</article>'
  ).join('');
}

/* ------------------------------------------------------------------ mouvement */

async function detectMotion() {
  if (state.epochs.length < 2) return;
  stop();

  // A pair across different detectors cannot be compared: brightness changes
  // with the wavelength each detector covers. Prefer the longest baseline
  // taken with the same detector.
  const byDetector = {};
  state.epochs.forEach((e) => {
    (byDetector[e.detector] = byDetector[e.detector] || []).push(e);
  });
  let first = state.epochs[0];
  let last = state.epochs[state.epochs.length - 1];
  const groups = Object.values(byDetector).filter((g) => g.length >= 2);
  if (groups.length) {
    const score = (g) => {
      const baseline = g[g.length - 1].mjd - g[0].mjd;
      return baseline * (1 + 0.5 * (g.length - 1));
    };
    const longest = groups.reduce((best, g) => (score(g) > score(best) ? g : best));
    first = longest[0];
    last = longest[longest.length - 1];
  }

  el('diffNote').textContent = t('motion.working');
  el('diffBox').hidden = false;
  el('viewer').hidden = true;
  el('diffMarks').innerHTML = '';
  el('motionList').innerHTML = '';

  let data;
  try {
    const response = await fetch('/api/diff?a=' + first.obs_id + '&b=' + last.obs_id);
    if (!response.ok) throw new Error('diff failed');
    data = await response.json();
  } catch (err) {
    el('diffNote').textContent = t('motion.failed');
    return;
  }

  el('diffImg').src = data.image;
  const ny = data.shape[0];
  const nx = data.shape[1];
  const sizePct = Math.min(26, (100 / nx) * 1.8);

  el('diffMarks').innerHTML = data.candidates.map((c) => {
    const left = ((c.x + 0.5) / nx) * 100;
    const top = ((c.y + 0.5) / ny) * 100;
    return '<div class="mark" style="left:' + left.toFixed(2) + '%;top:' + top.toFixed(2) +
      '%;width:' + sizePct.toFixed(2) + '%;aspect-ratio:1/1"><span>' + c.sigma + 'σ</span></div>';
  }).join('');

  el('motionList').innerHTML = data.candidates.length
    ? data.candidates.slice(0, 8).map((c, i) =>
        '<div class="cand"><span class="n">#' + (i + 1) + '</span>' +
        '<span class="p">RA ' + c.ra + ' · Dec ' + c.dec + '</span>' +
        '<span class="s">' + c.sigma + 'σ</span></div>').join('')
    : '<p class="note">' + t('motion.empty') + '</p>';

  const verdict = data.verdict || 'none';
  const banner = document.createElement('div');
  banner.className = 'verdict v-' + verdict;
  banner.textContent = t('verdict.' + verdict)
    .replace('{n}', data.counts.unmatched)
    .replace('{total}', data.counts.epoch_a);
  el('motionList').prepend(banner);

  el('diffNote').textContent = [
    t('motion.pixelpeaks').replace('{n}', data.pixel_peaks),
    t('motion.tolerance').replace('{t}', data.tolerance_arcsec),
    data.compat.same_detector ? '' : t('motion.crossband'),
    'D' + data.compat.detector_a + ' → D' + data.compat.detector_b + ' · Δ ' + data.compat.dt_days + ' j',
  ].filter(Boolean).join(' · ');
}

function closeDiff() {
  el('diffBox').hidden = true;
  el('viewer').hidden = false;
}

/* ------------------------------------------------------------------ pistes */

async function showTracks() {
  const box = el('trackBox');
  box.hidden = false;
  el('trackNote').textContent = t('track.working');
  el('trackList').innerHTML = '';

  let data;
  try {
    const response = await fetch('/api/track?target=' + state.target);
    if (!response.ok) throw new Error('track failed');
    data = await response.json();
  } catch (err) {
    el('trackNote').textContent = t('track.error');
    return;
  }

  if (!data.tracks.length) {
    el('trackNote').textContent = t('track.none');
    return;
  }

  el('trackNote').textContent = t('track.found')
    .replace('{n}', data.tracks.length)
    .replace('{c}', data.tracked);

  el('trackList').innerHTML = data.tracks.slice(0, 10).map((tr, i) =>
    '<div class="cand ' + (tr.continues ? 'is-track' : '') + '">' +
      '<span class="n">#' + (i + 1) + '</span>' +
      '<span class="p">' + tr.displacement_arcsec + '″ en ' + tr.duration_minutes + ' min</span>' +
      '<span class="p">' + Math.round(tr.speed_arcsec_per_hour) + '″/h</span>' +
      '<span class="s">' + (tr.continues ? t('track.confirmed') : t('track.unconfirmed')) + '</span>' +
    '</div>').join('');
}

/* ------------------------------------------------------------ bandes détecteurs */

const BAND_COLOURS = {
  1: '#7aa2ff', 2: '#4cd99c', 3: '#ffb020', 4: '#ff6b8a', 5: '#b78cff', 6: '#4fd8e8',
};

async function renderBands() {
  const strip = el('bandStrip');
  if (!strip || strip.dataset.ready === '1') return;

  let data;
  try {
    data = await (await fetch('/api/bands')).json();
  } catch (err) {
    strip.innerHTML = '<p class="hint">' + t('gallery.error') + '</p>';
    return;
  }

  const bands = data.bands || [];
  if (!bands.length) {
    strip.innerHTML = '<p class="hint">' + t('bands.loading') + '</p>';
    return;
  }

  const total = bands.reduce((sum, b) => sum + Math.max(b.max_um - b.min_um, 0.1), 0);

  strip.innerHTML = bands.map((b) => {
    const span = Math.max(b.max_um - b.min_um, 0.1);
    const share = (span / total) * 100;
    const colour = BAND_COLOURS[b.detector] || '#7aa2ff';
    return '<div class="band-seg" style="flex:' + share.toFixed(2) + ';--band:' + colour + '" ' +
      'title="D' + b.detector + ' · ' + b.min_um + '–' + b.max_um + ' µm · ' + b.frames + ' ' + t('bands.frames') + '">' +
      '<b>D' + b.detector + '</b>' +
      '<span>' + b.min_um.toFixed(2) + '–' + b.max_um.toFixed(2) + ' µm</span>' +
      '<i>' + b.frames + '</i>' +
    '</div>';
  }).join('');

  strip.dataset.ready = '1';
}

/* ------------------------------------------------------- frise des campagnes */

const cadence = { passes: [], epochA: null, epochB: null, target: null };

function passLabel(index) {
  return t('cmp.pass') + ' ' + index;
}

function shortMonth(date) {
  const months = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin',
    'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
  const monthsEn = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  const list = state.lang === 'fr' ? months : monthsEn;
  const parts = date.split('-');
  return list[Number(parts[1]) - 1] + ' ' + parts[0];
}

async function openCadence() {
  el('compareBox').hidden = false;
  el('cmpNote').textContent = t('cmp.loading');
  el('cadencePasses').innerHTML = '';
  el('cmpResult').innerHTML = '';

  if (cadence.target !== state.target) {
    cadence.passes = [];
    cadence.epochA = null;
    cadence.epochB = null;
    cadence.target = state.target;
  }

  try {
    const response = await fetch('/api/cadence?target=' + state.target);
    if (!response.ok) throw new Error('cadence failed');
    const data = await response.json();
    cadence.passes = data.passes || [];
    cadence.baselines = data.baselines || [];
  } catch (err) {
    el('cmpNote').textContent = t('cmp.nopair');
    return;
  }

  if (!cadence.passes.length) {
    el('cmpNote').textContent = t('cmp.nopair');
    return;
  }

  if (!cadence.epochA && cadence.passes.length > 1) {
    // Default to the consecutive pair whose separation is closest to one
    // survey cadence, preferring the same detector so brightness is comparable.
    let best = null;
    for (let i = 0; i < cadence.passes.length - 1; i += 1) {
      const a = cadence.passes[i];
      const b = cadence.passes[i + 1];
      const gap = Math.abs(b.mjd - a.mjd);
      const score = Math.abs(gap - 182.6) + (a.best.detector === b.best.detector ? 0 : 400);
      if (!best || score < best.score) best = { a, b, score };
    }
    cadence.epochA = best.a.best.obs_id;
    cadence.epochB = best.b.best.obs_id;
  } else if (!cadence.epochA) {
    cadence.epochA = cadence.passes[0].best.obs_id;
  }

  renderCadence();
  if (cadence.epochA && cadence.epochB) runCompare();
}

function renderCadence() {
  el('cadencePasses').innerHTML = cadence.passes.map((pass) => {
    const chosenA = cadence.epochA === pass.best.obs_id;
    const chosenB = cadence.epochB === pass.best.obs_id;
    return '<article class="pass ' + (chosenA ? 'is-a' : '') + (chosenB ? ' is-b' : '') + '">' +
      '<header><b>' + passLabel(pass.index) + '</b><time>' + pass.start + '</time></header>' +
      '<p class="pass-sub">' + shortMonth(pass.start) + ' · ' + pass.frames + ' ' + t('cmp.frames') +
        ' · D' + pass.best.detector + '</p>' +
      '<div class="pass-actions">' +
        '<button class="pick-a ' + (chosenA ? 'on' : '') + '" data-a="' + pass.best.obs_id + '">' + t('cmp.setA') + '</button>' +
        '<button class="pick-b ' + (chosenB ? 'on' : '') + '" data-b="' + pass.best.obs_id + '">' + t('cmp.setB') + '</button>' +
      '</div>' +
    '</article>';
  }).join('');

  el('cadencePasses').querySelectorAll('[data-a]').forEach((btn) => {
    btn.onclick = () => { cadence.epochA = btn.dataset.a; renderCadence(); runCompare(); };
  });
  el('cadencePasses').querySelectorAll('[data-b]').forEach((btn) => {
    btn.onclick = () => { cadence.epochB = btn.dataset.b; renderCadence(); runCompare(); };
  });

  const label = el('cmpBaseline');
  const a = cadence.epochA && cadence.passes.find((x) => x.best.obs_id === cadence.epochA);
  const b = cadence.epochB && cadence.passes.find((x) => x.best.obs_id === cadence.epochB);
  if (a && b && a !== b) {
    label.textContent = shortMonth(a.start) + ' → ' + shortMonth(b.start);
    label.hidden = false;
  } else {
    label.hidden = true;
  }
}

async function runCompare() {
  if (!cadence.epochA || !cadence.epochB) {
    el('cmpNote').textContent = t('cmp.chooseTwo');
    return;
  }
  if (cadence.epochA === cadence.epochB) {
    el('cmpNote').textContent = t('cmp.sameEpoch');
    return;
  }

  el('cmpNote').textContent = t('cmp.working');
  el('cmpA').src = '/api/frames/' + cadence.epochA + '.webp';
  el('cmpB').src = '/api/frames/' + cadence.epochB + '.webp';
  el('cmpAdate').textContent = t('cmp.epoch1');
  el('cmpBdate').textContent = t('cmp.epoch2');

  let diff = null;
  try {
    const response = await fetch('/api/diff?a=' + cadence.epochA + '&b=' + cadence.epochB);
    if (response.ok) diff = await response.json();
  } catch (err) {
    diff = null;
  }

  if (!diff) {
    el('cmpNote').textContent = t('cmp.failed');
    el('cmpResult').innerHTML = '';
    return;
  }

  const same = diff.compat.same_detector;
  el('cmpNote').textContent = [
    (same ? t('cmp.note') : t('cmp.noteDiff'))
      .replace('{d}', Math.round(diff.compat.dt_days))
      .replace('{det}', diff.compat.detector_a)
      .replace('{detB}', diff.compat.detector_b),
  ].filter(Boolean).join(' · ');

  const verdictKey = diff.verdict === 'none' ? 'none' : diff.verdict;
  const metrics = [
    [diff.counts.epoch_a, t('cmp.m.a')],
    [diff.counts.epoch_b, t('cmp.m.b')],
    [diff.counts.matched, t('cmp.m.matched')],
    [diff.counts.unmatched, t('cmp.m.unmatched')],
  ];

  el('cmpResult').innerHTML =
    '<div class="verdict v-' + verdictKey + '">' +
      t('verdict.' + verdictKey).replace('{n}', diff.counts.unmatched).replace('{total}', diff.counts.epoch_a) +
    '</div>' +
    '<div class="cmp-metrics">' +
      metrics.map(([v, label]) => '<div><b>' + v + '</b><span>' + label + '</span></div>').join('') +
    '</div>' +
    '<img class="cmp-diff" src="' + diff.image + '" alt="' + t('cmp.diffalt') + '">' +
    '<p class="note">' + t('cmp.diffnote').replace('{n}', diff.pixel_peaks) + '</p>';
}


/* ------------------------------------------------------------------ affichage */

function setFrames(a, b) {
  const A = el('frameA'), B = el('frameB');
  if (a) { A.src = `/api/frames/${a.obs_id}.webp`; A.classList.add('on'); }
  if (b) { B.src = `/api/frames/${b.obs_id}.webp`; } else { B.classList.remove('on'); }
}

function renderStamp(e) {
  el('stamp').innerHTML =
    `<b>${fmtDate(e.mjd, true)}</b><br>${e.obs_id} · D${e.detector}<br>` +
    `λ ${e.wavelength_um.toFixed(3)} µm · ${delta(state.epochs[0].mjd, e.mjd)}`;
}

function show(i, second) {
  state.i = i;
  const e = state.epochs[i];
  if (!e) return;
  el('viewerEmpty').hidden = true;
  setFrames(e, second || null);
  document.querySelectorAll('.tick').forEach((tk, k) => tk.classList.toggle('sel', k === i));
  renderStamp(e);
  loadMeta(e.obs_id);
  loadDescribe(e.obs_id);
}

async function loadDescribe(obsId) {
  const box = el('describe');
  if (!box) return;
  try {
    const data = await fetch(`/api/describe/${obsId}?lang=${state.lang}`).then((r) => r.json());
    box.hidden = false;
    box.innerHTML = `<b>${t('describe.title')}</b> ${data.text}`;
  } catch (err) {
    box.hidden = true;
  }
}

function buildTrack() {
  const track = el('track');
  track.innerHTML = '';
  state.epochs.forEach((e, k) => {
    const d = document.createElement('div');
    d.className = 'tick';
    d.title = `${fmtDate(e.mjd, true)} — ${e.wavelength_um.toFixed(3)} µm`;
    d.innerHTML = `<div class="w">${shortDate(e.mjd)}</div>
                   <div class="d">${delta(state.epochs[0].mjd, e.mjd)}</div>`;
    d.onclick = () => { stop(); show(k); };
    track.appendChild(d);
  });
}

async function loadMeta(obsId) {
  try {
    const m = await fetch(`/api/metadata/${obsId}`).then((r) => r.json());
    const flags = (m.flags_top || []).map((f) => `${f.value} (${f.count})`).join(' · ');
    el('meta').innerHTML = `
      <dt>OBSID</dt><dd>${m.obs_id}</dd>
      <dt>Date</dt><dd>${fmtDate(m.mjd, false)}</dd>
      <dt>MJD</dt><dd>${m.mjd.toFixed(5)}</dd>
      <dt>Détecteur</dt><dd>D${m.detector} / 6</dd>
      <dt>Bande</dt><dd>${m.wavelength_range_um[0]} – ${m.wavelength_range_um[1]} µm</dd>
      <dt>Cutout</dt><dd>${m.cutout_wavelength_um[0]} – ${m.cutout_wavelength_um[1]} µm</dd>
      <dt>Pixels valides</dt><dd>${(m.valid_fraction * 100).toFixed(1)} %</dd>
      <dt>Unité</dt><dd>${m.unit}</dd>
      <dt>Flags</dt><dd>${flags || '—'}</dd>
      <dt>Calibration</dt><dd>${m.provenance.calib}</dd>`;
  } catch (err) { /* le panneau garde ses valeurs précédentes */ }
}

function drawSpectrum(data) {
  const pts = data.channels || [];
  if (pts.length < 2) {
    el('spectrum').innerHTML = `<p class="note">${t('dyn.specEmpty')}</p>`;
    return;
  }
  const W = 340, H = 165, ml = 40, mr = 10, mt = 12, mb = 28;
  const xs = pts.map((p) => p.wavelength_um);
  const ys = pts.map((p) => p.flux);
  const x0 = Math.min(...xs), x1 = Math.max(...xs);
  const y0 = Math.min(...ys) * 0.98, y1 = Math.max(...ys) * 1.02;
  const sx = (v) => ml + (v - x0) / (x1 - x0 || 1) * (W - ml - mr);
  const sy = (v) => H - mb - (v - y0) / (y1 - y0 || 1) * (H - mt - mb);
  const path = pts.map((p, k) => `${k ? 'L' : 'M'}${sx(p.wavelength_um).toFixed(1)},${sy(p.flux).toFixed(1)}`).join(' ');
  const dots = pts.map((p) => `<circle cx="${sx(p.wavelength_um).toFixed(1)}" cy="${sy(p.flux).toFixed(1)}" r="3" fill="#6ea8ff"/>`).join('');

  el('spectrum').innerHTML = `
    <svg viewBox="0 0 ${W} ${H}" style="width:100%;height:auto" role="img" aria-label="spectrum">
      <line x1="${ml}" y1="${H - mb}" x2="${W - mr}" y2="${H - mb}" stroke="#1b2942"/>
      <line x1="${ml}" y1="${mt}" x2="${ml}" y2="${H - mb}" stroke="#1b2942"/>
      <text x="${ml - 6}" y="${sy(y1) + 3}" text-anchor="end" fill="#6b7f9e" font-size="9" font-family="monospace">${y1.toFixed(1)}</text>
      <text x="${ml - 6}" y="${sy(y0) + 3}" text-anchor="end" fill="#6b7f9e" font-size="9" font-family="monospace">${y0.toFixed(1)}</text>
      <text x="${sx(x0)}" y="${H - 8}" text-anchor="middle" fill="#6b7f9e" font-size="9" font-family="monospace">${x0.toFixed(2)}</text>
      <text x="${sx(x1)}" y="${H - 8}" text-anchor="middle" fill="#6b7f9e" font-size="9" font-family="monospace">${x1.toFixed(2)}</text>
      <path d="${path}" fill="none" stroke="#4c8dff" stroke-width="1.6" opacity=".85"/>
      ${dots}
    </svg>
    <p class="note">${pts.length} ${t('dyn.channels')} · ${t('dyn.step')} ${data.median_step_um ?? '—'} µm</p>`;
}

function renderDynamic() {
  if (!state.epochs.length) return;
  const first = state.epochs[0];
  const last = state.epochs[state.epochs.length - 1];
  const span = last.mjd - first.mjd;
  const spanTxt = span < 1 ? `${Math.round(span * 1440)} ${t('dyn.min')}` : `${span.toFixed(1)} ${t('dyn.d')}`;
  const axes = [...new Set(state.epochs.map((e) => {
    const d = e.mjd - first.mjd;
    return d < 0.02 ? 'intra' : d < 1 ? 'night' : 'epoch';
  }))].map((a) => t(`dyn.${a}`));
  el('axisNote').textContent = `${t('dyn.axis')} : ${axes.join(' · ')}. ${t('dyn.span')} : ${spanTxt}.`;
  renderStamp(state.epochs[state.i]);

  const dets = [...new Set(state.epochs.map((e) => e.detector))];
  const note = el('compatNote');
  if (dets.length > 1) {
    note.hidden = false;
    note.textContent = `⚠ ${t('dyn.compat')} (${dets.map((d) => 'D' + d).join(' / ')})`;
  } else {
    note.hidden = true;
  }
}

/* ------------------------------------------------------------------ contrôles */

function stop() {
  state.playing = false;
  state.blinking = false;
  clearInterval(state.timer);
  state.timer = null;
  el('btnPlay').classList.remove('on');
  el('btnBlink').classList.remove('on');
  const e = state.epochs[state.i];
  if (e) setFrames(e, null);
}

function play() {
  if (state.playing) { stop(); return; }
  stop();
  state.playing = true;
  el('btnPlay').classList.add('on');
  state.timer = setInterval(() => show((state.i + 1) % state.epochs.length), 1100);
}

function blink() {
  if (state.blinking) { stop(); return; }
  stop();
  if (state.epochs.length < 2) return;
  state.blinking = true;
  el('btnBlink').classList.add('on');
  const last = state.epochs.length - 1;
  let flip = false;
  state.timer = setInterval(() => {
    flip = !flip;
    state.i = flip ? last : 0;
    document.querySelectorAll('.tick').forEach((tk, k) => tk.classList.toggle('sel', k === state.i));
    if (flip) {
      el('frameA').classList.remove('on');
      el('frameB').classList.add('on');
    } else {
      el('frameB').classList.remove('on');
      el('frameA').classList.add('on');
    }
    renderStamp(state.epochs[state.i]);
    loadMeta(state.epochs[state.i].obs_id);
  }, 640);
}

function bindControls() {
  el('btnPrev').onclick = () => { stop(); show(Math.max(0, state.i - 1)); };
  el('btnNext').onclick = () => { stop(); show(Math.min(state.epochs.length - 1, state.i + 1)); };
  el('btnPlay').onclick = play;
  el('btnBlink').onclick = blink;
  el('btnLast').onclick = () => { stop(); show(state.epochs.length - 1); };
  el('btnDiff').onclick = detectMotion;
  el('btnCompare').onclick = openCadence;
  el('btnCompareClose').onclick = () => { el('compareBox').hidden = true; };
  el('btnTrack').onclick = showTracks;
  el('btnTrackClose').onclick = () => { el('trackBox').hidden = true; };

  document.querySelectorAll('.zoom button').forEach((b) => {
    b.onclick = () => {
      document.querySelectorAll('.zoom button').forEach((o) => o.classList.remove('on'));
      b.classList.add('on');
      el('viewer').style.setProperty('--zoom', b.dataset.zoom);
    };
  });
  el('btnDiffBack').onclick = closeDiff;

  el('btnRefresh').onclick = async () => {
    el('btnRefresh').disabled = true;
    try {
      await fetch('/api/refresh', { method: 'POST' });
      await loadEpochs();
    } finally {
      el('btnRefresh').disabled = false;
    }
  };

  document.addEventListener('keydown', (ev) => {
    if (ev.key === 'Escape' && !el('sheetBox').hidden) closeSheet();
  });

  document.addEventListener('keydown', (ev) => {
    if (currentRoute() !== 'explore') return;
    if (ev.code === 'Space') { ev.preventDefault(); play(); }
    if (ev.code === 'ArrowRight') el('btnNext').click();
    if (ev.code === 'ArrowLeft') el('btnPrev').click();
  });
}

/* ------------------------------------------------------------------ amorçage */

function initReveal() {
  if (!('IntersectionObserver' in window)) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add('in'); observer.unobserve(entry.target); }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach((node) => {
    node.classList.add('js-armed');
    observer.observe(node);
  });
}

function init() {
  const saved = localStorage.getItem('skytrace.v2.lang');
  applyLang(saved === 'fr' ? 'fr' : 'en');

  document.querySelectorAll('.lang button').forEach((b) => {
    b.onclick = () => { applyLang(b.dataset.lang); if (state.epochs.length) loadDescribe(state.epochs[state.i].obs_id); };
  });

  const form = el('coordForm');
  if (form) bindFreeRegion();

  bindControls();
  initReveal();
  showRoute();
  loadStats();

  // A link carries the field it points at, so a shared URL opens the same sky.
  const params = new URLSearchParams(location.search);
  if (params.get('target')) state.target = params.get('target');
  const linkRa = parseFloat(params.get('ra'));
  const linkDec = parseFloat(params.get('dec'));
  if (Number.isFinite(linkRa) && Number.isFinite(linkDec)) {
    state.target = 'custom';
    fetch(`/api/collect?ra=${linkRa}&dec=${linkDec}&slug=custom&limit=8`, { method: 'POST' })
      .then(() => setTimeout(loadEpochs, 1500))
      .catch(() => loadEpochs());
  }
  if (params.get("cadence") === "1") {
    const waitCadence = setInterval(() => {
      if (state.epochs.length > 1) {
        clearInterval(waitCadence);
        openCadence();
      }
    }, 300);
    setTimeout(() => clearInterval(waitCadence), 25000);
  }

  if (params.get("diff") === "1") {
    const wait = setInterval(() => {
      if (state.epochs.length > 1) {
        clearInterval(wait);
        detectMotion();
      }
    }, 300);
    setTimeout(() => clearInterval(wait), 20000);
  }
}

init();
