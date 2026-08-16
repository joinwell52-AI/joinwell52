import { access, readdir, readFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { join, relative, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = fileURLToPath(new URL('..', import.meta.url))
const EN_ROOT = join(ROOT, 'docs', 'en')
const ZH_ROOT = join(ROOT, 'docs', 'zh')
const ELIGIBLE_ROOTS = [
  'engineering',
  'industry',
  'digital-employee',
  'research/daily',
  'research/weekly'
]

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

const isPublished = text => {
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/)
  if (!match) return false
  return /^lifecycle:\s*["']?Published["']?\s*$/m.test(match[1])
}

const files = []
for (const root of ELIGIBLE_ROOTS) {
  const directory = join(EN_ROOT, root)
  const entries = await readdir(directory, { withFileTypes: true })
  for (const entry of entries) {
    if (!entry.isFile() || !entry.name.endsWith('.md') || entry.name === 'index.md') continue
    const sourcePath = join(directory, entry.name)
    const bytes = await readFile(sourcePath)
    const text = bytes.toString('utf8')
    if (!isPublished(text)) continue

    const relativeEnglishPath = normalize(relative(EN_ROOT, sourcePath))
    const canonicalPath = `/${relativeEnglishPath.replace(/\.md$/, '')}`
    const zhSourcePath = join(ZH_ROOT, relativeEnglishPath)
    files.push({
      path: canonicalPath,
      sourcePath: normalize(relative(ROOT, sourcePath)),
      pairedZhSourcePath: await exists(zhSourcePath) ? normalize(relative(ROOT, zhSourcePath)) : null,
      contentHash: sha256(bytes)
    })
  }
}

files.sort((a, b) => a.path.localeCompare(b.path))
const duplicatePaths = files.filter((item, index) => index > 0 && files[index - 1].path === item.path).map(item => item.path)
if (duplicatePaths.length) {
  throw new Error(`Duplicate canonical observation paths: ${[...new Set(duplicatePaths)].join(', ')}`)
}

const inventory = {
  schema: 'observation-scorecard-inventory/v1',
  hashAlgorithm: 'sha256',
  identity: 'english-canonical-path',
  eligible: files.length,
  items: files
}

console.log(`OBSERVATION_SCORECARD_INVENTORY=${JSON.stringify(inventory)}`)
