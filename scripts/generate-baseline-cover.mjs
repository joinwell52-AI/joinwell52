#!/usr/bin/env node
import { createHash } from 'node:crypto'
import { mkdirSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { deflateSync } from 'node:zlib'

function argsOf(argv) {
  const out = {}
  for (let i = 2; i < argv.length; i += 1) {
    if (!argv[i].startsWith('--')) continue
    out[argv[i].slice(2)] = argv[i + 1] || ''
    i += 1
  }
  return out
}

const args = argsOf(process.argv)
if (!args.output || !args.item || !args.column || !args.title) {
  throw new Error('usage: node scripts/generate-baseline-cover.mjs --output <png> --item <id> --column <column> --title <title>')
}
if (path.extname(args.output).toLowerCase() !== '.png') throw new Error('baseline cover output must be .png')

const width = 1600
const height = 900
const rgba = Buffer.alloc(width * height * 4)
const seed = createHash('sha256').update([args.item, args.column, args.title].join('|')).digest()
const palettes = {
  'digital-employee': [[28, 25, 56], [94, 72, 210], [79, 211, 221], [238, 239, 255]],
  'industry-architecture': [[18, 38, 45], [36, 118, 109], [90, 205, 179], [231, 249, 244]],
  'open-source-engineering': [[20, 31, 50], [48, 102, 178], [229, 145, 62], [239, 245, 255]]
}
const palette = palettes[args.column] || [[24, 29, 43], [75, 93, 154], [74, 184, 194], [240, 244, 252]]

function mix(a, b, t) { return Math.round(a + (b - a) * t) }
function setPixel(x, y, color, alpha = 1) {
  if (x < 0 || y < 0 || x >= width || y >= height) return
  const i = (y * width + x) * 4
  const inv = 1 - alpha
  rgba[i] = Math.round(rgba[i] * inv + color[0] * alpha)
  rgba[i + 1] = Math.round(rgba[i + 1] * inv + color[1] * alpha)
  rgba[i + 2] = Math.round(rgba[i + 2] * inv + color[2] * alpha)
  rgba[i + 3] = 255
}
function rect(x0, y0, x1, y1, color, alpha = 1) {
  x0 = Math.max(0, Math.floor(x0)); y0 = Math.max(0, Math.floor(y0)); x1 = Math.min(width, Math.ceil(x1)); y1 = Math.min(height, Math.ceil(y1))
  for (let y = y0; y < y1; y += 1) for (let x = x0; x < x1; x += 1) setPixel(x, y, color, alpha)
}
function circle(cx, cy, r, color, alpha = 1) {
  const rr = r * r
  for (let y = Math.max(0, Math.floor(cy - r)); y < Math.min(height, Math.ceil(cy + r)); y += 1) {
    const dy = y - cy
    const dx = Math.sqrt(Math.max(0, rr - dy * dy))
    const start = Math.max(0, Math.floor(cx - dx)); const end = Math.min(width, Math.ceil(cx + dx))
    for (let x = start; x < end; x += 1) setPixel(x, y, color, alpha)
  }
}
function line(x0, y0, x1, y1, thickness, color, alpha = 1) {
  const steps = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0))
  for (let s = 0; s <= steps; s += 1) {
    const t = steps === 0 ? 0 : s / steps
    circle(x0 + (x1 - x0) * t, y0 + (y1 - y0) * t, thickness / 2, color, alpha)
  }
}

for (let y = 0; y < height; y += 1) {
  const t = y / (height - 1)
  const vignette = 0.08 + 0.18 * Math.abs(t - 0.5)
  for (let x = 0; x < width; x += 1) {
    const h = x / (width - 1)
    const glow = Math.max(0, 1 - Math.hypot(h - 0.68, t - 0.42) * 1.4)
    const c = [0, 1, 2].map((k) => Math.max(0, Math.min(255, mix(palette[0][k], palette[1][k], 0.22 * h + 0.16 * t + 0.12 * glow) - 255 * vignette)))
    const i = (y * width + x) * 4
    rgba[i] = c[0]; rgba[i + 1] = c[1]; rgba[i + 2] = c[2]; rgba[i + 3] = 255
  }
}

const a = seed[0] / 255, b = seed[1] / 255, c = seed[2] / 255
const horizon = 590 + Math.round((a - 0.5) * 70)
rect(0, horizon, width, height, palette[0], 0.28)
line(100, horizon - 10, 1500, horizon - 80 - Math.round(b * 90), 10, palette[2], 0.34)
line(180, 760, 1320, 240 + Math.round(c * 120), 4, palette[3], 0.16)

const motif = seed[3] % 3
if (motif === 0) {
  rect(230, 180, 420, 690, palette[1], 0.58)
  rect(520, 130, 790, 720, palette[2], 0.22)
  rect(900, 220, 1190, 650, palette[1], 0.42)
  circle(1260, 430, 105, palette[2], 0.74)
} else if (motif === 1) {
  circle(380, 420, 190, palette[1], 0.42)
  circle(780, 360, 125, palette[2], 0.72)
  circle(1180, 470, 220, palette[1], 0.38)
  line(440, 470, 1120, 470, 18, palette[3], 0.20)
} else {
  rect(220, 260, 560, 620, palette[1], 0.42)
  rect(620, 210, 960, 670, palette[2], 0.28)
  rect(1020, 300, 1370, 600, palette[1], 0.52)
  line(330, 660, 1260, 180, 12, palette[2], 0.48)
}

// Article-specific accent marks generated from the content hash.
for (let i = 0; i < 6; i += 1) {
  const x = 150 + (seed[4 + i] / 255) * 1300
  const y = 130 + (seed[10 + i] / 255) * 620
  circle(x, y, 10 + (seed[16 + i] % 24), palette[3], 0.16 + (seed[22 + i] / 255) * 0.22)
}

const crcTable = (() => {
  const table = new Uint32Array(256)
  for (let n = 0; n < 256; n += 1) {
    let c = n
    for (let k = 0; k < 8; k += 1) c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1)
    table[n] = c >>> 0
  }
  return table
})()
function crc32(buf) {
  let c = 0xffffffff
  for (const byte of buf) c = crcTable[(c ^ byte) & 0xff] ^ (c >>> 8)
  return (c ^ 0xffffffff) >>> 0
}
function chunk(type, data) {
  const typeBuf = Buffer.from(type, 'ascii')
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length)
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])))
  return Buffer.concat([len, typeBuf, data, crc])
}

const raw = Buffer.alloc((width * 4 + 1) * height)
for (let y = 0; y < height; y += 1) {
  const offset = y * (width * 4 + 1)
  raw[offset] = 0
  rgba.copy(raw, offset + 1, y * width * 4, (y + 1) * width * 4)
}
const ihdr = Buffer.alloc(13)
ihdr.writeUInt32BE(width, 0); ihdr.writeUInt32BE(height, 4); ihdr[8] = 8; ihdr[9] = 6; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0
const meta = Buffer.from('joinwell52-baseline\0' + args.item + ' | ' + args.column + ' | ' + args.title, 'utf8')
const png = Buffer.concat([
  Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
  chunk('IHDR', ihdr),
  chunk('tEXt', meta),
  chunk('IDAT', deflateSync(raw, { level: 9 })),
  chunk('IEND', Buffer.alloc(0))
])
mkdirSync(path.dirname(args.output), { recursive: true })
writeFileSync(args.output, png)
console.log(JSON.stringify({ output: args.output, item: args.item, column: args.column, width, height, bytes: png.length }))
