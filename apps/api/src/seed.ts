import mongoose from 'mongoose';
import { extractTextContent } from './sites/html-utils';

const PEOPLE = [
  { name: 'Elena Vance' },
  { name: 'Marcus Sterling' },
  { name: 'Kaelen Mori' },
  { name: 'Dr. Clara Thorne' },
  { name: 'Sora Tanaka' },
];

const SITES = [
  {
    address: 'tidepool.zz',
    title: 'Tidepool Observatory',
    author: 'Elena Vance',
    html: `
      <article style="font-family: sans-serif; line-height: 1.6; max-width: 640px; margin: 40px auto; color: #1e293b;">
        <h1 style="color: #0f172a; border-bottom: 2px solid #38bdf8; padding-bottom: 8px;">Tidepool Observatory</h1>
        <p>Every morning at low tide, the sea reveals miniature stone basins teeming with anemones and bioluminescent moss.</p>
        <p>The salinity shifts with every surge. For detailed sediment charts, refer to <a href="deep-shelf.zz">Deep Shelf Surveys</a> or check the older logging notes at <a href="sunken-beacon.zz">Sunken Beacon</a>.</p>
        <p>Warning: Avoid the northern crest where the signal at <a href="ghost-ship.zz">ghost-ship.zz</a> was supposedly sighted last equinox.</p>
      </article>
    `,
  },
  {
    address: 'deep-shelf.zz',
    title: 'Deep Shelf Bathymetry',
    author: 'Elena Vance',
    html: `
      <article style="font-family: sans-serif; line-height: 1.6; max-width: 640px; margin: 40px auto; color: #1e293b;">
        <h1 style="color: #0369a1;">Deep Shelf Bathymetry</h1>
        <p>Sonar sounding logs along the abyssal ridge indicate subterranean acoustic resonance.</p>
        <p>We triangulate echoes with the radio records collected by <a href="radio-solitude.zz">Radio Solitude</a> and flora samples cataloged in <a href="glass-garden.zz">Glass Garden</a>.</p>
        <p>Return to coastal readings at <a href="tidepool.zz">Tidepool Observatory</a>.</p>
      </article>
    `,
  },
  {
    address: 'sunken-beacon.zz',
    title: 'The Sunken Beacon',
    author: 'Elena Vance',
    html: `
      <article style="font-family: serif; line-height: 1.7; max-width: 640px; margin: 40px auto; color: #334155;">
        <h1 style="color: #1e293b;">The Sunken Beacon: An Eulogy</h1>
        <p>Before the tides claimed the western spit, the brass lantern guided salt-barges across the shoals.</p>
        <p>Now, underwater divers report its prismatic glass still mirrors the moon at midnight. Some say its keepers relocated to <a href="lost-library.zz">the Lost Library</a>, though no records exist.</p>
        <p>Examine the coastal chart at <a href="tidepool.zz">Tidepool Observatory</a> or the mechanics of illumination in <a href="clockwork-chronicle.zz">Clockwork Chronicle</a>.</p>
      </article>
    `,
  },
  {
    address: 'radio-solitude.zz',
    title: 'Radio Solitude (Frequency 142.8 kHz)',
    author: 'Marcus Sterling',
    html: `
      <article style="font-family: monospace; line-height: 1.5; max-width: 680px; margin: 40px auto; background: #0f172a; color: #38bdf8; padding: 24px; border-radius: 6px;">
        <h1 style="color: #f8fafc; font-size: 1.4rem;">RADIO SOLITUDE // 142.8 kHz</h1>
        <p>[04:12 UTC] Continuous shortwave carrier wave detected from coordinate sector delta.</p>
        <p>Signal resembles mechanical pendulum harmonics described in <a href="clockwork-chronicle.zz" style="color: #fde047;">Clockwork Chronicle</a>. Interference spikes match bathymetric pulses from <a href="deep-shelf.zz" style="color: #fde047;">Deep Shelf Surveys</a>.</p>
        <p>Attempted rebroadcast toward <a href="phantom-relay.zz" style="color: #f87171;">phantom-relay.zz</a> returned total carrier silence.</p>
      </article>
    `,
  },
  {
    address: 'clockwork-chronicle.zz',
    title: 'The Clockwork Chronicle',
    author: 'Marcus Sterling',
    html: `
      <article style="font-family: Georgia, serif; line-height: 1.6; max-width: 640px; margin: 40px auto; color: #27272a;">
        <h1 style="color: #713f12; border-bottom: 1px solid #d97706; padding-bottom: 6px;">The Clockwork Chronicle</h1>
        <p>Precision escapements and brass gear trains form our sole defense against chaotic temporal drift.</p>
        <p>We maintain the municipal astrolabe in coordination with <a href="cartographer-guild.zz">Cartographer Guild</a>. Current mechanical calibrations use telemetry from <a href="radio-solitude.zz">Radio Solitude</a>.</p>
        <p>Specimens of crystallized time are allegedly preserved in the <a href="glass-garden.zz">Glass Garden</a>.</p>
      </article>
    `,
  },
  {
    address: 'glass-garden.zz',
    title: 'Glass Garden Herbarium',
    author: 'Dr. Clara Thorne',
    html: `
      <article style="font-family: sans-serif; line-height: 1.6; max-width: 640px; margin: 40px auto; color: #1c1917;">
        <h1 style="color: #15803d;">Glass Garden Herbarium</h1>
        <p>Under concentric domes of leaded glass, xerophytic mosses thrive on condensed sea mist.</p>
        <p>The chlorophyll pigmentation absorbs anomalous spectrums. Dr. Thorne cross-references soil salinity against <a href="tidepool.zz">Tidepool Observatory</a> data.</p>
        <p>Detailed taxonomic plates can be requested from the <a href="cartographer-guild.zz">Cartographer Guild</a> archives.</p>
      </article>
    `,
  },
  {
    address: 'cartographer-guild.zz',
    title: 'Cartographer Guild Compendium',
    author: 'Dr. Clara Thorne',
    html: `
      <article style="font-family: sans-serif; line-height: 1.6; max-width: 640px; margin: 40px auto; color: #09090b;">
        <h1 style="color: #475569; font-weight: 700;">Cartographer Guild Compendium</h1>
        <p>Surveying the uncharted archipelago demands reconciling astronomical bearings with shifting coastal shoals.</p>
        <p>Our meridian marks align directly with pendulum references from <a href="clockwork-chronicle.zz">Clockwork Chronicle</a> and tide baselines from <a href="tidepool.zz">Tidepool</a>.</p>
        <p>Expeditions attempting to map <a href="sunken-beacon.zz">Sunken Beacon</a> or find the mythological <a href="void-horizon.zz">void-horizon.zz</a> have ceased responding.</p>
      </article>
    `,
  },
  {
    address: 'silent-terminal.zz',
    title: 'Silent Terminal Field Station',
    author: 'Kaelen Mori',
    html: `
      <article style="font-family: monospace; line-height: 1.5; max-width: 640px; margin: 40px auto; color: #15803d; background: #052e16; padding: 24px; border-radius: 8px;">
        <h1 style="color: #4ade80;">> SILENT_TERMINAL // NODE 07</h1>
        <p>Acoustic isolation chambers functional. Ambient decibel count: -12 dB.</p>
        <p>Incoming packet streams routed from <a href="radio-solitude.zz" style="color: #a7f3d0;">Radio Solitude</a> and mirrored to <a href="echo-chamber.zz" style="color: #a7f3d0;">Echo Chamber</a>.</p>
        <p>A rogue transmission claims the coordinates for <a href="lost-library.zz" style="color: #fca5a5;">lost-library.zz</a> were scrubbed intentionally.</p>
      </article>
    `,
  },
  {
    address: 'echo-chamber.zz',
    title: 'Echo Chamber Acoustic Labs',
    author: 'Kaelen Mori',
    html: `
      <article style="font-family: sans-serif; line-height: 1.6; max-width: 640px; margin: 40px auto; color: #334155;">
        <h1 style="color: #0284c7;">Echo Chamber Acoustic Labs</h1>
        <p>Investigating harmonic resonance across geologic faults and submerged structures.</p>
        <p>We correlate reverberations against bathymetric profiles from <a href="deep-shelf.zz">Deep Shelf Bathymetry</a> and telemetry at <a href="silent-terminal.zz">Silent Terminal</a>.</p>
        <p>The team at <a href="paper-sky.zz">Paper Sky Archive</a> claims these waves mirror atmospheric pressure fluctuations.</p>
      </article>
    `,
  },
  {
    address: 'paper-sky.zz',
    title: 'Paper Sky Meteorological Archive',
    author: 'Sora Tanaka',
    html: `
      <article style="font-family: sans-serif; line-height: 1.6; max-width: 640px; margin: 40px auto; color: #1e293b;">
        <h1 style="color: #6366f1;">Paper Sky Meteorological Archive</h1>
        <p>Hand-drawn barometric isobar sheets spanning seventy years of coastal monsoon seasons.</p>
        <p>Micro-climate shifts recorded here mirror botanical flowering cycles noted in the <a href="glass-garden.zz">Glass Garden</a>.</p>
        <p>Inspect our storm wind directions calibrated against <a href="cartographer-guild.zz">Cartographer Guild</a> maps, or trace wave heights at <a href="tidepool.zz">Tidepool Observatory</a>.</p>
      </article>
    `,
  },
];

const BASE_TIMESTAMP = new Date('2026-11-05T10:00:00.000Z').getTime();

const VISITS_TIMELINE = [
  // Sora Tanaka: The avid explorer who went everywhere across the small web
  { person: 'Sora Tanaka', address: 'paper-sky.zz', via: 'typed', offsetSec: 60 },
  { person: 'Sora Tanaka', address: 'glass-garden.zz', via: 'link', offsetSec: 240 },
  { person: 'Sora Tanaka', address: 'tidepool.zz', via: 'link', offsetSec: 480 },
  { person: 'Sora Tanaka', address: 'deep-shelf.zz', via: 'link', offsetSec: 720 },
  { person: 'Sora Tanaka', address: 'radio-solitude.zz', via: 'link', offsetSec: 960 },
  { person: 'Sora Tanaka', address: 'clockwork-chronicle.zz', via: 'link', offsetSec: 1200 },
  { person: 'Sora Tanaka', address: 'cartographer-guild.zz', via: 'link', offsetSec: 1440 },
  { person: 'Sora Tanaka', address: 'sunken-beacon.zz', via: 'link', offsetSec: 1680 },
  { person: 'Sora Tanaka', address: 'lost-library.zz', via: 'link', offsetSec: 1920 }, // 404 test
  { person: 'Sora Tanaka', address: 'sunken-beacon.zz', via: 'back', offsetSec: 2040 },
  { person: 'Sora Tanaka', address: 'tidepool.zz', via: 'history', offsetSec: 2280 },
  { person: 'Sora Tanaka', address: 'silent-terminal.zz', via: 'search', offsetSec: 2520 },
  { person: 'Sora Tanaka', address: 'echo-chamber.zz', via: 'link', offsetSec: 2760 },
  { person: 'Sora Tanaka', address: 'paper-sky.zz', via: 'link', offsetSec: 3000 },

  // Elena Vance: Coastline author checking her own sites and links
  { person: 'Elena Vance', address: 'tidepool.zz', via: 'typed', offsetSec: 180 },
  { person: 'Elena Vance', address: 'deep-shelf.zz', via: 'link', offsetSec: 420 },
  { person: 'Elena Vance', address: 'sunken-beacon.zz', via: 'typed', offsetSec: 660 },
  { person: 'Elena Vance', address: 'ghost-ship.zz', via: 'link', offsetSec: 840 }, // 404 test
  { person: 'Elena Vance', address: 'sunken-beacon.zz', via: 'back', offsetSec: 900 },
  { person: 'Elena Vance', address: 'tidepool.zz', via: 'link', offsetSec: 1320 },
  { person: 'Elena Vance', address: 'glass-garden.zz', via: 'search', offsetSec: 1800 },

  // Marcus Sterling: Radio & timing enthusiast
  { person: 'Marcus Sterling', address: 'clockwork-chronicle.zz', via: 'typed', offsetSec: 300 },
  { person: 'Marcus Sterling', address: 'radio-solitude.zz', via: 'link', offsetSec: 540 },
  { person: 'Marcus Sterling', address: 'phantom-relay.zz', via: 'link', offsetSec: 780 }, // 404 test
  { person: 'Marcus Sterling', address: 'radio-solitude.zz', via: 'back', offsetSec: 840 },
  { person: 'Marcus Sterling', address: 'clockwork-chronicle.zz', via: 'back', offsetSec: 960 },
  { person: 'Marcus Sterling', address: 'cartographer-guild.zz', via: 'link', offsetSec: 1500 },

  // Dr. Clara Thorne: Botanist & cartographer
  { person: 'Dr. Clara Thorne', address: 'glass-garden.zz', via: 'typed', offsetSec: 360 },
  { person: 'Dr. Clara Thorne', address: 'cartographer-guild.zz', via: 'link', offsetSec: 600 },
  { person: 'Dr. Clara Thorne', address: 'void-horizon.zz', via: 'link', offsetSec: 840 }, // 404 test
  { person: 'Dr. Clara Thorne', address: 'cartographer-guild.zz', via: 'back', offsetSec: 900 },
  { person: 'Dr. Clara Thorne', address: 'paper-sky.zz', via: 'search', offsetSec: 1600 },
  { person: 'Dr. Clara Thorne', address: 'glass-garden.zz', via: 'history', offsetSec: 2100 },

  // Kaelen Mori: Audio researcher
  { person: 'Kaelen Mori', address: 'silent-terminal.zz', via: 'typed', offsetSec: 400 },
  { person: 'Kaelen Mori', address: 'echo-chamber.zz', via: 'link', offsetSec: 700 },
  { person: 'Kaelen Mori', address: 'deep-shelf.zz', via: 'link', offsetSec: 1100 },
  { person: 'Kaelen Mori', address: 'tidepool.zz', via: 'link', offsetSec: 1600 },
  { person: 'Kaelen Mori', address: 'silent-terminal.zz', via: 'history', offsetSec: 2400 },
];

async function seed() {
  const uri = process.env.MONGODB_URI ?? 'mongodb://127.0.0.1:27017/small-web';
  await mongoose.connect(uri);

  const db = mongoose.connection.db;
  if (!db) {
    throw new Error('Database connection failed');
  }

  // Idempotent clean slate for deterministic state
  await db.collection('people').deleteMany({});
  await db.collection('sites').deleteMany({});
  await db.collection('visits').deleteMany({});

  // Seed People
  await db.collection('people').insertMany(PEOPLE);

  // Seed Sites with extracted plain-text and index creation
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

  // Seed Visits with realistic timestamps over 1 hour
  const visitDocs = VISITS_TIMELINE.map((visit) => ({
    person: visit.person,
    address: visit.address.toLowerCase(),
    via: visit.via,
    visitedAt: new Date(BASE_TIMESTAMP + visit.offsetSec * 1000),
  }));
  await db.collection('visits').insertMany(visitDocs);

  // Ensure indexes exist
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
