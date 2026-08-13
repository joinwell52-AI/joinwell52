const $ = (selector) => document.querySelector(selector)
const state = { data: null, selected: null }

function escapeHtml(value = '') {
  return String(value).replace(/[&<>"']/g, (char) => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' })[char])
}

function markdown(value) {
  const safe = escapeHtml(value)
  return safe.split('\n').map((line) => {
    if (line.startsWith('### ')) return `<h3>${line.slice(4)}</h3>`
    if (line.startsWith('## ')) return `<h2>${line.slice(3)}</h2>`
    if (line.startsWith('# ')) return `<h1>${line.slice(2)}</h1>`
    if (line.startsWith('- ')) return `<li>${line.slice(2)}</li>`
    if (/^\d+\.\s/.test(line)) return `<li>${line.replace(/^\d+\.\s/, '')}</li>`
    if (line.startsWith('```')) return '<hr>'
    return line ? `<p>${line}</p>` : '<br>'
  }).join('')
}

function toast(message, error = false) {
  const node = $('#toast')
  node.textContent = message
  node.className = `toast show${error ? ' error' : ''}`
  setTimeout(() => { node.className = 'toast' }, 2600)
}

async function api(path, options) {
  const response = await fetch(path, options)
  if (!response.ok) {
    const payload = await response.json().catch(() => ({}))
    throw new Error(payload.error || `HTTP ${response.status}`)
  }
  return response.headers.get('content-type')?.includes('json') ? response.json() : response.text()
}

function decisionName(value) {
  return ({
    'Approved Internal':'通过为内部研究',
    'Revision Required':'退回修改',
    'Promote to Article Candidate':'转公开文章候选',
    'Archived':'归档'
  })[value] || '待人工审核'
}

function renderSummary() {
  const { counts } = state.data
  $('#summary').innerHTML = [
    ['P2 研究对象', counts.objects], ['待审核', counts.pending], ['内部通过', counts.approved], ['文章候选', counts.promoted]
  ].map(([label, value]) => `<article><strong>${value}</strong><span>${label}</span></article>`).join('')
}

function renderStudies() {
  const studies = state.data.studies
  $('#study-list').innerHTML = studies.length ? studies.map((item) => `
    <button class="study-item${state.selected?.path === item.path ? ' active' : ''}" data-path="${escapeHtml(item.path)}">
      <span>${escapeHtml(item.date)}</span><strong>${escapeHtml(item.title)}</strong><small>${escapeHtml(decisionName(item.review?.currentDecision))}</small>
    </button>`).join('') : '<div class="empty-small">暂无专项稿件。Weekly 首次运行将先建立检查点；只有达到 5/10 才生成待审稿件。</div>'
  document.querySelectorAll('.study-item').forEach((button) => button.addEventListener('click', () => selectStudy(button.dataset.path)))
}

function renderRuns() {
  const runs = state.data.runs
  $('#run-list').innerHTML = runs.length ? runs.slice(0, 12).map((run) => {
    const triggered = run.objects.filter((item) => ['Special Study Candidate','Experiment Candidate','Risk Alert'].includes(item.outcome)).length
    return `<article><span>${escapeHtml(run.date)}</span><strong>${run.coverage.resolved} / ${run.coverage.due}</strong><small>触发 ${triggered} · ${escapeHtml(run.status)}</small></article>`
  }).join('') : '<div class="empty-small">暂无周检查记录。</div>'
}

async function selectStudy(path) {
  const study = state.data.studies.find((item) => item.path === path)
  if (!study) return
  state.selected = study
  renderStudies()
  const content = await api(`/api/content?path=${encodeURIComponent(path)}`)
  const current = study.review?.currentDecision
  $('#review-pane').innerHTML = `
    <header class="review-head"><div><span>${escapeHtml(study.date)} · PENDING REVIEW</span><h2>${escapeHtml(study.title)}</h2><p>${escapeHtml(path)}</p></div><b>${escapeHtml(decisionName(current))}</b></header>
    <section class="review-contract"><strong>人工审核门禁</strong><p>该稿件不会自动发布。只有选择“转公开文章候选”，才允许进入后续 Production / Publication。</p></section>
    <section class="markdown">${markdown(content)}</section>
    <section class="review-form"><label>审核人<input id="reviewer" value="Manual Reviewer" maxlength="100"></label><label>审核意见<textarea id="notes" rows="5" maxlength="5000" placeholder="说明通过、退回、转候选或归档的理由"></textarea></label><div class="actions"><button data-decision="Approved Internal">通过为内部研究</button><button data-decision="Revision Required">退回修改</button><button data-decision="Promote to Article Candidate">转公开文章候选</button><button data-decision="Archived">归档</button></div></section>`
  document.querySelectorAll('[data-decision]').forEach((button) => button.addEventListener('click', () => submitReview(button.dataset.decision)))
}

async function submitReview(decision) {
  if (!state.selected) return
  try {
    await api('/api/review', {
      method: 'POST',
      headers: { 'Content-Type':'application/json' },
      body: JSON.stringify({ studyPath: state.selected.path, decision, notes: $('#notes').value, reviewer: $('#reviewer').value })
    })
    toast(`已保存：${decisionName(decision)}`)
    await load(state.selected.path)
  } catch (error) { toast(error.message, true) }
}

async function showRules() {
  const content = await api(`/api/content?path=${encodeURIComponent(state.data.contractPath)}`)
  $('#rules-content').innerHTML = markdown(content)
  $('#rules-dialog').showModal()
}

async function load(selectedPath = null) {
  try {
    state.data = await api('/api/state')
    renderSummary(); renderStudies(); renderRuns()
    if (selectedPath) await selectStudy(selectedPath)
  } catch (error) { toast(error.message, true) }
}

$('#refresh').addEventListener('click', () => load(state.selected?.path))
$('#rules').addEventListener('click', showRules)
$('#rules-dialog .close').addEventListener('click', () => $('#rules-dialog').close())
load()
