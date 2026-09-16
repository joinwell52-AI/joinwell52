import fs from 'node:fs/promises';
import path from 'node:path';

const DEV_API = 'https://dev.to/api';
const GOOGLE_TRANSLATE = 'https://translate.googleapis.com/translate_a/single';
const OUT = path.join('docs', 'public', 'chinese-layer', 'cache.json');
const USERNAME = 'joinwell52';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const hasEnglish = (v) => /[A-Za-z]{2}/.test(String(v || ''));
const hasChinese = (v) => /[\u3400-\u9fff]/.test(String(v || ''));

async function fetchJson(url, timeoutMs = 20000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      cache: 'no-store',
      headers: { Accept: 'application/vnd.forem.api-v1+json' },
      signal: controller.signal,
    });
    const text = await response.text();
    if (!response.ok) throw new Error(`${url} -> HTTP ${response.status}: ${text.slice(0, 200)}`);
    return JSON.parse(text);
  } finally {
    clearTimeout(timer);
  }
}

function chunks(value, max = 2800) {
  const src = String(value || '').trim();
  if (!src) return [];
  if (src.length <= max) return [src];
  const out = [];
  let rest = src;
  while (rest.length > max) {
    let cut = Math.max(
      rest.lastIndexOf('\n\n', max),
      rest.lastIndexOf('. ', max),
      rest.lastIndexOf('! ', max),
      rest.lastIndexOf('? ', max),
      rest.lastIndexOf('\n', max),
    );
    if (cut < max * 0.55) cut = max;
    out.push(rest.slice(0, cut + 1).trim());
    rest = rest.slice(cut + 1).trim();
  }
  if (rest) out.push(rest);
  return out;
}

async function translatePart(source) {
  if (!source || !hasEnglish(source)) return source;
  const u = new URL(GOOGLE_TRANSLATE);
  u.searchParams.set('client', 'gtx');
  u.searchParams.set('sl', 'auto');
  u.searchParams.set('tl', 'zh-CN');
  u.searchParams.set('dt', 't');
  u.searchParams.set('q', source);
  const response = await fetch(u, { headers: { 'User-Agent': 'Mozilla/5.0' } });
  const text = await response.text();
  if (!response.ok) throw new Error(`Google Translate HTTP ${response.status}: ${text.slice(0, 180)}`);
  const json = JSON.parse(text);
  const translated = Array.isArray(json?.[0])
    ? json[0].map((x) => (Array.isArray(x) && typeof x[0] === 'string' ? x[0] : '')).join('').trim()
    : '';
  if (!translated) throw new Error('Google Translate returned empty output');
  return translated;
}

async function translateText(value) {
  const src = String(value || '').trim();
  if (!src || !hasEnglish(src)) return src;
  const out = [];
  for (const part of chunks(src)) {
    out.push(await translatePart(part));
    await sleep(70);
  }
  return out.join('\n\n').trim();
}

function cleanBody(markdown) {
  return String(markdown || '')
    .replace(/^---[\s\S]*?---\s*/m, '')
    .replace(/```[\s\S]*?```/g, '\n[代码块]\n')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/<https?:\/\/[^>]+>/g, ' ')
    .replace(/https?:\/\/\S+/g, ' ')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/^#{1,6}\s*/gm, '')
    .replace(/^>\s?/gm, '')
    .replace(/^\s*[-*+]\s+/gm, '• ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function summaryArticle(article) {
  return {
    id: article.id,
    title: String(article.title || ''),
    description: String(article.description || ''),
    path: String(article.path || ''),
    url: article.url || article.canonical_url || '',
    canonical_url: article.canonical_url || article.url || '',
    published_at: article.published_at,
    cover_image: article.cover_image || '',
    social_image: article.social_image || '',
    positive_reactions_count: article.positive_reactions_count || 0,
    comments_count: article.comments_count || 0,
    tag_list: Array.isArray(article.tag_list) ? article.tag_list : [],
    user: article.user || {},
  };
}

async function enrichList(list, { descriptions = false } = {}) {
  const out = [];
  for (const article of list) {
    const item = summaryArticle(article);
    item._zhTitle = await translateText(item.title);
    if (descriptions && item.description) item._zhDesc = await translateText(item.description);
    out.push(item);
  }
  return out;
}

const popularRaw = await fetchJson(`${DEV_API}/articles?per_page=12`);
const latestRaw = await fetchJson(`${DEV_API}/articles/latest?per_page=12`);
const mineRaw = await fetchJson(`${DEV_API}/articles?username=${encodeURIComponent(USERNAME)}&per_page=100`);

if (!Array.isArray(popularRaw) || !popularRaw.length) throw new Error('DEV popular feed is empty');
if (!Array.isArray(latestRaw) || !latestRaw.length) throw new Error('DEV latest feed is empty');
if (!Array.isArray(mineRaw) || !mineRaw.length) throw new Error(`DEV @${USERNAME} feed is empty`);

console.log('Building Chinese titles/descriptions…');
const popular = await enrichList(popularRaw.slice(0, 12), { descriptions: true });
const latest = await enrichList(latestRaw.slice(0, 12), { descriptions: true });
const mine = await enrichList(mineRaw.slice(0, 30), { descriptions: false });

const detailIds = [...new Set([
  ...popular.map((x) => x.id),
  ...latest.map((x) => x.id),
  ...mine.slice(0, 24).map((x) => x.id),
].filter(Boolean))];

const bodies = {};
console.log(`Building ${detailIds.length} server-side article translations…`);
for (let i = 0; i < detailIds.length; i += 1) {
  const id = detailIds[i];
  const detail = await fetchJson(`${DEV_API}/articles/${id}`);
  const source = cleanBody(detail.body_markdown || detail.description || '');
  if (!source || !hasEnglish(source)) continue;
  const bodyZh = await translateText(source);
  if (!hasChinese(bodyZh)) throw new Error(`Article ${id} body translation contains no Chinese`);
  bodies[String(id)] = {
    title: String(detail.title || ''),
    titleZh: await translateText(detail.title || ''),
    bodyZh,
    canonical_url: detail.canonical_url || detail.url || '',
  };
  console.log(`BODY ${i + 1}/${detailIds.length} id=${id} chars=${bodyZh.length}`);
}

const payload = {
  schema: 'chinese-layer-cache/v1',
  generatedAt: new Date().toISOString(),
  username: USERNAME,
  popular,
  latest,
  mine,
  bodies,
};

const checks = [popular[0]?._zhTitle, mine[0]?._zhTitle, bodies[String(mine[0]?.id)]?.bodyZh].filter(Boolean);
if (checks.length < 3 || checks.some((v) => !hasChinese(v))) {
  throw new Error('Chinese Layer cache validation failed');
}

await fs.mkdir(path.dirname(OUT), { recursive: true });
await fs.writeFile(OUT, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
console.log(`CHINESE_LAYER_CACHE_OK ${OUT} popular=${popular.length} latest=${latest.length} mine=${mine.length} bodies=${Object.keys(bodies).length}`);
