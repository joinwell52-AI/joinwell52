#!/usr/bin/env node

import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const releaseDir = path.join(repo, 'docs/public/releases/tmpa/v1.0-rc1');
const artifactDir = path.join(releaseDir, 'artifacts');
const outputDir = path.join(repo, 'output/pdf');
const tempDir = path.join(repo, 'tmp/pdfs/tmpa-v1.0-rc1');

const documents = [
  { id: 'architecture-paper', version: 'A0.9', lang: 'en', title: 'TMPA: Textual Multi-Agent Process Architecture', dir: 'docs/en/publications/tmpa-architecture-paper-a0.9' },
  { id: 'architecture-paper', version: 'A0.9', lang: 'zh', title: 'TMPA：文本化多智能体流程架构', dir: 'docs/zh/publications/tmpa-architecture-paper-a0.9' },
  { id: 'core-specification', version: 'S0.6', lang: 'en', title: 'TMPA Core Specification', dir: 'docs/en/publications/tmpa-core-specification-s0.6' },
  { id: 'core-specification', version: 'S0.6', lang: 'zh', title: 'TMPA Core Specification（中文）', dir: 'docs/zh/publications/tmpa-core-specification-s0.6' },
  { id: 'implementation-case', version: 'I0.8', lang: 'en', title: 'TMPA Implementation and Case Report', dir: 'docs/en/publications/implementation-case-i0.8' },
  { id: 'implementation-case', version: 'I0.8', lang: 'zh', title: 'TMPA 实施与案例报告', dir: 'docs/zh/publications/implementation-case-i0.8' }
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
    .replace(/\u2011/g, '-');
}

fs.mkdirSync(artifactDir, { recursive: true });
fs.mkdirSync(outputDir, { recursive: true });
fs.rmSync(tempDir, { recursive: true, force: true });
fs.mkdirSync(tempDir, { recursive: true });
const libreOfficeProfile = path.join(tempDir, 'libreoffice-profile');
fs.mkdirSync(libreOfficeProfile, { recursive: true });

const referenceDoc = path.join(tempDir, 'reference.docx');
run('python3', ['scripts/create-tmpa-reference-docx.py', referenceDoc]);

const buildInputs = [];
for (const doc of documents) {
  const sourceDir = path.join(repo, doc.dir);
  const parts = fs.readdirSync(sourceDir)
    .filter((name) => /^part-\d+\.md$/.test(name))
    .sort();
  if (parts.length === 0) throw new Error(`No parts found for ${doc.dir}`);

  let body = '';
  parts.forEach((part, index) => {
    const full = path.join(sourceDir, part);
    body += sanitizeMarkdown(fs.readFileSync(full, 'utf8'), index === 0).trim() + '\n\n';
    buildInputs.push(path.relative(repo, full));
  });

  const basename = `tmpa-${doc.id}-${doc.version.toLowerCase()}-${doc.lang}`;
  const markdown = path.join(artifactDir, `${basename}.md`);
  const docx = path.join(tempDir, `${basename}.docx`);
  const pdf = path.join(artifactDir, `${basename}.pdf`);
  const metadata = [
    '---',
    `title: "${doc.title.replaceAll('"', '\\"')}"`,
    'author: "Zhu Wei - joinwell52 Research Center"',
    `date: "2026-08-10 - ${doc.version} - RC1"`,
    '---',
    ''
  ].join('\n');
  fs.writeFileSync(markdown, metadata + body, 'utf8');

  run('pandoc', [
    markdown,
    '--from=gfm',
    '--standalone',
    '--toc',
    '--number-sections',
    `--reference-doc=${referenceDoc}`,
    `--resource-path=${repo}:${path.join(repo, 'docs/public')}`,
    '-o', docx
  ]);
  run('soffice', [`-env:UserInstallation=file://${libreOfficeProfile}`, '--headless', '--convert-to', 'pdf', '--outdir', artifactDir, docx]);
  if (!fs.existsSync(pdf)) throw new Error(`PDF was not created: ${pdf}`);
  fs.copyFileSync(pdf, path.join(outputDir, path.basename(pdf)));
}

const buildRecord = {
  release_id: 'TMPA-V1.0-RC1',
  generated_at: '2026-08-10',
  versions: { architecture_paper: 'A0.9', core_specification: 'S0.6', implementation_case: 'I0.8' },
  source_repository: 'https://github.com/joinwell52-AI/joinwell52',
  source_base_commit: execFileSync('git', ['rev-parse', 'HEAD'], { cwd: repo, encoding: 'utf8' }).trim(),
  inputs: [...new Set(buildInputs)].sort(),
  generator: 'scripts/build-tmpa-v1-release-candidate.mjs',
  claim_boundary: 'Review candidate only. No V1.0 promotion, DOI, independent validation, or license change is asserted.'
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
  release_id: 'TMPA-V1.0-RC1',
  artifact_count: included.length,
  artifacts: included.map((relative) => ({ path: relative, sha256: sha256(path.join(releaseDir, relative)) }))
};
fs.writeFileSync(path.join(releaseDir, 'MANIFEST.json'), JSON.stringify(manifest, null, 2) + '\n');
fs.writeFileSync(
  path.join(releaseDir, 'SHA256SUMS'),
  manifest.artifacts.map((item) => `${item.sha256}  ${item.path}`).join('\n') + '\n'
);

const archive = path.join(path.dirname(releaseDir), 'tmpa-v1.0-rc1-publication-dossier.zip');
fs.rmSync(archive, { force: true });
run('zip', ['-X', '-q', '-r', archive, '.'], { cwd: releaseDir });
fs.writeFileSync(`${archive}.sha256`, `${sha256(archive)}  ${path.basename(archive)}\n`);

console.log(`Built ${documents.length} bilingual publication PDFs, ${manifest.artifact_count} checksummed RC1 files, and the publication dossier ZIP.`);
