import fs from 'node:fs/promises';

const DEV_API = 'https://dev.to/api';
const GOOGLE_TRANSLATE = 'https://translate.googleapis.com/translate_a/single';
const ORIGIN = 'https://joinwell52-ai.github.io';
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function hasChinese(value) {
  return /[\u3400-\u9fff]/.test(String(value || ''));
}

async function fetchJson(url, options = {}, timeoutMs = 10000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal, cache: 'no-store' });
    const text = await response.text();
    if (!response.ok) {
      const error = new Error(`${url} -> HTTP ${response.status}: ${text.slice(0, 200)}`);
      error.status = response.status;
      throw error;
    }
    return { response, json: JSON.parse(text) };
  } finally {
    clearTimeout(timer);
  }
}

function assertCors(response, label) {
  const allowOrigin = response.headers.get('access-control-allow-origin');
  assert(
    allowOrigin === '*' || allowOrigin === ORIGIN,
    `${label} CORS failed: access-control-allow-origin=${allowOrigin || '(missing)'}`,
  );
}

async function fetchDev(url, label, attempts = 3) {
  let lastError;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const result = await fetchJson(url, { headers: { Origin: ORIGIN } }, 10000);
      assertCors(result.response, label);
      return result.json;
    } catch (error) {
      lastError = error;
      const transient = error?.name === 'AbortError' || !Number(error?.status) || Number(error?.status) >= 500 || Number(error?.status) === 429;
      if (!transient || attempt === attempts) throw error;
      console.warn(`DEV_SMOKE_RETRY label=${label} attempt=${attempt}/${attempts} reason=${error?.name || error?.message || error}`);
      await sleep(400 * attempt);
    }
  }
  throw lastError;
}

async function translate(sample) {
  const u = new URL(GOOGLE_TRANSLATE);
  u.searchParams.set('client', 'gtx');
  u.searchParams.set('sl', 'auto');
  u.searchParams.set('tl', 'zh-CN');
  u.searchParams.set('dt', 't');
  u.searchParams.set('q', sample);

  try {
    const { response, json } = await fetchJson(u, { headers: { Origin: ORIGIN } }, 10000);
    const allowOrigin = response.headers.get('access-control-allow-origin');
    assert(allowOrigin === '*' || allowOrigin === ORIGIN, `Translation CORS failed: ${allowOrigin || '(missing)'}`);
    const translated = Array.isArray(json?.[0]) ? json[0].map(x => Array.isArray(x) ? (x[0] || '') : '').join('').trim() : '';
    assert(translated && translated !== sample, 'Translation output is empty or unchanged');
    assert(hasChinese(translated), `Translation output has no Chinese: ${translated.slice(0, 160)}`);
    return translated;
  } catch (error) {
    const status = Number(error?.status || 0);
    if (error?.name === 'AbortError' || [403, 429].includes(status) || status >= 500) {
      console.warn(`TRANSLATION_PROVIDER_TRANSIENT_SKIP status=${status || 'unknown'} message=${error.message}`);
      return null;
    }
    throw error;
  }
}

const patchSource = await fs.readFile('docs/public/chinese-layer/dev-live-refresh-0.5.2.js', 'utf8');
assert(!patchSource.includes("'Cache-Control':'no-cache'"), 'Candidate still sends Cache-Control on cross-origin DEV request');
assert(!patchSource.includes("headers:{Accept:'application/vnd.forem.api-v1+json'"), 'Candidate still sends custom Accept on DEV live request');
assert(patchSource.includes("state:'all'"), 'Candidate mine feed does not use documented username + state=all path');
assert(patchSource.includes("cache:'no-store',credentials:'omit'"), 'Candidate live request is missing browser-safe no-store fetch');
console.log('CLIENT_STATIC_GATE_OK');

const nonce = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
const latest = await fetchDev(`${DEV_API}/articles/latest?per_page=12&_cl=${nonce}`, 'DEV latest');
assert(Array.isArray(latest) && latest.length > 0, 'DEV latest feed returned no articles');
console.log('DEV_LATEST_OK', JSON.stringify({ count: latest.length, first: latest[0]?.title, published_at: latest[0]?.published_at }));

const mine = await fetchDev(`${DEV_API}/articles?username=joinwell52&state=all&per_page=1000&page=1&_cl=${nonce}`, 'DEV mine');
assert(Array.isArray(mine) && mine.length > 0, 'DEV @joinwell52 state=all returned no articles');
const sortedMine = [...mine].sort((a,b) => new Date(b.published_at || b.created_at || 0) - new Date(a.published_at || a.created_at || 0));
const newest = sortedMine[0];
assert(newest?.id, 'DEV mine newest article has no id');
console.log('DEV_MINE_OK', JSON.stringify({ count: mine.length, newest: newest?.title, published_at: newest?.published_at, created_at: newest?.created_at }));

const detail = await fetchDev(`${DEV_API}/articles/${newest.id}?_cl=${nonce}`, 'DEV detail');
assert(typeof detail?.body_html === 'string' && detail.body_html.length > 0, 'DEV article body_html is missing');
assert(/<[^>]+>/.test(detail.body_html), 'DEV article body_html does not contain HTML structure');
console.log('DEV_DETAIL_OK', JSON.stringify({ id: newest.id, body_html_chars: detail.body_html.length }));

const sample = String(latest[0]?.title || newest?.title || '').trim();
assert(sample, 'No title available for translation test');
const zh = await translate(sample);
if (zh) console.log('TRANSLATION_OK', JSON.stringify({ source: sample.slice(0, 80), translated: zh.slice(0, 80) }));

console.log('CHINESE_LAYER_SMOKE_PASS');
