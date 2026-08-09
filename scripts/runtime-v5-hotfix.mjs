import { readFileSync, writeFileSync } from 'node:fs'

const path = 'scripts/runtime-v5.mjs'
let source = readFileSync(path, 'utf8')

const start = source.indexOf('function validateMetric(metric, where) {')
const end = source.indexOf('function validateRecord(manifest, record, path) {')
if (start < 0 || end < 0 || end <= start) throw new Error('validator block not found')

let replacement = String.raw`function meaningful(value) {
  if (typeof value === 'string') return Boolean(text(value))
  if (value && typeof value === 'object' && !Array.isArray(value)) return Object.keys(value).length > 0
  return value !== undefined && value !== null
}

function validateMetric(metric, where) {
  if (!metric || typeof metric !== 'object' || Array.isArray(metric)) die(\`#{where}: metric must be an object\`)
  const hasCanonicalLabel = text(metric.label) && text(metric.label_zh)
  const hasLegacyName = text(metric.name)
  if ((!hasCanonicalLabel && !hasLegacyName) || !meaningful(metric.value)) {
    die(\`#{where}: metric requires label+label_zh or name, and value\`)
  }
}

function validateEvidence(item, where) {
  if (typeof item === 'string') {
    if (!text(item)) die(\`#{where}: evidence string must not be empty\`)
    return
  }
  if (!item || typeof item !== 'object' || Array.isArray(item)) die(\`#{where}: evidence must be a string or object\`)
  if (!text(item.label) || !text(item.label_zh)) die(\`#{where}: evidence object requires label and label_zh\`)
  if (![item.source, item.value, item.path, item.url].some((value) => text(value))) {
    die(\`#{where}: evidence object requires source, value, path or url\`)
  }
}

function validateArtifact(item, where) {
  if (typeof item === 'string') {
    if (!text(item)) die(\`#{where}: artifact string must not be empty\`)
    return
  }
  if (!item || typeof item !== 'object' || Array.isArray(item)) die(\`#{where}: artifact must be a string or object\`)
  if (!text(item.label) || !text(item.label_zh)) die(\`#{where}: artifact object requires label and label_zh\`)
  if (![item.path, item.url, item.commit, item.value].some((value) => text(value))) {
    die(\`#{where}: artifact object requires path, url, commit or value\`)
  }
}

function validateNarrativePair(result, field, fieldZh, where) {
  const value = result[field]
  if (typeof value === 'string') {
    if (!text(value) || !text(result[fieldZh])) die(\`#{where}: missing #{field} or #{fieldZh}\`)
    return
  }
  if (!meaningful(value)) die(\`#{where}: missing #{field}\`)
}

function validateResult(result, where, expectedTask, expectedStatus, taskIds, statuses) {
  if (!result || typeof result !== 'object' || Array.isArray(result)) die(\`#{where}: result must be an object\`)
  const task = text(result.task) || expectedTask
  const status = text(result.status) || expectedStatus
  if (!taskIds.has(task) || task !== expectedTask) die(\`#{where}: invalid task #{result.task}\`)
  if (!statuses.has(status)) die(\`#{where}: invalid status #{result.status}\`)

  validateNarrativePair(result, 'input', 'input_zh', where)
  validateNarrativePair(result, 'workResult', 'workResult_zh', where)
  validateNarrativePair(result, 'output', 'output_zh', where)
  validateNarrativePair(result, 'next', 'next_zh', where)

  if (status === 'Skipped' && (!text(result.reason) || !text(result.reason_zh))) {
    die(\`#{where}: Skipped result requires reason and reason_zh\`)
  }
  for (const field of ['metrics', 'evidence', 'artifacts']) {
    if (!Array.isArray(result[field])) die(\`#{where}: #{field} must be an array\`)
  }
  result.metrics.forEach((item, index) => validateMetric(item, \`#{where} metric #{index + 1}\`))
  result.evidence.forEach((item, index) => validateEvidence(item, \`#{where} evidence #{index + 1}\`))
  result.artifacts.forEach((item, index) => validateArtifact(item, \`#{where} artifact #{index + 1}\`))
  return status
}

`
replacement = replacement.replaceAll('#{', '${')
source = source.slice(0, start) + replacement + source.slice(end)

const oldCall = "      validateResult(result, `${path} result ${taskId}`, taskIds, statuses)\n      if (result.status !== status) die(`${path}: ${taskId} result status does not match taskStatus`)"
const newCall = "      const resultStatus = validateResult(result, `${path} result ${taskId}`, taskId, status, taskIds, statuses)\n      if (resultStatus !== status) die(`${path}: ${taskId} result status does not match taskStatus`)"
if (!source.includes(oldCall)) throw new Error('validateRecord call site not found')
source = source.replace(oldCall, newCall)
writeFileSync(path, source)
console.log('Patched Runtime V5 validator compatibility.')
