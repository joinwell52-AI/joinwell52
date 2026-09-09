import fs from 'node:fs/promises';
import sharp from 'sharp';
const root='docs/public/assets/verification-evidence-20260909';
for(const n of await fs.readdir(root))if(n.endsWith('.svg'))await sharp(`${root}/${n}`).png().toFile(`${root}/${n.replace('.svg','.png')}`);
console.log('Eight bilingual explanatory figures rendered.');
