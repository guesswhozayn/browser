import mongoose from 'mongoose';
import { extractTextContent } from './sites/html-utils';

const PEOPLE = [
  { name: 'Amina Tariq' },
  { name: 'Hamza Malik' },
  { name: 'Bilal Qureshi' },
  { name: 'Dr. Zoya Abbasi' },
  { name: 'Kamran Shah' },
];

const SITES = [
  {
    address: 'androon-lahore.zz',
    title: 'Walled City Heritage Gazette',
    author: 'Amina Tariq',
    html: `
      <article style="font-family: serif; line-height: 1.7; max-width: 660px; margin: 40px auto; color: #292524;">
        <h1 style="color: #78350f; border-bottom: 2px solid #b45309; padding-bottom: 8px;">Walled City Heritage Gazette</h1>
        <p>Morning mist wraps around Delhi Gate and the fragrant spices of Akbari Mandi. The centuries-old brickwork echoes with tales of artisans and poets.</p>
        <p>For documented architectural studies of Mughal arches, consult <a href="shahi-qila.zz">Shahi Qila Archives</a> or review the conservation field notes at <a href="anarkali-bazaar.zz">Anarkali Bazaar Chronicler</a>.</p>
        <p>Warning: Avoid the abandoned passage behind the northern bastion where the phantom records of <a href="rohtas-ruins.zz">rohtas-ruins.zz</a> were allegedly mislaid.</p>
      </article>
    `,
  },
  {
    address: 'shahi-qila.zz',
    title: 'Shahi Qila Architectural Survey',
    author: 'Amina Tariq',
    html: `
      <article style="font-family: sans-serif; line-height: 1.6; max-width: 650px; margin: 40px auto; color: #1e293b;">
        <h1 style="color: #047857;">Shahi Qila Architectural Survey</h1>
        <p>Surveys of Sheesh Mahal mirror mosaics and subterranean acoustics beneath the quadrangle.</p>
        <p>We correlate these geometric symmetries with musical modal charts cataloged in <a href="sur-sangeet.zz">Sur Sangeet Gharana</a> and miniature paintings preserved at <a href="chawkandi-tombs.zz">Chawkandi Tombs Guild</a>.</p>
        <p>Return to urban heritage walks at <a href="androon-lahore.zz">Walled City Heritage Gazette</a>.</p>
      </article>
    `,
  },
  {
    address: 'anarkali-bazaar.zz',
    title: 'Anarkali Bazaar Chronicler',
    author: 'Amina Tariq',
    html: `
      <article style="font-family: Georgia, serif; line-height: 1.7; max-width: 650px; margin: 40px auto; color: #334155;">
        <h1 style="color: #991b1b;">Anarkali Bazaar Chronicler: An Oral History</h1>
        <p>Before asphalt and bright neon storefronts, the bazaar was home to parchment binders, calico printers, and brass lantern smiths.</p>
        <p>Old bookbinders recall handwritten manuscripts preserved in the mythological <a href="lost-kutubkhana.zz">Lost Kutubkhana</a>, though no catalog survives.</p>
        <p>Cross-reference city surveys at <a href="androon-lahore.zz">Walled City Heritage Gazette</a> or discover astronomical instrument making in <a href="astrolabe-lahore.zz">Astrolabe Makers of Lahore</a>.</p>
      </article>
    `,
  },
  {
    address: 'sur-sangeet.zz',
    title: 'Sur Sangeet Classical Gharana',
    author: 'Hamza Malik',
    html: `
      <article style="font-family: monospace; line-height: 1.5; max-width: 680px; margin: 40px auto; background: #0f172a; color: #38bdf8; padding: 24px; border-radius: 6px;">
        <h1 style="color: #fde047; font-size: 1.4rem;">SUR SANGEET GHARANA // ARCHIVE</h1>
        <p>[Fajr Session] Raag Bhairav frequencies recorded through sarangi and tanpura resonance.</p>
        <p>Harmonics align with precision brass ratios recorded by <a href="astrolabe-lahore.zz" style="color: #a7f3d0;">Astrolabe Makers of Lahore</a>. Acoustic decay patterns match acoustic tests inside <a href="shahi-qila.zz" style="color: #a7f3d0;">Shahi Qila Archives</a>.</p>
        <p>Broadcast attempts toward coordinate <a href="desert-sufi-relay.zz" style="color: #f87171;">desert-sufi-relay.zz</a> across the Cholistan dunes met total radio silence.</p>
      </article>
    `,
  },
  {
    address: 'astrolabe-lahore.zz',
    title: 'Astrolabe Makers of Lahore',
    author: 'Hamza Malik',
    html: `
      <article style="font-family: Georgia, serif; line-height: 1.6; max-width: 650px; margin: 40px auto; color: #27272a;">
        <h1 style="color: #854d0e; border-bottom: 1px solid #ca8a04; padding-bottom: 6px;">Astrolabe Makers of Lahore</h1>
        <p>For centuries, master brass-founders crafted planispheric astrolabes aligning equatorial coordinates with the seasonal constellations of the subcontinent.</p>
        <p>We calibrate our brass celestial discs against meridian logs at <a href="chawkandi-tombs.zz">Chawkandi Tombs Guild</a> and acoustic intervals derived from <a href="sur-sangeet.zz">Sur Sangeet Gharana</a>.</p>
        <p>Botanical pigments used in brass lacquering are described in the <a href="shalimar-botany.zz">Shalimar Botany Folio</a>.</p>
      </article>
    `,
  },
  {
    address: 'shalimar-botany.zz',
    title: 'Shalimar Botany Folio',
    author: 'Dr. Zoya Abbasi',
    html: `
      <article style="font-family: sans-serif; line-height: 1.6; max-width: 640px; margin: 40px auto; color: #1c1917;">
        <h1 style="color: #166534;">Shalimar Botany Folio</h1>
        <p>Fed by canal waters, the tiered terraces of Shalimar cultivate heritage jasmine, champa blossoms, and medicinal herbs.</p>
        <p>Dr. Zoya Abbasi tracks aromatic distillation seasons against rainfall readings from the <a href="androon-lahore.zz">Walled City Heritage Gazette</a>.</p>
        <p>Detailed geo-botanical plates can be examined in the archives of <a href="chawkandi-tombs.zz">Chawkandi Tombs Guild</a>.</p>
      </article>
    `,
  },
  {
    address: 'chawkandi-tombs.zz',
    title: 'Chawkandi Tombs Masonry Guild',
    author: 'Dr. Zoya Abbasi',
    html: `
      <article style="font-family: sans-serif; line-height: 1.6; max-width: 650px; margin: 40px auto; color: #09090b;">
        <h1 style="color: #57534e; font-weight: 700;">Chawkandi Tombs Masonry Guild</h1>
        <p>Intricate yellow sandstone carvings throughout Sindh depict equestrian warriors, jewelry patterns, and cosmic rosettes.</p>
        <p>Our stone alignment surveys synchronize with celestial observations from <a href="astrolabe-lahore.zz">Astrolabe Makers of Lahore</a> and soil drainage records at <a href="androon-lahore.zz">Androon Lahore</a>.</p>
        <p>Field parties attempting to survey <a href="anarkali-bazaar.zz">Anarkali Bazaar</a> or find the forgotten <a href="makli-mirage.zz">makli-mirage.zz</a> reported road closures.</p>
      </article>
    `,
  },
  {
    address: 'khyber-chronicles.zz',
    title: 'Khyber Pass Caravanserai Logs',
    author: 'Bilal Qureshi',
    html: `
      <article style="font-family: monospace; line-height: 1.5; max-width: 660px; margin: 40px auto; color: #15803d; background: #052e16; padding: 24px; border-radius: 8px;">
        <h1 style="color: #4ade80;">> KHYBER_PASS // CARAVANSERAI LOGS</h1>
        <p>Mountain gate telemetry nominal. Tea houses active along the historic trade route.</p>
        <p>Incoming transit manifests correlate with musical folklore recorded at <a href="sur-sangeet.zz" style="color: #a7f3d0;">Sur Sangeet Gharana</a> and Indus basin records at <a href="indus-delta.zz" style="color: #a7f3d0;">Indus Delta Observatory</a>.</p>
        <p>A traveler claims the trade ledgers of <a href="lost-kutubkhana.zz" style="color: #fca5a5;">lost-kutubkhana.zz</a> are safeguarded in an unmarked valley.</p>
      </article>
    `,
  },
  {
    address: 'indus-delta.zz',
    title: 'Indus Delta Hydrology Observatory',
    author: 'Bilal Qureshi',
    html: `
      <article style="font-family: sans-serif; line-height: 1.6; max-width: 650px; margin: 40px auto; color: #334155;">
        <h1 style="color: #0369a1;">Indus Delta Hydrology Observatory</h1>
        <p>Monitoring tidal mangrove forests, silt shifts, and seasonal river discharge flowing into the Arabian Sea.</p>
        <p>We correlate saline intrusion curves with seismic sounding surveys from <a href="shahi-qila.zz">Shahi Qila Archives</a> and northern mountain passes at <a href="khyber-chronicles.zz">Khyber Pass Caravanserai Logs</a>.</p>
        <p>Colleagues at the <a href="potohar-plateau.zz">Potohar Plateau Geological Survey</a> report matching tectonic pressures.</p>
      </article>
    `,
  },
  {
    address: 'potohar-plateau.zz',
    title: 'Potohar Plateau Geological Survey',
    author: 'Kamran Shah',
    html: `
      <article style="font-family: sans-serif; line-height: 1.6; max-width: 650px; margin: 40px auto; color: #1e293b;">
        <h1 style="color: #4338ca;">Potohar Plateau Geological Survey</h1>
        <p>Ancient sandstone ridges, fossil beds, and salt range geology spanning the Soan River basin.</p>
        <p>Weathering patterns recorded across these gorges mirror floral bloom records in the <a href="shalimar-botany.zz">Shalimar Botany Folio</a>.</p>
        <p>Consult our regional fault maps verified against <a href="chawkandi-tombs.zz">Chawkandi Tombs Guild</a> or examine urban heritage baselines at <a href="androon-lahore.zz">Walled City Heritage Gazette</a>.</p>
      </article>
    `,
  },
];

const BASE_TIMESTAMP = new Date('2026-11-05T10:00:00.000Z').getTime();

const VISITS_TIMELINE = [
  { person: 'Kamran Shah', address: 'potohar-plateau.zz', via: 'typed', offsetSec: 60 },
  { person: 'Kamran Shah', address: 'shalimar-botany.zz', via: 'link', offsetSec: 240 },
  { person: 'Kamran Shah', address: 'androon-lahore.zz', via: 'link', offsetSec: 480 },
  { person: 'Kamran Shah', address: 'shahi-qila.zz', via: 'link', offsetSec: 720 },
  { person: 'Kamran Shah', address: 'sur-sangeet.zz', via: 'link', offsetSec: 960 },
  { person: 'Kamran Shah', address: 'astrolabe-lahore.zz', via: 'link', offsetSec: 1200 },
  { person: 'Kamran Shah', address: 'chawkandi-tombs.zz', via: 'link', offsetSec: 1440 },
  { person: 'Kamran Shah', address: 'anarkali-bazaar.zz', via: 'link', offsetSec: 1680 },
  { person: 'Kamran Shah', address: 'lost-kutubkhana.zz', via: 'link', offsetSec: 1920 },
  { person: 'Kamran Shah', address: 'anarkali-bazaar.zz', via: 'back', offsetSec: 2040 },
  { person: 'Kamran Shah', address: 'androon-lahore.zz', via: 'history', offsetSec: 2280 },
  { person: 'Kamran Shah', address: 'khyber-chronicles.zz', via: 'search', offsetSec: 2520 },
  { person: 'Kamran Shah', address: 'indus-delta.zz', via: 'link', offsetSec: 2760 },
  { person: 'Kamran Shah', address: 'potohar-plateau.zz', via: 'link', offsetSec: 3000 },

  { person: 'Amina Tariq', address: 'androon-lahore.zz', via: 'typed', offsetSec: 180 },
  { person: 'Amina Tariq', address: 'shahi-qila.zz', via: 'link', offsetSec: 420 },
  { person: 'Amina Tariq', address: 'anarkali-bazaar.zz', via: 'typed', offsetSec: 660 },
  { person: 'Amina Tariq', address: 'rohtas-ruins.zz', via: 'link', offsetSec: 840 },
  { person: 'Amina Tariq', address: 'anarkali-bazaar.zz', via: 'back', offsetSec: 900 },
  { person: 'Amina Tariq', address: 'androon-lahore.zz', via: 'link', offsetSec: 1320 },
  { person: 'Amina Tariq', address: 'shalimar-botany.zz', via: 'search', offsetSec: 1800 },

  { person: 'Hamza Malik', address: 'astrolabe-lahore.zz', via: 'typed', offsetSec: 300 },
  { person: 'Hamza Malik', address: 'sur-sangeet.zz', via: 'link', offsetSec: 540 },
  { person: 'Hamza Malik', address: 'desert-sufi-relay.zz', via: 'link', offsetSec: 780 },
  { person: 'Hamza Malik', address: 'sur-sangeet.zz', via: 'back', offsetSec: 840 },
  { person: 'Hamza Malik', address: 'astrolabe-lahore.zz', via: 'back', offsetSec: 960 },
  { person: 'Hamza Malik', address: 'chawkandi-tombs.zz', via: 'link', offsetSec: 1500 },

  { person: 'Dr. Zoya Abbasi', address: 'shalimar-botany.zz', via: 'typed', offsetSec: 360 },
  { person: 'Dr. Zoya Abbasi', address: 'chawkandi-tombs.zz', via: 'link', offsetSec: 600 },
  { person: 'Dr. Zoya Abbasi', address: 'makli-mirage.zz', via: 'link', offsetSec: 840 },
  { person: 'Dr. Zoya Abbasi', address: 'chawkandi-tombs.zz', via: 'back', offsetSec: 900 },
  { person: 'Dr. Zoya Abbasi', address: 'potohar-plateau.zz', via: 'search', offsetSec: 1600 },
  { person: 'Dr. Zoya Abbasi', address: 'shalimar-botany.zz', via: 'history', offsetSec: 2100 },

  { person: 'Bilal Qureshi', address: 'khyber-chronicles.zz', via: 'typed', offsetSec: 400 },
  { person: 'Bilal Qureshi', address: 'indus-delta.zz', via: 'link', offsetSec: 700 },
  { person: 'Bilal Qureshi', address: 'shahi-qila.zz', via: 'link', offsetSec: 1100 },
  { person: 'Bilal Qureshi', address: 'androon-lahore.zz', via: 'link', offsetSec: 1600 },
  { person: 'Bilal Qureshi', address: 'khyber-chronicles.zz', via: 'history', offsetSec: 2400 },
];

async function seed() {
  const uri = process.env.MONGODB_URI ?? 'mongodb://127.0.0.1:27017/small-web';
  await mongoose.connect(uri);

  const db = mongoose.connection.db;
  if (!db) {
    throw new Error('Database connection failed');
  }

  await db.collection('people').deleteMany({});
  await db.collection('sites').deleteMany({});
  await db.collection('visits').deleteMany({});

  await db.collection('people').insertMany(PEOPLE);

  const siteDocs = SITES.map((site) => ({
    address: site.address.toLowerCase(),
    title: site.title,
    html: site.html.trim(),
    textContent: extractTextContent(site.html),
    author: site.author,
    updatedAt: new Date(BASE_TIMESTAMP),
    createdAt: new Date(BASE_TIMESTAMP),
  }));
  await db.collection('sites').insertMany(siteDocs);

  const visitDocs = VISITS_TIMELINE.map((visit) => ({
    person: visit.person,
    address: visit.address.toLowerCase(),
    via: visit.via,
    visitedAt: new Date(BASE_TIMESTAMP + visit.offsetSec * 1000),
  }));
  await db.collection('visits').insertMany(visitDocs);

  await db.collection('people').createIndex({ name: 1 }, { unique: true });
  await db.collection('sites').createIndex({ address: 1 }, { unique: true });
  await db.collection('sites').createIndex(
    { title: 'text', textContent: 'text', address: 'text', author: 'text' },
    { weights: { title: 5, address: 4, textContent: 2, author: 1 }, name: 'site_text_index' },
  );
  await db.collection('visits').createIndex({ person: 1, visitedAt: -1 });

  process.stdout.write(
    `Seeded ${PEOPLE.length} people, ${SITES.length} sites, and ${VISITS_TIMELINE.length} visits deterministically.\n`,
  );

  await mongoose.disconnect();
}

seed().catch((err) => {
  process.stderr.write(`Seed failed: ${String(err)}\n`);
  process.exit(1);
});
