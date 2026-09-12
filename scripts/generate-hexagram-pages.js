const fs = require('fs/promises');
const path = require('path');

const data = require('../src/data/data.json');
const wilhelmHexagrams = require('../src/data/hexagrams-wilhelm.json');

const root = path.join(__dirname, '..');
const publicDir = path.join(root, 'public');
const hexagramDir = path.join(publicDir, 'hexagrams');
const canonicalBase = 'https://iching.julianranieri.com';

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function slugify(hexagram) {
  return `${String(hexagram.number).padStart(2, '0')}-${hexagram.names[0]
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')}`;
}

function sacredTextUrl(hexagram) {
  return `https://sacred-texts.com/ich/ic${String(hexagram.number).padStart(2, '0')}.htm`;
}

function paragraphs(text) {
  if (!text || !text.trim()) return '';
  return text
    .split('\n\n')
    .map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`)
    .join('\n');
}

function lineReadings(hexagram) {
  const reference = wilhelmHexagrams.find((reading) => reading.id === hexagram.number);

  return Object.entries(hexagram.linesOverview || {})
    .filter(([index, line]) => (
      (line.title && line.title.trim()) ||
      (line.overview && line.overview.trim()) ||
      (reference && reference.lines[Number(index) - 1])
    ))
    .map(([index, line]) => `
      <article class="line-reading">
        <h3>Line ${index}${line.title ? `: ${escapeHtml(line.title)}` : ''}</h3>
        ${line.overview ? paragraphs(line.overview) : paragraphs(reference.lines[Number(index) - 1])}
        ${reference && reference.linesCommentary[Number(index) - 1] ? `<details><summary>Commentary</summary>${paragraphs(reference.linesCommentary[Number(index) - 1])}</details>` : ''}
      </article>
    `)
    .join('\n');
}

function referenceReading(hexagram) {
  const reference = wilhelmHexagrams.find((reading) => reading.id === hexagram.number);
  if (!reference) return '';

  return `
        <article class="reference-block">
          <h3>Judgment</h3>
          ${paragraphs(reference.judgment)}
          ${paragraphs(reference.judgmentCommentary)}
        </article>
        <article class="reference-block">
          <h3>Image</h3>
          ${paragraphs(reference.image)}
          ${paragraphs(reference.imageCommentary)}
        </article>
        <article class="reference-block">
          <h3>Commentary</h3>
          ${paragraphs(reference.commentary)}
        </article>
  `;
}

function hexagramPage(hexagram) {
  const slug = slugify(hexagram);
  const canonicalUrl = `${canonicalBase}/hexagrams/${slug}.html`;
  const names = hexagram.names.join(' / ');
  const description = `I Ching Hexagram ${hexagram.number}, ${names}: names, symbol, trigrams, local reading text, and online coin-toss reading context.`;
  const localOverview = paragraphs(hexagram.overview);
  const localLines = lineReadings(hexagram);
  const reference = referenceReading(hexagram);

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="description" content="${escapeHtml(description)}" />
    <meta property="og:title" content="I Ching Hexagram ${hexagram.number}: ${escapeHtml(hexagram.names[0])}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:type" content="article" />
    <meta property="og:url" content="${canonicalUrl}" />
    <link rel="canonical" href="${canonicalUrl}" />
    <link rel="stylesheet" href="../hexagrams.css" />
    <title>I Ching Hexagram ${hexagram.number}: ${escapeHtml(hexagram.names[0])}</title>
  </head>
  <body>
    <main class="page">
      <nav class="top-nav">
        <a href="../">Oracle I Ching</a>
        <a href="./">All Hexagrams</a>
      </nav>
      <header class="hero">
        <p class="eyebrow">I Ching Hexagram ${hexagram.number}</p>
        <h1><span>${escapeHtml(hexagram.character)}</span> ${escapeHtml(hexagram.names[0])}</h1>
        <p class="subtitle">${escapeHtml(names)}</p>
      </header>
      <section class="facts" aria-label="Hexagram details">
        <div><strong>Chinese</strong><span>${escapeHtml(hexagram.chineseName)}</span></div>
        <div><strong>Pinyin</strong><span>${escapeHtml(hexagram.pinyinName)}</span></div>
        <div><strong>Binary</strong><span>${escapeHtml(hexagram.binary)}</span></div>
      </section>
      <section class="content">
        <h2>Reading</h2>
        ${hexagram.tagLine ? `<p class="tagline">${escapeHtml(hexagram.tagLine)}</p>` : ''}
        ${localOverview || reference || `<p>This hexagram page gives Oracle I Ching a dedicated reference URL for Hexagram ${hexagram.number}. For the complete public-domain text, read the Legge translation linked below.</p>`}
      </section>
      ${localOverview && reference ? `<section class="content"><h2>Translation Reference</h2>${reference}</section>` : ''}
      ${localLines ? `<section class="content"><h2>Changing Lines</h2>${localLines}</section>` : ''}
      <section class="content links">
        <h2>Reference</h2>
        <a href="${sacredTextUrl(hexagram)}" rel="noreferrer">Compare Hexagram ${hexagram.number} with the public-domain Legge translation</a>
        <a href="../">Cast an online I Ching coin toss reading</a>
      </section>
    </main>
  </body>
</html>
`;
}

function indexPage(hexagrams) {
  const items = hexagrams.map((hexagram) => {
    const slug = slugify(hexagram);
    return `<li><a href="${slug}.html"><span>${escapeHtml(hexagram.character)}</span> Hexagram ${hexagram.number}: ${escapeHtml(hexagram.names[0])}</a></li>`;
  }).join('\n');

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="description" content="Browse all 64 I Ching hexagrams for Oracle I Ching, with hexagram names, symbols, readings, and public-domain translation links." />
    <meta property="og:title" content="I Ching Hexagrams | Oracle I Ching" />
    <meta property="og:description" content="Browse all 64 I Ching hexagrams and cast an online I Ching coin toss reading." />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${canonicalBase}/hexagrams/" />
    <link rel="canonical" href="${canonicalBase}/hexagrams/" />
    <link rel="stylesheet" href="../hexagrams.css" />
    <title>I Ching Hexagrams | Oracle I Ching</title>
  </head>
  <body>
    <main class="page">
      <nav class="top-nav">
        <a href="../">Oracle I Ching</a>
      </nav>
      <header class="hero">
        <p class="eyebrow">Oracle I Ching Reference</p>
        <h1>All 64 I Ching Hexagrams</h1>
        <p class="subtitle">Hexagram reference pages for online I Ching readings, coin toss results, and changing-line study.</p>
      </header>
      <ol class="hexagram-list">
        ${items}
      </ol>
    </main>
  </body>
</html>
`;
}

function stylesheet() {
  return `body {
  margin: 0;
  background: #e6e2fc;
  color: #1b1630;
  font-family: Georgia, 'Times New Roman', serif;
  line-height: 1.55;
}

a {
  color: #4a2370;
  font-weight: 700;
}

.page {
  width: min(860px, 100%);
  margin: 0 auto;
  padding: 28px 18px 56px;
}

.top-nav {
  display: flex;
  gap: 18px;
  margin-bottom: 44px;
}

.hero h1 {
  margin: 0 0 10px;
  font-size: clamp(2.3rem, 8vw, 4.8rem);
  line-height: 1;
}

.hero h1 span {
  display: inline-block;
  margin-right: 10px;
}

.eyebrow {
  margin: 0 0 8px;
  color: #4a4368;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.subtitle {
  margin: 0;
  font-size: 1.25rem;
  color: #4a4368;
}

.facts {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 12px;
  margin: 28px 0;
}

.facts div,
.content {
  border: 1px solid rgba(74, 35, 112, 0.25);
  background: rgba(255, 255, 255, 0.28);
  padding: 16px;
}

.facts strong,
.facts span {
  display: block;
}

.content {
  margin-bottom: 18px;
}

.content h2,
.line-reading h3 {
  margin-top: 0;
}

.reference-block {
  margin-bottom: 18px;
}

.reference-block h3 {
  margin: 0 0 8px;
}

details {
  margin-top: 10px;
}

summary {
  cursor: pointer;
  font-weight: 700;
  margin-bottom: 8px;
}

.tagline {
  font-weight: 700;
}

.links {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.hexagram-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 10px 18px;
  padding-left: 24px;
}

.hexagram-list li {
  padding: 6px 0;
}

.hexagram-list span {
  font-size: 1.4rem;
  vertical-align: middle;
}
`;
}

async function main() {
  await fs.rm(hexagramDir, { recursive: true, force: true });
  await fs.mkdir(hexagramDir, { recursive: true });

  await Promise.all(data.hexagrams.map((hexagram) => (
    fs.writeFile(path.join(hexagramDir, `${slugify(hexagram)}.html`), hexagramPage(hexagram), 'utf8')
  )));

  await fs.writeFile(path.join(hexagramDir, 'index.html'), indexPage(data.hexagrams), 'utf8');
  await fs.writeFile(path.join(publicDir, 'hexagrams.css'), stylesheet(), 'utf8');

  const urls = [
    `${canonicalBase}/`,
    `${canonicalBase}/hexagrams/`,
    ...data.hexagrams.map((hexagram) => `${canonicalBase}/hexagrams/${slugify(hexagram)}.html`)
  ];
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((url) => `  <url><loc>${url}</loc></url>`).join('\n')}
</urlset>
`;
  await fs.writeFile(path.join(publicDir, 'sitemap.xml'), sitemap, 'utf8');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
