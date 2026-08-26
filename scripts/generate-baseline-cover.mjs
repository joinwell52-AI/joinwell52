#!/usr/bin/env node
import { createHash } from 'node:crypto'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
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
  throw new Error('usage: node scripts/generate-baseline-cover.mjs --output <png> --item <id> --column <column> --title <title> [--metaphor <text>] [--semantic <text>] [--composition <text>]')
}
if (path.extname(args.output).toLowerCase() !== '.png') throw new Error('baseline cover output must be .png')

const width = 1600
const height = 900
const rgba = Buffer.alloc(width * height * 4)

// Resolve article-specific cover semantics from the same item's Figure Plan when present.
// This keeps direct 15:00 execution and the governed Actions Bridge visually consistent.
let metaphor = args.metaphor || ''
let semanticObject = args.semantic || ''
let compositionIntent = args.composition || ''
const itemMatch = args.item.match(/^Q-(\d{4})(\d{2})(\d{2})-\d{2}$/)
if (itemMatch) {
  const figurePlanPath = path.join('research', 'runtime', 'production-work', itemMatch[1], itemMatch[2], itemMatch[3], args.item, 'figure-plan.json')
  if (existsSync(figurePlanPath)) {
    try {
      const figurePlan = JSON.parse(readFileSync(figurePlanPath, 'utf8'))
      const cover = figurePlan?.cover || {}
      metaphor ||= String(cover.visualMetaphor || '')
      semanticObject ||= String(cover.semanticObject || '')
      compositionIntent ||= String(cover.compositionIntent || '')
    } catch {
      // Planning validation owns malformed Figure Plans. The cover renderer falls back to title semantics.
    }
  }
}

const semanticInput = [args.item, args.column, args.title, metaphor, semanticObject, compositionIntent].join('|')
const seed = createHash('sha256').update(semanticInput).digest()

const palettes = {
  'digital-employee': {
    bg0: [4, 10, 30], bg1: [7, 20, 55], primary: [58, 218, 246], secondary: [135, 83, 255], warm: [245, 168, 86], white: [229, 242, 255]
  },
  'industry-architecture': {
    bg0: [4, 12, 30], bg1: [7, 26, 50], primary: [72, 222, 215], secondary: [80, 145, 255], warm: [248, 176, 91], white: [229, 246, 255]
  },
  'open-source-engineering': {
    bg0: [4, 10, 28], bg1: [8, 22, 48], primary: [75, 180, 255], secondary: [61, 226, 211], warm: [247, 159, 72], white: [234, 243, 255]
  }
}
const P = palettes[args.column] || palettes['digital-employee']

function clamp(v, lo = 0, hi = 255) { return Math.max(lo, Math.min(hi, v)) }
function mix(a, b, t) { return a.map((v, i) => Math.round(v + (b[i] - v) * t)) }
function blendPixel(x, y, color, alpha = 1, additive = false) {
  x = Math.round(x); y = Math.round(y)
  if (x < 0 || y < 0 || x >= width || y >= height || alpha <= 0) return
  const i = (y * width + x) * 4
  if (additive) {
    rgba[i] = clamp(rgba[i] + color[0] * alpha)
    rgba[i + 1] = clamp(rgba[i + 1] + color[1] * alpha)
    rgba[i + 2] = clamp(rgba[i + 2] + color[2] * alpha)
  } else {
    const inv = 1 - alpha
    rgba[i] = Math.round(rgba[i] * inv + color[0] * alpha)
    rgba[i + 1] = Math.round(rgba[i + 1] * inv + color[1] * alpha)
    rgba[i + 2] = Math.round(rgba[i + 2] * inv + color[2] * alpha)
  }
  rgba[i + 3] = 255
}
function rect(x0, y0, x1, y1, color, alpha = 1) {
  x0 = Math.max(0, Math.floor(x0)); y0 = Math.max(0, Math.floor(y0)); x1 = Math.min(width, Math.ceil(x1)); y1 = Math.min(height, Math.ceil(y1))
  for (let y = y0; y < y1; y += 1) for (let x = x0; x < x1; x += 1) blendPixel(x, y, color, alpha)
}
function circle(cx, cy, r, color, alpha = 1, additive = false) {
  const rr = r * r
  const y0 = Math.max(0, Math.floor(cy - r)), y1 = Math.min(height, Math.ceil(cy + r))
  for (let y = y0; y < y1; y += 1) {
    const dy = y - cy
    const dx = Math.sqrt(Math.max(0, rr - dy * dy))
    const x0 = Math.max(0, Math.floor(cx - dx)), x1 = Math.min(width, Math.ceil(cx + dx))
    for (let x = x0; x < x1; x += 1) blendPixel(x, y, color, alpha, additive)
  }
}
function glow(cx, cy, r, color, alpha = 0.3) {
  const rings = 7
  for (let i = rings; i >= 1; i -= 1) {
    const t = i / rings
    circle(cx, cy, r * t, color, alpha * (1 - t + 0.12) / rings * 2.1, true)
  }
}
function ring(cx, cy, r, thickness, color, alpha = 1) {
  circle(cx, cy, r, color, alpha)
  circle(cx, cy, Math.max(0, r - thickness), P.bg0, 0.94)
}
function line(x0, y0, x1, y1, thickness, color, alpha = 1, glowAmount = 0) {
  const steps = Math.max(1, Math.ceil(Math.hypot(x1 - x0, y1 - y0)))
  if (glowAmount > 0) {
    const gt = thickness + glowAmount
    for (let s = 0; s <= steps; s += 3) {
      const t = s / steps
      glow(x0 + (x1 - x0) * t, y0 + (y1 - y0) * t, gt, color, alpha * 0.12)
    }
  }
  for (let s = 0; s <= steps; s += 1) {
    const t = s / steps
    circle(x0 + (x1 - x0) * t, y0 + (y1 - y0) * t, thickness / 2, color, alpha)
  }
}
function bezier(p0, p1, p2, p3, thickness, color, alpha = 1, dashed = false) {
  let prev = p0
  const segments = 180
  for (let i = 1; i <= segments; i += 1) {
    const t = i / segments, u = 1 - t
    const p = {
      x: u ** 3 * p0.x + 3 * u ** 2 * t * p1.x + 3 * u * t ** 2 * p2.x + t ** 3 * p3.x,
      y: u ** 3 * p0.y + 3 * u ** 2 * t * p1.y + 3 * u * t ** 2 * p2.y + t ** 3 * p3.y
    }
    if (!dashed || Math.floor(i / 5) % 2 === 0) line(prev.x, prev.y, p.x, p.y, thickness, color, alpha, dashed ? 0 : 4)
    prev = p
  }
}
function roundedRect(x, y, w, h, r, fill, fillAlpha, stroke, strokeAlpha = 0.7, strokeWidth = 2) {
  rect(x + r, y, x + w - r, y + h, fill, fillAlpha)
  rect(x, y + r, x + w, y + h - r, fill, fillAlpha)
  circle(x + r, y + r, r, fill, fillAlpha)
  circle(x + w - r, y + r, r, fill, fillAlpha)
  circle(x + r, y + h - r, r, fill, fillAlpha)
  circle(x + w - r, y + h - r, r, fill, fillAlpha)
  line(x + r, y, x + w - r, y, strokeWidth, stroke, strokeAlpha)
  line(x + r, y + h, x + w - r, y + h, strokeWidth, stroke, strokeAlpha)
  line(x, y + r, x, y + h - r, strokeWidth, stroke, strokeAlpha)
  line(x + w, y + r, x + w, y + h - r, strokeWidth, stroke, strokeAlpha)
  for (let a = 0; a <= 90; a += 2) {
    const rad = a * Math.PI / 180
    const cs = Math.cos(rad), sn = Math.sin(rad)
    for (const [cx, cy, sx, sy] of [
      [x + r, y + r, -1, -1], [x + w - r, y + r, 1, -1], [x + r, y + h - r, -1, 1], [x + w - r, y + h - r, 1, 1]
    ]) circle(cx + sx * cs * r, cy + sy * sn * r, strokeWidth / 2, stroke, strokeAlpha)
  }
}
function polygon(points, color, alpha = 1) {
  const ys = points.map(p => p.y)
  const minY = Math.max(0, Math.floor(Math.min(...ys))), maxY = Math.min(height - 1, Math.ceil(Math.max(...ys)))
  for (let y = minY; y <= maxY; y += 1) {
    const xs = []
    for (let i = 0; i < points.length; i += 1) {
      const a = points[i], b = points[(i + 1) % points.length]
      if ((a.y <= y && b.y > y) || (b.y <= y && a.y > y)) xs.push(a.x + (y - a.y) * (b.x - a.x) / (b.y - a.y))
    }
    xs.sort((a, b) => a - b)
    for (let i = 0; i + 1 < xs.length; i += 2) rect(xs[i], y, xs[i + 1], y + 1, color, alpha)
  }
}
function hexCore(cx, cy, r, color, alpha = 0.9) {
  const pts = Array.from({ length: 6 }, (_, i) => {
    const a = Math.PI / 6 + i * Math.PI / 3
    return { x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r }
  })
  polygon(pts, color, alpha)
  line(cx, cy - r * 0.86, cx, cy + r * 0.86, 2, P.white, 0.18)
  line(cx - r * 0.75, cy - r * 0.43, cx + r * 0.75, cy + r * 0.43, 2, P.white, 0.12)
  line(cx + r * 0.75, cy - r * 0.43, cx - r * 0.75, cy + r * 0.43, 2, P.white, 0.12)
}
function node(cx, cy, r, color, alpha = 1) {
  glow(cx, cy, r * 3.2, color, 0.18 * alpha)
  ring(cx, cy, r, Math.max(2, r * 0.34), color, 0.72 * alpha)
  circle(cx, cy, Math.max(2, r * 0.22), P.white, 0.65 * alpha)
}
function tinyParticles(count = 42) {
  for (let i = 0; i < count; i += 1) {
    const x = 120 + (seed[(i * 3 + 7) % seed.length] / 255) * 1360
    const y = 90 + (seed[(i * 5 + 11) % seed.length] / 255) * 720
    const r = 1 + seed[(i * 7 + 13) % seed.length] % 3
    const col = i % 7 === 0 ? P.secondary : P.primary
    circle(x, y, r, col, 0.08 + (seed[(i * 11 + 3) % seed.length] / 255) * 0.11)
  }
}

for (let y = 0; y < height; y += 1) {
  for (let x = 0; x < width; x += 1) {
    const nx = x / width, ny = y / height
    const g1 = Math.max(0, 1 - Math.hypot((nx - 0.66) / 0.95, (ny - 0.40) / 0.85))
    const g2 = Math.max(0, 1 - Math.hypot((nx - 0.24) / 0.78, (ny - 0.62) / 0.92))
    let c = mix(P.bg0, P.bg1, clamp(0.12 + g1 * 0.44 + g2 * 0.18, 0, 1))
    const vignette = Math.max(0, Math.hypot(nx - 0.5, ny - 0.5) - 0.30) * 20
    c = c.map(v => clamp(v - vignette))
    const i = (y * width + x) * 4
    rgba[i] = c[0]; rgba[i + 1] = c[1]; rgba[i + 2] = c[2]; rgba[i + 3] = 255
  }
}
rect(0, 705, width, height, P.bg0, 0.18)
for (let i = 0; i < 7; i += 1) {
  const y = 610 + i * 35
  line(90, y, 1510, y - 80, 1, P.primary, 0.035)
}
tinyParticles()

const semantic = [args.title, metaphor, semanticObject, compositionIntent].join(' ').toLowerCase()
function has(...terms) { return terms.some(term => semantic.includes(term)) }
let motif = 'signal-core'
if (has('copy', 'clone', 'client', 'configuration', 'config', '复制', '客户端', '配置')) motif = 'copy-core'
else if (has('permission', 'authority', 'attachment', 'scope', 'revoke', 'authorization', '权限', '权威', '附件', '授权', '撤销')) motif = 'bound-authority'
else if (has('terminal', 'detached', 'workflow', 'foreground', 'ownership', 'in-flight', 'parent', 'completion', '完成', '终态', '工作流', '所有权', '前台')) motif = 'terminal-path'
else if (has('failure', 'reason', 'cause', 'hypothesis', 'evidence', 'attribution', '失败', '原因', '假设', '证据', '归因')) motif = 'evidence-branches'
else if (has('queue', 'handoff', 'lease', 'claim', '交接', '队列', '租约', '认领')) motif = 'handoff'

const shiftX = Math.round((seed[0] / 255 - 0.5) * 60)
const shiftY = Math.round((seed[1] / 255 - 0.5) * 36)
const accent = seed[2] % 2 === 0 ? P.secondary : P.warm

function motifTerminalPath() {
  const gateX = 355 + shiftX, gateY = 505 + shiftY
  roundedRect(gateX - 150, gateY - 250, 300, 390, 28, [12, 35, 67], 0.34, P.primary, 0.72, 3)
  glow(gateX, gateY - 50, 80, P.primary, 0.24)
  ring(gateX, gateY - 50, 58, 9, P.primary, 0.82)
  line(gateX - 25, gateY - 52, gateX - 5, gateY - 30, 10, P.primary, 0.9, 4)
  line(gateX - 5, gateY - 30, gateX + 35, gateY - 80, 10, P.primary, 0.9, 4)

  const pStart = { x: gateX - 5, y: gateY + 90 }
  const pEnd = { x: 1360, y: 300 + shiftY }
  bezier(pStart, { x: 650, y: 600 }, { x: 1000, y: 370 }, pEnd, 8, P.primary, 0.86)
  for (const t of [0.38, 0.60, 0.79]) {
    const x = pStart.x + (pEnd.x - pStart.x) * t
    const y = pStart.y + (pEnd.y - pStart.y) * t - Math.sin(t * Math.PI) * 95
    node(x, y, 17, t > 0.68 ? accent : P.primary, 0.9)
  }
  bezier({ x: gateX + 80, y: gateY - 10 }, { x: 700, y: 370 }, { x: 930, y: 210 }, { x: 1200, y: 260 }, 3, accent, 0.68, true)
  glow(1270, 268, 95, accent, 0.26)
  circle(1270, 268, 43, accent, 0.75)
  ring(1270, 268, 76, 3, accent, 0.33)
  line(1315, 267, 1390, 245, 4, accent, 0.72, 4)
  polygon([{ x: 1390, y: 245 }, { x: 1364, y: 236 }, { x: 1373, y: 260 }], accent, 0.85)
}

function motifCopyCore() {
  const baseX = 190 + shiftX, baseY = 235 + shiftY
  for (let i = 0; i < 4; i += 1) {
    const x = baseX + i * 135, y = baseY + i * 42
    roundedRect(x, y, 265, 365, 24, [18, 35 + i * 4, 75 + i * 4], 0.16 + i * 0.04, i === 3 ? P.primary : P.secondary, i === 3 ? 0.68 : 0.24, 2)
    for (let j = 0; j < 3; j += 1) {
      circle(x + 46, y + 78 + j * 55, 7, j === 2 ? P.warm : P.primary, 0.28 + i * 0.06)
      line(x + 70, y + 78 + j * 55, x + 135 + j * 14, y + 78 + j * 55, 5, P.white, 0.08 + i * 0.035)
    }
  }
  const merge = { x: 935, y: 485 + shiftY }
  for (let i = 0; i < 4; i += 1) {
    const x = baseX + i * 135 + 265, y = baseY + i * 42 + 180
    bezier({ x, y }, { x: 760, y }, { x: 820, y: merge.y + (i - 1.5) * 18 }, merge, 2.5, P.primary, 0.48, true)
  }
  node(merge.x, merge.y, 14, P.primary, 0.9)
  line(merge.x + 15, merge.y, 1120, merge.y, 4, P.warm, 0.78, 4)
  const cx = 1260, cy = merge.y
  glow(cx, cy, 120, P.warm, 0.24)
  ring(cx, cy, 90, 5, P.warm, 0.56)
  ring(cx, cy, 60, 3, P.warm, 0.38)
  hexCore(cx, cy, 36, P.warm, 0.9)
  line(cx + 90, cy, 1440, cy, 3, P.warm, 0.72, 3)
  polygon([{ x: 1440, y: cy }, { x: 1415, y: cy - 12 }, { x: 1415, y: cy + 12 }], P.warm, 0.8)
}

function motifBoundAuthority() {
  const x = 175 + shiftX, y = 230 + shiftY, w = 760, h = 430
  roundedRect(x, y, w, h, 42, [10, 29, 60], 0.22, P.secondary, 0.45, 3)
  for (let i = 0; i < 3; i += 1) {
    const px = x + 75 + i * 220
    roundedRect(px, y + 80, 170, 285, 12, [25, 51, 88], 0.20, P.primary, 0.20, 1)
  }
  line(x, y + 235, x + w - 100, y + 235, 3, P.primary, 0.42)
  for (let i = 0; i < 4; i += 1) node(x + 95 + i * 170, y + 235, 8 + (i === 3 ? 4 : 0), P.primary, 0.55 + i * 0.08)
  const attachX = x + w, attachY = y + 235
  node(attachX, attachY, 24, P.primary, 0.9)
  line(attachX + 20, attachY - 10, attachX + 85, attachY - 10, 7, P.primary, 0.8, 6)
  line(attachX + 20, attachY + 10, attachX + 85, attachY + 10, 7, P.primary, 0.8, 6)
  const mx = 1145, my = attachY
  roundedRect(mx - 90, my - 125, 185, 250, 24, [16, 31, 58], 0.58, P.warm, 0.86, 4)
  glow(mx, my, 80, P.secondary, 0.22)
  ring(mx, my, 60, 3, P.secondary, 0.5)
  hexCore(mx, my, 35, P.secondary, 0.88)
  bezier({ x: mx + 65, y: my - 120 }, { x: 1390, y: my - 170 }, { x: 1470, y: my + 50 }, { x: 1330, y: my + 145 }, 3, P.primary, 0.55, true)
  node(1385, my - 70, 14, P.primary, 0.8)
  node(1350, my + 120, 14, P.warm, 0.6)
}

function motifEvidenceBranches() {
  const sx = 180 + shiftX, sy = 450 + shiftY
  const colors = [P.primary, P.secondary, P.warm]
  for (let i = 0; i < 3; i += 1) {
    node(sx, sy + (i - 1) * 92, 12, colors[i], 0.75)
    bezier({ x: sx + 15, y: sy + (i - 1) * 92 }, { x: 520, y: sy + (i - 1) * 150 }, { x: 700, y: sy + (i - 1) * 65 }, { x: 930, y: sy }, 4, colors[i], 0.72, i !== 0)
  }
  node(930, sy, 18, P.white, 0.75)
  line(948, sy, 1120, sy, 5, P.primary, 0.76, 5)
  const cx = 1240, cy = sy
  glow(cx, cy, 115, accent, 0.22)
  ring(cx, cy, 86, 4, accent, 0.55)
  circle(cx, cy, 20, accent, 0.85)
  bezier({ x: 930, y: sy }, { x: 1030, y: sy + 150 }, { x: 1160, y: sy + 180 }, { x: 1370, y: sy + 130 }, 2.5, P.secondary, 0.5, true)
  node(1370, sy + 130, 10, P.secondary, 0.65)
}

function motifHandoff() {
  const lx = 290 + shiftX, ly = 445 + shiftY
  const rx = 1270, ry = 390 + shiftY
  roundedRect(lx - 145, ly - 160, 290, 320, 28, [18, 39, 72], 0.24, P.primary, 0.56, 3)
  roundedRect(rx - 120, ry - 135, 240, 270, 28, [24, 34, 63], 0.32, P.warm, 0.70, 3)
  node(lx, ly, 22, P.primary, 0.9)
  node(rx, ry, 22, P.warm, 0.9)
  bezier({ x: lx + 35, y: ly }, { x: 600, y: ly - 130 }, { x: 980, y: ry + 110 }, { x: rx - 35, y: ry }, 7, P.primary, 0.78)
  for (const t of [0.27, 0.48, 0.70]) {
    const x = lx + (rx - lx) * t, y = ly + (ry - ly) * t - Math.sin(t * Math.PI) * 50
    node(x, y, 11, t > 0.5 ? accent : P.primary, 0.72)
  }
  ring(790, 645, 80, 3, P.secondary, 0.18)
  bezier({ x: 650, y: 620 }, { x: 770, y: 700 }, { x: 900, y: 680 }, { x: 970, y: 600 }, 2, P.secondary, 0.35, true)
}

function motifSignalCore() {
  const x = 205 + shiftX, y = 260 + shiftY
  for (let i = 0; i < 3; i += 1) roundedRect(x + i * 130, y + i * 38, 300, 335, 26, [15, 35, 72], 0.15 + i * 0.04, P.primary, 0.2 + i * 0.12, 2)
  const endX = 1245, endY = 440 + shiftY
  for (let i = 0; i < 3; i += 1) bezier({ x: x + i * 130 + 300, y: y + i * 38 + 170 }, { x: 720, y: 380 + i * 40 }, { x: 880, y: endY + (i - 1) * 35 }, { x: 1050, y: endY }, 2.5, i === 2 ? P.primary : P.secondary, 0.5, i < 2)
  node(1050, endY, 16, P.primary, 0.85)
  glow(endX, endY, 130, accent, 0.23)
  ring(endX, endY, 92, 4, accent, 0.57)
  hexCore(endX, endY, 34, accent, 0.9)
  line(endX + 90, endY, 1435, endY, 3, accent, 0.68, 3)
}

if (motif === 'terminal-path') motifTerminalPath()
else if (motif === 'copy-core') motifCopyCore()
else if (motif === 'bound-authority') motifBoundAuthority()
else if (motif === 'evidence-branches') motifEvidenceBranches()
else if (motif === 'handoff') motifHandoff()
else motifSignalCore()

for (let i = 0; i < 9; i += 1) {
  const x = 250 + (seed[(i + 17) % seed.length] / 255) * 1100
  const y = 150 + (seed[(i + 25) % seed.length] / 255) * 520
  const h = 35 + seed[(i + 9) % seed.length] % 80
  line(x, y, x, y - h, 1, i % 3 === 0 ? accent : P.primary, 0.08)
  circle(x, y - h, 3, i % 3 === 0 ? accent : P.primary, 0.16)
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
const meta = Buffer.from('joinwell52-editorial-baseline-v2\0' + [args.item, args.column, motif, args.title].join(' | '), 'utf8')
const png = Buffer.concat([
  Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
  chunk('IHDR', ihdr),
  chunk('tEXt', meta),
  chunk('IDAT', deflateSync(raw, { level: 9 })),
  chunk('IEND', Buffer.alloc(0))
])
mkdirSync(path.dirname(args.output), { recursive: true })
writeFileSync(args.output, png)
console.log(JSON.stringify({ output: args.output, item: args.item, column: args.column, motif, width, height, bytes: png.length }))
