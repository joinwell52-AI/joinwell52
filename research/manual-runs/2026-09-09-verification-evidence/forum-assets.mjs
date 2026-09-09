import fs from 'node:fs/promises';
import sharp from 'sharp';
const out='docs/public/assets/forum-verification-20260909';await fs.mkdir(out,{recursive:true});
for(const [slug,id] of [['output-is-not-effect','03'],['deterministic-conflict','01']])for(const [platform,w,h] of [['dev',1000,420],['csdn',1376,768],['juejin',1200,600]]){
 const source=`docs/public/assets/verification-evidence-20260909/${id}-${slug}.png`,dest=`D:/TMPA/${platform}/2026-09-09-${slug}-${platform}`;
 await sharp(source).resize(w,h,{fit:'contain',background:'#faf7f0'}).png().toFile(dest+'-cover.png');
 await fs.copyFile(dest+'-cover.png',`${out}/${slug}-${platform}-cover.png`);
 await fs.copyFile(`docs/public/assets/verification-evidence-20260909/${slug}-figure.${platform==='dev'?'en':'zh'}.png`,dest+'-figure.png');
}
console.log('Six platform covers and figures prepared.');
