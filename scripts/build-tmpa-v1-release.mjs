#!/usr/bin/env node

import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const releaseDir = path.join(repo, 'docs/public/releases/tmpa/v1.0');
const artifactDir = path.join(releaseDir, 'artifacts');
const outputDir = path.join(repo, 'output/pdf');
const tempDir = path.join(repo, 'tmp/pdfs/tmpa-v1.0');
const sourceBaseCommit = process.env.TMPA_SOURCE_COMMIT
  || execFileSync('git', ['rev-parse', 'HEAD'], { cwd: repo, encoding: 'utf8' }).trim();

const documents = [
  { id: 'architecture-paper', version: 'A1.0', lang: 'en', title: 'TMPA: Textual Multi-Agent Process Architecture', dir: 'docs/en/publications/tmpa-architecture-paper-a1.0' },
  { id: 'architecture-paper', version: 'A1.0', lang: 'zh', title: 'TMPA：文本化多智能体流程架构', dir: 'docs/zh/publications/tmpa-architecture-paper-a1.0' },
  { id: 'core-specification', version: 'S1.0', lang: 'en', title: 'TMPA Core Specification', dir: 'docs/en/publications/tmpa-core-specification-s1.0' },
  { id: 'core-specification', version: 'S1.0', lang: 'zh', title: 'TMPA Core Specification（中文）', dir: 'docs/zh/publications/tmpa-core-specification-s1.0' },
  { id: 'implementation-case', version: 'I1.0', lang: 'en', title: 'TMPA Implementation and Case Report', dir: 'docs/en/publications/implementation-case-i1.0' },
  { id: 'implementation-case', version: 'I1.0', lang: 'zh', title: 'TMPA 实施与案例报告', dir: 'docs/zh/publications/implementation-case-i1.0' }
];

function run(command, args, options = {}) {
  execFileSync(command, args, { cwd: repo, stdio: 'inherit', ...options });
}

function sha256(file) {
  return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
}

function sanitizeMarkdown(text, first) {
  if (first) {
    text = text.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n+/, '');
    text = text.replace(/^<ArticleCover\b[\s\S]*?\/>\r?\n+/, '');
  }
  return text
    .replace(/\]\(\/(?!\/)/g, '](https://joinwell52-ai.github.io/joinwell52/')
    .replace(/<br\s*\/?\s*>/gi, '  \n')
    .replace(/\u2011/g, '-')
    .replace(/⟨/g, '<')
    .replace(/⟩/g, '>')
    .replace(/⋃/g, 'union');
}

function addPdfBreakOpportunities(text) {
  return text
    .replace(/[A-Fa-f0-9]{32,}/g, (token) => token.match(/.{1,12}/g).join('\u200b'))
    .replace(/[A-Z][A-Z0-9]+(?:_[A-Z0-9]+)+/g, (token) => token.replaceAll('_', '_\u200b'));
}

fs.mkdirSync(artifactDir, { recursive: true });
fs.mkdirSync(outputDir, { recursive: true });
fs.rmSync(tempDir, { recursive: true, force: true });
fs.mkdirSync(tempDir, { recursive: true });

const buildInputs = [];
for (const doc of documents) {
  const sourceDir = path.join(repo, doc.dir);
  const parts = fs.readdirSync(sourceDir).filter((name) => /^part-\d+\.md$/.test(name)).sort();
  if (parts.length === 0) throw new Error(`No parts found for ${doc.dir}`);

  let body = '';
  parts.forEach((part, index) => {
    const full = path.join(sourceDir, part);
    body += sanitizeMarkdown(fs.readFileSync(full, 'utf8'), index === 0).trim() + '\n\n';
    buildInputs.push(path.relative(repo, full));
  });

  const basename = `tmpa-${doc.id}-${doc.version.toLowerCase()}-${doc.lang}`;
  const markdown = path.join(artifactDir, `${basename}.md`);
  const pdfMarkdown = path.join(tempDir, `${basename}.pdf-input.md`);
  const pdf = path.join(artifactDir, `${basename}.pdf`);
  const metadata = [
    '---',
    `title: "${doc.title.replaceAll('"', '\\"')}"`,
    'author: "Zhu Wei - joinwell52 Research Center"',
    `date: "2026-08-11 - ${doc.version} - TMPA V1.0"`,
    '---',
    ''
  ].join('\n');
  fs.writeFileSync(markdown, metadata + body, 'utf8');
  fs.writeFileSync(pdfMarkdown, addPdfBreakOpportunities(metadata + body), 'utf8');

  const monoFont = doc.lang === 'zh' ? 'Noto Sans SC' : 'DejaVu Sans Mono';
  run('pandoc', [
    pdfMarkdown,
    '--from=gfm',
    '--standalone',
    '--toc',
    '--no-highlight',
    '--lua-filter=scripts/tmpa-v1-table-widths.lua',
    '--pdf-engine=xelatex',
    '-V', 'papersize:letter',
    '-V', 'geometry:margin=0.85in',
    '-V', 'fontsize=10pt',
    '-V', 'mainfont=Noto Sans SC',
    '-V', 'sansfont=Noto Sans SC',
    '-V', `monofont=${monoFont}`,
    '--include-in-header=scripts/tmpa-v1-pdf-header.tex',
    `--resource-path=${repo}:${path.join(repo, 'docs/public')}`,
    '-o', pdf
  ]);
  if (!fs.existsSync(pdf)) throw new Error(`PDF was not created: ${pdf}`);
  fs.copyFileSync(pdf, path.join(outputDir, path.basename(pdf)));
}

const buildRecord = {
  release_id: 'TMPA-V1.0',
  generated_at: '2026-08-11',
  versions: { architecture_paper: 'A1.0', core_specification: 'S1.0', implementation_case: 'I1.0' },
  source_repository: 'https://github.com/joinwell52-AI/joinwell52',
  source_base_commit: sourceBaseCommit,
  inputs: [...new Set(buildInputs)].sort(),
  generator: 'scripts/build-tmpa-v1-release.mjs',
  claim_boundary: 'Stable publication release. Product evidence is author-run and fixed-bundle; no DOI, independent certification, universal conformance, theory proof, or independent adoption is asserted.'
};
fs.writeFileSync(path.join(releaseDir, 'BUILD.json'), JSON.stringify(buildRecord, null, 2) + '\n');

const included = [];
for (const entry of fs.readdirSync(releaseDir, { recursive: true })) {
  const full = path.join(releaseDir, entry);
  if (!fs.statSync(full).isFile()) continue;
  if (['MANIFEST.json', 'SHA256SUMS'].includes(path.basename(full))) continue;
  included.push(path.relative(releaseDir, full));
}
included.sort();

const manifest = {
  release_id: 'TMPA-V1.0',
  artifact_count: included.length,
  artifacts: included.map((relative) => ({ path: relative, sha256: sha256(path.join(releaseDir, relative)) }))
};
fs.writeFileSync(path.join(releaseDir, 'MANIFEST.json'), JSON.stringify(manifest, null, 2) + '\n');
fs.writeFileSync(path.join(releaseDir, 'SHA256SUMS'), manifest.artifacts.map((item) => `${item.sha256}  ${item.path}`).join('\n') + '\n');

const archive = path.join(path.dirname(releaseDir), 'tmpa-v1.0-publication-dossier.zip');
fs.rmSync(archive, { force: true });
run('zip', ['-X', '-q', '-r', archive, '.'], { cwd: releaseDir });
fs.writeFileSync(`${archive}.sha256`, `${sha256(archive)}  ${path.basename(archive)}\n`);

console.log(`Built ${documents.length} bilingual publication PDFs, ${manifest.artifact_count} checksummed V1.0 files, and the publication dossier ZIP.`);
