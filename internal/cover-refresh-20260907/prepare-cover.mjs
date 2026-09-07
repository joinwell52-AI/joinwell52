import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import sharp from 'sharp';

const [briefPath, sourcePath] = process.argv.slice(2);
const brief = JSON.parse(await fs.readFile(briefPath, 'utf8'));
const output = path.join('docs/public', brief.intendedPath);
const thumb = briefPath.replace(/\.json$/, '-review.webp');
await sharp(sourcePath).resize(1600, 900, { fit: 'cover' }).webp({ quality: 88, effort: 5 }).toFile(output);
await sharp(sourcePath).resize(320, 180, { fit: 'cover' }).webp({ quality: 74 }).toFile(thumb);
const digest = async p => crypto.createHash('sha256').update(await fs.readFile(p)).digest('hex');
console.log(JSON.stringify({itemId: brief.itemId, sourcePath, sourceSha256: await digest(sourcePath), output, outputSha256: await digest(output), bytes: (await fs.stat(output)).size, thumbnail: thumb, thumbnailSha256: await digest(thumb)}));
