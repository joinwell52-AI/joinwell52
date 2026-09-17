import sharp from 'sharp'
import fs from 'node:fs/promises'
import path from 'node:path'
const output = path.resolve('docs/public/assets/six-governance-20260918')
// Optional source directory from the built-in image tool. Omit to reuse committed covers.
const generated = process.argv[2]
const covers = {
  'checking-the-checker': 'exec-010587f6-5ffc-4b43-998c-aaa03714e0f5.png',
  'when-rules-change-meaning': 'exec-65020c2d-9423-4bd4-9d1f-96f9c91382b0.png'
}
await fs.mkdir(output, {recursive: true})
for (const [slug, source] of Object.entries(covers)) {
  if (generated) await sharp(path.join(generated, source)).resize(1600,900, {fit:'cover'}).png().toFile(path.join(output, slug+'.cover-v1.png'))
  await sharp(path.join(output, slug+'.cover-v1.png')).resize(320,180).png().toFile(path.join(output, slug+'.cover-thumb.png'))
  for (const lang of ['zh','en']) {
    await sharp(path.join(output, slug+'.figure.'+lang+'.svg')).png().toFile(path.join(output, slug+'.figure.'+lang+'.png'))
  }
}
console.log('2 covers, 2 thumbnails, 4 inline figures rendered')
