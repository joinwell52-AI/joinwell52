const ALLOWED_ORIGINS = new Set([
  'https://joinwell52-ai.github.io',
  'https://joinwell52-ai.github.io/joinwell52'
]);

function corsHeaders(origin) {
  const allowed = origin && (origin === 'https://joinwell52-ai.github.io' || origin.startsWith('https://joinwell52-ai.github.io/'));
  return {
    'Access-Control-Allow-Origin': allowed ? origin : 'https://joinwell52-ai.github.io',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin'
  };
}

function json(res, status, body, origin) {
  res.statusCode = status;
  for (const [k, v] of Object.entries(corsHeaders(origin))) res.setHeader(k, v);
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(body));
}

function normalizeTexts(value) {
  if (!Array.isArray(value)) return [];
  return value
    .map(v => typeof v === 'string' ? v.trim() : '')
    .filter(Boolean)
    .slice(0, 24)
    .map(v => v.slice(0, 4000));
}

function extractJsonArray(text) {
  const raw = String(text || '').trim();
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
  } catch {}
  const match = raw.match(/\[[\s\S]*\]/);
  if (match) {
    try {
      const parsed = JSON.parse(match[0]);
      if (Array.isArray(parsed)) return parsed;
    } catch {}
  }
  return null;
}

export default async function handler(req, res) {
  const origin = req.headers.origin || '';

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    for (const [k, v] of Object.entries(corsHeaders(origin))) res.setHeader(k, v);
    return res.end();
  }

  if (req.method !== 'POST') return json(res, 405, { error: 'method_not_allowed' }, origin);

  const texts = normalizeTexts(req.body?.texts);
  if (!texts.length) return json(res, 400, { error: 'texts_required' }, origin);

  const token = process.env.AI_GATEWAY_API_KEY || process.env.VERCEL_OIDC_TOKEN;
  if (!token) return json(res, 503, { error: 'gateway_auth_unavailable' }, origin);

  const numbered = texts.map((t, i) => `${i + 1}. ${t}`).join('\n');
  const prompt = `Translate each item below from English to Simplified Chinese. Preserve code, URLs, product names, model names, API names, file paths, and common technical terms when appropriate. Return ONLY a valid JSON array of strings, same length and same order as the input. No markdown, no commentary.\n\n${numbered}`;

  try {
    const gateway = await fetch('https://ai-gateway.vercel.sh/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'openai/gpt-5-mini',
        messages: [
          { role: 'system', content: 'You are a precise English-to-Simplified-Chinese translation engine.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0
      })
    });

    if (!gateway.ok) {
      const detail = await gateway.text().catch(() => '');
      return json(res, gateway.status, { error: 'gateway_error', detail: detail.slice(0, 500) }, origin);
    }

    const payload = await gateway.json();
    const content = payload?.choices?.[0]?.message?.content || '';
    const translations = extractJsonArray(content);
    if (!translations || translations.length !== texts.length) {
      return json(res, 502, { error: 'invalid_translation_response' }, origin);
    }

    return json(res, 200, {
      translations: translations.map((v, i) => typeof v === 'string' && v.trim() ? v.trim() : texts[i]),
      provider: 'vercel-ai-gateway'
    }, origin);
  } catch (error) {
    return json(res, 500, { error: 'translation_failed', detail: String(error?.message || error) }, origin);
  }
}
