const DEV_API = 'https://dev.to/api';
const GOOGLE_TRANSLATE = 'https://translate.googleapis.com/translate_a/single';
const ORIGIN = 'https://joinwell52-ai.github.io';

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function hasChinese(value) {
  return /[\u3400-\u9fff]/.test(String(value || ''));
}

async function fetchJson(url, options = {}, timeoutMs = 12000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
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

async function translate(sample) {
  const u = new URL(GOOGLE_TRANSLATE);
  u.searchParams.set('client', 'gtx');
  u.searchParams.set('sl', 'auto');
  u.searchParams.set('tl', 'zh-CN');
  u.searchParams.set('dt', 't');
  u.searchParams.set('q', sample);

  try {
    const { response, json } = await fetchJson(u, { headers: { Origin: ORIGIN } });
    const allowOrigin = response.headers.get('access-control-allow-origin');
    assert(allowOrigin === '*' || allowOrigin === ORIGIN, `Browser CORS gate failed: access-control-allow-origin=${allowOrigin || '(missing)'}`);
    const translated = Array.isArray(json?.[0]) ? json[0].map(x => Array.isArray(x) ? (x[0] || '') : '').join('').trim() : '';
    assert(translated && translated !== sample, 'Translation output is empty or unchanged');
    assert(hasChinese(translated), `Translation output has no Chinese: ${translated.slice(0, 160)}`);
    return translated;
  } catch (error) {
    const status = Number(error?.status || 0);
    if ([403, 429].includes(status) || status >= 500) {
      console.warn(`TRANSLATION_PROVIDER_TRANSIENT_SKIP status=${status || 'unknown'} message=${error.message}`);
      return null;
    }
    throw error;
  }
}

const { json: home } = await fetchJson(`${DEV_API}/articles/latest?per_page=3`, { headers: { Accept: 'application/vnd.forem.api-v1+json' } });
assert(Array.isArray(home) && home.length > 0, 'DEV latest feed returned no articles');
const homeTitle = String(home[0]?.title || '').trim();
assert(homeTitle, 'DEV latest first article has no title');
const homeZh = await translate(homeTitle);
if (homeZh) console.log('HOME_TITLE_OK', JSON.stringify({ source: homeTitle.slice(0, 80), translated: homeZh.slice(0, 80) }));

const { json: mine } = await fetchJson(`${DEV_API}/articles?username=joinwell52&per_page=3`, { headers: { Accept: 'application/vnd.forem.api-v1+json' } });
assert(Array.isArray(mine) && mine.length > 0, 'DEV @joinwell52 returned no public articles');
const myTitle = String(mine[0]?.title || '').trim();
assert(myTitle, 'DEV @joinwell52 first article has no title');
const myZh = await translate(myTitle);
if (myZh) console.log('MY_TITLE_OK', JSON.stringify({ source: myTitle.slice(0, 80), translated: myZh.slice(0, 80) }));

const articleId = mine[0]?.id || home[0]?.id;
assert(articleId, 'No DEV article id available for body test');
const { json: detail } = await fetchJson(`${DEV_API}/articles/${articleId}`, { headers: { Accept: 'application/vnd.forem.api-v1+json' } });
assert(typeof detail?.body_html === 'string' && detail.body_html.length > 0, 'DEV article body_html is missing');
assert(/<[^>]+>/.test(detail.body_html), 'DEV article body_html does not contain HTML structure');

const bodySource = String(detail?.body_markdown || detail?.description || '')
  .replace(/```[\s\S]*?```/g, ' ')
  .replace(/`[^`]*`/g, ' ')
  .replace(/https?:\/\/\S+/g, ' ')
  .replace(/[#>*_\-\[\]()]/g, ' ')
  .replace(/\s+/g, ' ')
  .trim()
  .slice(0, 450);
assert(/[A-Za-z]{3}/.test(bodySource), 'DEV article body has no usable English sample');
const bodyZh = await translate(bodySource);
if (bodyZh) console.log('ARTICLE_BODY_OK', JSON.stringify({ source: bodySource.slice(0, 80), translated: bodyZh.slice(0, 80) }));

console.log('CHINESE_LAYER_SMOKE_PASS');
