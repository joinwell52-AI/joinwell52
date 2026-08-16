import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { readFile, readdir } from 'node:fs/promises'
import { join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const execFileAsync = promisify(execFile)
const ROOT = fileURLToPath(new URL('..', import.meta.url))
const RECORD_ROOT = join(ROOT, 'research', 'editorial', 'scorecards')

const walkJson = async directory => {
  const entries = await readdir(directory, { withFileTypes: true })
  const nested = await Promise.all(entries.map(async entry => {
    const path = join(directory, entry.name)
    if (entry.isDirectory()) return walkJson(path)
    return entry.isFile() && entry.name.endsWith('.json') ? [path] : []
  }))
  return nested.flat()
}

const { stdout } = await execFileAsync(process.execPath, [join(ROOT, 'scripts', 'editorial-scorecard-inventory.mjs')], {
  maxBuffer: 16 * 1024 * 1024
})
const prefix = 'OBSERVATION_SCORECARD_INVENTORY='
const line = stdout.split(/\r?\n/).find(value => value.startsWith(prefix))
if (!line) throw new Error('Scorecard inventory output not found.')
const inventory = JSON.parse(line.slice(prefix.length))

const records = []
for (const path of await walkJson(RECORD_ROOT)) {
  const record = JSON.parse(await readFile(path, 'utf8'))
  if (record.schema === 'observation-scorecard/v1' && record.status === 'Completed') {
    records.push({ path, record })
  }
}
records.sort((a, b) => b.record.reviewDate.localeCompare(a.record.reviewDate) || b.path.localeCompare(a.path))
const selected = records[0]
if (!selected) throw new Error('No Completed observation-scorecard/v1 record exists.')

const errors = []
const fail = message => errors.push(message)
const expected = new Map(inventory.items.map(item => [item.path, item.contentHash]))
const actual = new Map((selected.record.items || []).map(item => [item.path, item.contentHash]))

if (selected.record.coverage?.eligible !== inventory.eligible) {
  fail(`eligible mismatch: scorecard=${selected.record.coverage?.eligible}, live=${inventory.eligible}`)
}
if ((selected.record.items || []).length !== inventory.eligible) {
  fail(`item count mismatch: scorecard=${selected.record.items?.length || 0}, live=${inventory.eligible}`)
}
for (const [path, hash] of expected) {
  if (!actual.has(path)) fail(`missing live article: ${path}`)
  else if (actual.get(path) !== hash) fail(`content hash mismatch: ${path}`)
}
for (const path of actual.keys()) {
  if (!expected.has(path)) fail(`scorecard contains non-current article: ${path}`)
}

if (errors.length) {
  console.error(errors.map(error => `- ${error}`).join('\n'))
  process.exit(1)
}

console.log(`Current scorecard coverage verified: ${inventory.eligible}/${inventory.eligible} articles, exact canonical paths and SHA-256 hashes; source ${relative(ROOT, selected.path).replaceAll('\\', '/')}.`)
