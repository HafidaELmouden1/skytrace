/* SkyTrace — logique de l'interface : routage, langue, explorateur. */

const I18N = {
  fr: {
    'brand.tag': 'SPHEREx · NASA',
    'nav.home': 'Accueil', 'nav.explore': 'Explorer', 'nav.learn': 'Comprendre',
    'nav.targets': 'Atlas du ciel',
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

    'home.eyebrow': 'Mission SPHEREx · Data Release 1',
    'home.h1a': 'Voir le ciel', 'home.h1b': 'bouger',
    'home.lead': "SPHEREx cartographie tout le ciel tous les six mois, dans 102 bandes infrarouges. SkyTrace vous montre la même parcelle de ciel à des dates différentes — et ce qui a changé entre les deux.",
    'home.cta1': 'Explorer le ciel', 'home.cta2': 'Comprendre les données',
    'home.stat1': 'observations chargées', 'home.stat2': 'jours de couverture',
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
    'brand.tag': 'SPHEREx · NASA',
    'nav.home': 'Home', 'nav.explore': 'Explore', 'nav.learn': 'Learn',
    'nav.targets': 'Sky atlas', 'nav.cta': 'Pick a place',

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

    'home.eyebrow': 'SPHEREx mission · Data Release 1',
    'home.h1a': 'Watch the sky', 'home.h1b': 'move',
    'home.lead': 'SPHEREx maps the entire sky every six months in 102 infrared bands. SkyTrace shows the same patch of sky at different dates — and what changed in between.',
    'home.cta1': 'Explore the sky', 'home.cta2': 'Understand the data',
    'home.stat1': 'observations loaded', 'home.stat2': 'days of coverage',
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
}

/* ------------------------------------------------------------------ routage */

const ROUTES = { '/': 'home', '/targets': 'targets', '/explore': 'explore', '/learn': 'learn' };

function currentRoute() {
  const path = window.location.pathname.replace(/\/$/, '') || '/';
  return ROUTES[path] || 'home';
}

function showRoute() {
  const name = currentRoute();
  document.querySelectorAll('.view').forEach((v) => { v.hidden = v.id !== `view-${name}`; });
  document.querySelectorAll('.nav-links a').forEach((a) => {
    const target = a.getAttribute('href');
    a.classList.toggle('active', ROUTES[target] === name);
  });
  window.scrollTo({ top: 0, behavior: 'instant' });
  if (name === 'explore') loadEpochs();
  if (name === 'home') loadStats();
  if (name === 'targets') loadAtlas();
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
    const s = await fetch(`/api/stats?target=${state.target}`).then((r) => r.json());
    state.stats = s;
    el('statFrames').textContent = s.frames ?? '—';
    el('statDays').textContent = s.days ? Math.round(s.days) : '—';
    el('statDet').textContent = s.detectors ?? '—';
    if (s.frames) {
      const eps = await fetch(`/api/epochs?target=${state.target}`).then((r) => r.json());
      if (eps.epochs && eps.epochs.length) {
        el('heroImg').src = `/api/frames/${eps.epochs[0].obs_id}.webp`;
      }
    }
  } catch (err) {
    /* l'accueil reste lisible même si l'API ne répond pas */
  }
}

async function loadEpochs() {
  const empty = el('viewerEmpty');
  empty.hidden = false;
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
        </div>
      </div>
    </article>`;
  }).join('');

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
  if (form) {
    form.onsubmit = async (ev) => {
      ev.preventDefault();
      const ra = Number(el('inRa').value);
      const dec = Number(el('inDec').value);
      el('collectNote').textContent = t('targets.starting');
      try {
        await fetch(`/api/collect?ra=${ra}&dec=${dec}&slug=custom&limit=12`, { method: 'POST' });
        pollAtlas();
      } catch (err) {
        el('collectNote').textContent = t('targets.noobs');
      }
    };
  }

  bindControls();
  initReveal();
  showRoute();
  loadStats();
}

init();
