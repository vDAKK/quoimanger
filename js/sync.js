// Synchronisation du foyer via Firestore : préférences, menu, notes et liste de courses partagés entre appareils.
// Un foyer = un document `foyers/{code}`. Le code (aléatoire, non devinable) fait office de clé d'accès.

const FB_VERSION = '10.12.2';
const SYNC_FIELDS = ['prefs', 'feedback', 'planIds', 'planStart', 'shop', 'store', 'rayons'];

const Sync = {
  code: store.get('qm_household', null),
  status: 'off', // off | connecting | online | offline | error
  fb: null, ref: null, unsub: null,
  remote: {},          // dernier état connu côté serveur (pour n'envoyer que les différences)
  onRemote: null,      // callback(data) quand un autre appareil modifie le foyer
  onStatus: null,
  pushTimer: null, pending: null,

  get available() { return !!window.FIREBASE_CONFIG; },

  setStatus(s) { this.status = s; this.onStatus && this.onStatus(s); },

  async load() {
    if (this.fb) return this.fb;
    const base = `https://www.gstatic.com/firebasejs/${FB_VERSION}/`;
    const [appMod, fs] = await Promise.all([import(base + 'firebase-app.js'), import(base + 'firebase-firestore.js')]);
    const app = appMod.initializeApp(window.FIREBASE_CONFIG);
    let db;
    try {
      // cache local persistant : l'app reste utilisable hors connexion (au magasin) et se resynchronise ensuite
      db = fs.initializeFirestore(app, { localCache: fs.persistentLocalCache({ tabManager: fs.persistentMultipleTabManager() }) });
    } catch { db = fs.getFirestore(app); }
    if (window.FIREBASE_EMULATOR) fs.connectFirestoreEmulator(db, window.FIREBASE_EMULATOR.host, window.FIREBASE_EMULATOR.port); // tests locaux
    this.fb = { fs, db };
    return this.fb;
  },

  newCode() {
    const abc = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
    const rnd = crypto.getRandomValues(new Uint32Array(10));
    const c = [...rnd].map(n => abc[n % abc.length]).join('');
    return `${c.slice(0, 5)}-${c.slice(5)}`;
  },

  normalize(code) { return (code || '').toUpperCase().replace(/[^A-Z0-9]/g, '').replace(/^(.{5})(.{5})$/, '$1-$2'); },

  /** Crée un foyer à partir de l'état local de cet appareil. */
  async create(localState) {
    const { fs, db } = await this.load();
    const code = this.newCode();
    const ref = fs.doc(db, 'foyers', code);
    await fs.setDoc(ref, { ...this.clean(localState), createdAt: fs.serverTimestamp(), updatedAt: fs.serverTimestamp() });
    this.code = code; store.set('qm_household', code);
    await this.connect();
    return code;
  },

  /** Rejoint un foyer existant ; renvoie ses données (qui remplacent l'état local). */
  async join(rawCode) {
    const code = this.normalize(rawCode);
    if (!/^[A-Z0-9]{5}-[A-Z0-9]{5}$/.test(code)) throw new Error('Code invalide (format XXXXX-XXXXX)');
    const { fs, db } = await this.load();
    const snap = await fs.getDoc(fs.doc(db, 'foyers', code));
    if (!snap.exists()) throw new Error('Aucun foyer avec ce code');
    this.code = code; store.set('qm_household', code);
    this.remote = this.clean(snap.data());
    await this.connect();
    return this.clean(snap.data());
  },

  leave() {
    this.unsub && this.unsub();
    this.unsub = null; this.ref = null; this.code = null; this.remote = {};
    store.del('qm_household');
    this.setStatus('off');
  },

  async connect() {
    if (!this.code || !this.available) return;
    this.setStatus('connecting');
    try {
      const { fs, db } = await this.load();
      this.ref = fs.doc(db, 'foyers', this.code);
      this.unsub && this.unsub();
      this.unsub = fs.onSnapshot(this.ref, { includeMetadataChanges: true }, (snap) => {
        if (!snap.exists()) { this.setStatus('error'); return; }
        this.setStatus(snap.metadata.fromCache ? 'offline' : 'online');
        if (snap.metadata.hasPendingWrites) return; // écho de nos propres écritures
        // copies indépendantes : l'app modifie ses objets sur place, la référence serveur ne doit pas bouger avec
        const data = this.clean(snap.data());
        const changed = SYNC_FIELDS.filter(k => JSON.stringify(data[k] ?? null) !== JSON.stringify(this.remote[k] ?? null));
        this.remote = data;
        if (changed.length && this.onRemote) this.onRemote(this.clean(data), changed);
      }, (err) => { console.warn('Sync', err); this.setStatus('error'); });
    } catch (e) {
      console.warn('Sync indisponible', e);
      this.setStatus('error');
    }
  },

  clean(state) {
    const out = {};
    SYNC_FIELDS.forEach(k => { if (state[k] !== undefined) out[k] = state[k] ?? null; });
    return JSON.parse(JSON.stringify(out));
  },

  /** Envoie les champs modifiés (regroupés sur 400 ms). Les coches de courses sont envoyées une par une pour fusionner proprement. */
  push(localState) {
    if (!this.ref) return;
    this.pending = this.clean(localState);
    clearTimeout(this.pushTimer);
    this.pushTimer = setTimeout(() => this.flush(), 400);
  },

  async flush() {
    if (!this.ref || !this.pending) return;
    const { fs } = this.fb;
    const next = this.pending; this.pending = null;
    const args = [];
    for (const k of SYNC_FIELDS) {
      if (k === 'shop') {
        const before = this.remote.shop || {}, after = next.shop || {};
        const keys = new Set([...Object.keys(before), ...Object.keys(after)]);
        for (const key of keys) {
          if (!!before[key] === !!after[key]) continue;
          args.push(new fs.FieldPath('shop', key), after[key] ? true : fs.deleteField());
        }
        continue;
      }
      if (JSON.stringify(next[k] ?? null) !== JSON.stringify(this.remote[k] ?? null)) args.push(k, next[k] ?? null);
    }
    if (!args.length) return;
    args.push('updatedAt', fs.serverTimestamp());
    this.remote = { ...this.remote, ...this.clean(next) };
    try { await fs.updateDoc(this.ref, ...args); } catch (e) { console.warn('Sync push', e); this.setStatus('error'); }
  },

  inviteLink() {
    return `${location.origin}${location.pathname}#foyer=${this.code}`;
  },
};
