import { promises as fs } from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'

const repositoryRoot = process.cwd()
const docsRoot = path.join(repositoryRoot, 'docs')
const publicRoot = path.join(docsRoot, 'public')
const outputRoot = path.join(publicRoot, 'assets', 'cover-thumbnails')
const markdownRoots = [path.join(docsRoot, 'zh'), path.join(docsRoot, 'en')]

async function markdownFiles(root) {
  const entries = await fs.readdir(root, { withFileTypes: true })
  const files = []
  for (const entry of entries) {
    const target = path.join(root, entry.name)
    if (entry.isDirectory()) files.push(...await markdownFiles(target))
    else if (entry.isFile() && entry.name.endsWith('.md')) files.push(target)
  }
  return files
}

function coverFromMarkdown(source) {
  const frontmatterCover = source.match(/^cover:\s*["']?([^"'\r\n]+)["']?\s*$/m)?.[1]
  if (frontmatterCover) return frontmatterCover.trim()
  return source.match(/<ArticleCover\b[\s\S]*?\bimage\s*=\s*["']([^"']+)["'][\s\S]*?>/)?.[1]
}

function thumbnailPath(cover) {
  const basename = path.posix.basename(cover).replace(/\.[^.]+$/, '')
  return `/assets/cover-thumbnails/${basename}.webp`
}

const markdown = (await Promise.all(markdownRoots.map(markdownFiles))).flat()
const coverToThumbnail = new Map()
const outputOwners = new Map()

for (const file of markdown) {
  const cover = coverFromMarkdown(await fs.readFile(file, 'utf8'))
  if (!cover?.startsWith('/assets/covers/')) continue

  const thumbnail = thumbnailPath(cover)
  const existingOwner = outputOwners.get(thumbnail)
  if (existingOwner && existingOwner !== cover) {
    throw new Error(`Thumbnail name collision: ${existingOwner} and ${cover} -> ${thumbnail}`)
  }
  outputOwners.set(thumbnail, cover)
  coverToThumbnail.set(cover, thumbnail)
}

await fs.rm(outputRoot, { recursive: true, force: true })
await fs.mkdir(outputRoot, { recursive: true })

let sourceBytes = 0
let thumbnailBytes = 0

for (const [cover, thumbnail] of [...coverToThumbnail].sort(([a], [b]) => a.localeCompare(b))) {
  const source = path.join(publicRoot, cover.replace(/^\//, ''))
  const destination = path.join(publicRoot, thumbnail.replace(/^\//, ''))
  const sourceStat = await fs.stat(source).catch(() => null)
  if (!sourceStat?.isFile()) throw new Error(`Article cover does not exist: ${cover}`)

  await sharp(source)
    .rotate()
    .resize(336, 189, { fit: 'cover', position: 'centre' })
    .webp({ quality: 74, effort: 4 })
    .toFile(destination)

  sourceBytes += sourceStat.size
  thumbnailBytes += (await fs.stat(destination)).size
}

const reduction = sourceBytes ? Math.round((1 - thumbnailBytes / sourceBytes) * 100) : 0
console.log(`Article cover thumbnails: ${coverToThumbnail.size} generated at 336x189 WebP; ${reduction}% fewer bytes than source covers.`)
