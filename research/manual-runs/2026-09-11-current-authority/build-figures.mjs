import {createRequire} from 'node:module';
import {writeFileSync} from 'node:fs';
const require=createRequire(process.argv[2]??new URL('../../../package.json',import.meta.url)),sharp=require('sharp');
const root=new URL('articles/',import.meta.url);
const colors={blue:'#174fc7',amber:'#a85e0b',violet:'#7852ab',ink:'#182b48',muted:'#64748b'};
const esc=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;');
const text=(x,y,s,size=23,color=colors.ink,weight=400)=>`<text x="${x}" y="${y}" font-size="${size}" fill="${color}" font-weight="${weight}">${esc(s)}</text>`;
const box=(x,y,w,h,fill='#ffffff',stroke='#dce2ed',dash='')=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="16" fill="${fill}" stroke="${stroke}" stroke-width="2" ${dash?'stroke-dasharray="'+dash+'"':''}/>`;
const wrap=(body)=>`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="690" viewBox="0 0 1200 690"><rect width="1200" height="690" fill="#faf8f3"/><g font-family="Microsoft YaHei, Arial, sans-serif">${body}</g></svg>`;
for(const lang of ['zh','en']){
 const zh=lang==='zh';
 let b=text(48,60,zh?'最终文本一样，交付结果却不同':'Same final text. Different result delivery.',34,colors.ink,700);
 b+=text(48,103,zh?'SDK 原回归实测 · 两工具调用示例 · 模型为 ScriptedModel':'SDK regression observations · Two-call example · ScriptedModel',21,colors.muted);
 for(const [i,fixed] of [[0,false],[1,true]]){
  const x=48+i*568;
  b+=box(x,137,536,442);
  b+=text(x+25,182,fixed?(zh?'固定修复实现':'Pinned fixed implementation'):(zh?'只换回旧函数':'Predecessor-helper ablation'),27,fixed?colors.blue:colors.amber,700);
  b+=text(x+25,224,zh?'下一次模型输入中的结果':'Outputs in the next model input',21,colors.muted);
  b+=box(x+24,246,486,77,'#edf3ff',colors.blue)+text(x+45,294,'call-approval',26,colors.blue,700);
  b+=box(x+24,339,486,77,fixed?'#edf3ff':'#fff7e9',fixed?colors.blue:colors.amber,fixed?'':'8 6');
  b+=text(x+45,387,fixed?'call-missing':(zh?'缺少 call-missing':'call-missing absent'),26,fixed?colors.blue:colors.amber,700);
  b+=text(x+25,461,zh?'最终文本：done':'Final text: done',23,colors.ink,700);
  b+=text(x+25,512,fixed?(zh?'整套新增回归：10 / 10 通过':'Added regression suite: 10 / 10 pass'):(zh?'整套新增回归：10 / 10 失败':'Added regression suite: 10 / 10 fail'),22,fixed?colors.blue:colors.amber);
 }
 b+=text(48,623,zh?'观察边界：SDK 准备并交给脚本模型的输入；未验证网络确认或真实消费。':'Boundary: input passed to a scripted model; no network acknowledgement or consumption test.',20,colors.muted);
 b+=text(48,656,zh?'来源：runs/sdk.json；提交 3f9397f；旧函数来自 83c737f。':'Source: runs/sdk.json · pinned 3f9397f · predecessor helper 83c737f',19,colors.muted);
 let svg=wrap(b);writeFileSync(new URL(`result-delivery.figure.${lang}.svg`,root),svg);await sharp(Buffer.from(svg)).png().toFile(new URL(`result-delivery.figure.${lang}.png`,root).pathname.replace(/^\/([A-Z]:)/,'$1'));
 b=text(48,60,zh?'恢复模型：拒绝与未知要分开':'Model restore: refusal and uncertainty differ',34,colors.ink,700);
 b+=text(48,103,zh?'Orca 候选原函数实测 · 连接使用预设目录与调用记录替身':'Pinned Orca functions · Catalog and connection are controlled test doubles',21,colors.muted);
 const rows=zh?[
  ['目录列出模型或对应别名','允许调用 setModel','原写入方法调用 1 次',colors.blue],
  ['目录明确未列出模型','拒绝；恢复时记入 skipped','原写入方法调用 0 次',colors.amber],
  ['查询失败、空目录、仅 default','兼容放行；不证明支持','原写入方法调用 1 次',colors.violet]
 ]:[
  ['Listed model or resolved alias','Allow setModel','1 write-method call',colors.blue],
  ['Unlisted in a usable catalog','Reject; restore records skipped','0 write-method calls',colors.amber],
  ['Failed / empty / default-only catalog','Compatibility path; not proof','1 write-method call',colors.violet]
 ];
 rows.forEach(([left,right,obs,color],i)=>{const y=140+i*135;b+=box(48,y,1104,114,'#fff',color);b+=text(72,y+47,left,23,color,700);b+=text(595,y+46,right,23,colors.ink,700);b+=text(595,y+84,obs,22,color);});
 b+=text(48,586,zh?'8 组条件 × 2 个版本 = 16 条观测；不是 16 种故障。':'8 conditions × 2 versions = 16 observations, not 16 different failures.',22,colors.ink,700);
 b+=text(48,629,zh?'允许写入 ≠ 账号有资格 ≠ 提供方实际采用 ≠ 推理成功。':'Write allowed ≠ account entitlement ≠ provider adoption ≠ successful inference.',21,colors.muted);
 b+=text(48,663,zh?'来源：runs/orca.json；候选 a13c845；基线 027acb4。':'Source: runs/orca.json · candidate a13c845 · baseline 027acb4',19,colors.muted);
 svg=wrap(b);writeFileSync(new URL(`live-model-restore.figure.${lang}.svg`,root),svg);await sharp(Buffer.from(svg)).png().toFile(new URL(`live-model-restore.figure.${lang}.png`,root).pathname.replace(/^\/([A-Z]:)/,'$1'));
}
console.log('Generated four localized figures from the recorded experiment conditions.');
