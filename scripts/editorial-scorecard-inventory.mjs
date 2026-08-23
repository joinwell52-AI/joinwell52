import { access, readdir, readFile, writeFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { join, relative, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = fileURLToPath(new URL('..', import.meta.url))
const EN_ROOT = join(ROOT, 'docs', 'en')
const ZH_ROOT = join(ROOT, 'docs', 'zh')
const DEBUG_OUTPUT = join(ROOT, 'docs', 'public', '_scorecard-inventory-run.json')
const ELIGIBLE_COLUMNS = new Set([
  'digital-employee',
  'industry-architecture',
  'open-source-engineering'
])
const ELIGIBLE_CATEGORIES = new Set([
  'daily',
  'weekly',
  'academic',
  'manifesto',
  'visual-essay'
])

const normalize = value => value.split(sep).join('/')
const sha256 = bytes => createHash('sha256').update(bytes).digest('hex')
const exists = async path => {
  try {
    await access(path)
    return true
  } catch {
    return false
  }
}

const frontmatterOf = text => {
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/)
  if (!match) return null
  const frontmatter = {}
  for (const line of match[1].split(/\r?\n/)) {
    const scalar = line.match(/^([A-Za-z0-9_-]+):\s*(.*?)\s*$/)
    if (!scalar) continue
    let value = scalar[2]
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1)
    }
    frontmatter[scalar[1]] = value
  }
  return frontmatter
}

const isEligiblePublicObservation = frontmatter => Boolean(
  frontmatter?.title &&
  frontmatter?.date &&
  ELIGIBLE_COLUMNS.has(frontmatter.column) &&
  ELIGIBLE_CATEGORIES.has(frontmatter.category)
)

const walkMarkdown = async directory => {
  const entries = await readdir(directory, { withFileTypes: true })
  const nested = await Promise.all(entries.map(async entry => {
    const path = join(directory, entry.name)
    if (entry.isDirectory()) return walkMarkdown(path)
    return entry.isFile() && entry.name.endsWith('.md') ? [path] : []
  }))
  return nested.flat()
}

const files = []
for (const sourcePath of await walkMarkdown(EN_ROOT)) {
  const bytes = await readFile(sourcePath)
  const text = bytes.toString('utf8')
  const frontmatter = frontmatterOf(text)
  if (!isEligiblePublicObservation(frontmatter)) continue

  const relativeEnglishPath = normalize(relative(EN_ROOT, sourcePath))
  const canonicalPath = `/${relativeEnglishPath.replace(/\.md$/, '').replace(/\/index$/, '')}`
  const zhSourcePath = join(ZH_ROOT, relativeEnglishPath)
  files.push({
    path: canonicalPath || '/',
    sourcePath: normalize(relative(ROOT, sourcePath)),
    pairedZhSourcePath: await exists(zhSourcePath) ? normalize(relative(ROOT, zhSourcePath)) : null,
    contentHash: sha256(bytes),
    column: frontmatter.column,
    category: frontmatter.category,
    date: frontmatter.date
  })
}

files.sort((a, b) => a.path.localeCompare(b.path))
const duplicatePaths = files.filter((item, index) => index > 0 && files[index - 1].path === item.path).map(item => item.path)
if (duplicatePaths.length) {
  throw new Error(`Duplicate canonical observation paths: ${[...new Set(duplicatePaths)].join(', ')}`)
}

const missingZhPairs = files.filter(item => !item.pairedZhSourcePath).map(item => item.path)
if (missingZhPairs.length) {
  throw new Error(`Eligible observations require a paired Chinese source for English canonical identity: ${missingZhPairs.join(', ')}`)
}

const inventory = {
  schema: 'observation-scorecard-inventory/v1',
  hashAlgorithm: 'sha256',
  identity: 'english-canonical-path',
  eligibility: 'same-frontmatter-filter-as-research-notes.data.ts',
  eligible: files.length,
  items: files
}

await writeFile(DEBUG_OUTPUT, `${JSON.stringify(inventory, null, 2)}\n`, 'utf8')
console.log(`OBSERVATION_SCORECARD_INVENTORY=${JSON.stringify(inventory)}`)
