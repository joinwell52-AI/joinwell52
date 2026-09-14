import{createRequire}from'node:module';import{writeFileSync,mkdirSync}from'node:fs';
const require=createRequire(process.argv[2]??new URL('../../../package.json',import.meta.url)),sharp=require('sharp'),out=new URL('articles/',import.meta.url);mkdirSync(out,{recursive:true});
const esc=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;');
const t=(x,y,s,size=24,color='#203558',weight=400)=>`<text x="${x}" y="${y}" font-size="${size}" fill="${color}" font-weight="${weight}">${esc(s)}</text>`;
const box=(x,y,w,h,color='#fff',stroke='#d5dfea')=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="18" fill="${color}" stroke="${stroke}" stroke-width="2"/>`;
const svg=b=>`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="720"><rect width="1200" height="720" fill="#faf8f3"/><g font-family="Microsoft YaHei, Arial, sans-serif">${b}</g></svg>`;
for(const lang of ['zh','en']){
 const zh=lang==='zh';let b=t(48,62,zh?'正常退出，只回答了第一层问题':'Normal exit answers only the first question',34,'#173665',700);
 b+=t(48,105,zh?'同一条执行可以同时留下三个不同事实':'One execution can leave three different facts',23,'#63718a');
 const rows=zh?[
 ['进程结束','exit 0','程序正常退出','#edf3ff','#214dcc'],
 ['供应商终态','ERROR','额度失败；开场文字不能成为正式交付','#fff2dc','#a46a10'],
 ['产物存在','文件可保留','保留证据，同时报告执行失败','#edf3ff','#214dcc']
 ]:[['Process outcome','exit 0','The process exited normally','#edf3ff','#214dcc'],['Provider outcome','ERROR','Quota failure; narration is not a deliverable','#fff2dc','#a46a10'],['Artifact exists','File may remain','Keep the evidence while reporting failure','#edf3ff','#214dcc']];
 rows.forEach((r,i)=>{const y=145+i*135;b+=box(48,y,1104,114,r[3])+t(75,y+45,r[0],24,'#203558',600)+t(390,y+42,r[1],27,r[4],700)+t(390,y+83,r[2],22);});
 b+=box(48,570,1104,88,'#f2edfa','#d5c7e8')+t(75,607,zh?'独立验收还要判断：材料是否满足当前目标':'Independent verification still asks: does it meet the current objective?',24,'#704995',600)+t(75,640,zh?'这一步不由退出码、供应商状态或文件存在自动代替。':'Neither exit status nor file existence substitutes for that judgment.',21,'#704995');
 b+=t(48,697,zh?'本地原脚本测试 · CLI 为替身 · 不是 152 次历史审计重跑':'Original-script local tests · Fixture CLI · Not a rerun of the 152-dispatch audit',19,'#63718a');
 const a=svg(b);writeFileSync(new URL(`terminal-result.figure.${lang}.svg`,out),a);await sharp(Buffer.from(a)).png().toFile(new URL(`terminal-result.figure.${lang}.png`,out).pathname.replace(/^\/([A-Z]:)/,'$1'));
 b=t(48,62,zh?'历史为空，旧引用是否也失效？':'History is empty. Are old references invalid?',34,'#173665',700)+t(48,105,zh?'真实 SQLite 提交后的两种确认故障：取消 / 抛错':'Two acknowledgement failures after a real SQLite commit: cancellation / error',22,'#63718a');
 b+=box(48,144,1104,92,'#edf3ff')+t(75,183,zh?'数据库删除已提交':'Database deletion committed',27,'#214dcc',700)+t(75,216,zh?'历史列表为空；确认返回随后失败。':'History is empty; acknowledgement then fails.',22);
 for(const [i,fixed]of[[0,false],[1,true]]){const x=48+i*566;b+=box(x,270,538,258,fixed?'#edf3ff':'#fff2dc')+t(x+26,315,zh?(fixed?'候选修复':'旧 clear 方法对照'):(fixed?'Candidate fix':'Predecessor clear method'),27,fixed?'#214dcc':'#a46a10',700);b+=t(x+26,367,zh?(fixed?'两类旧响应指针失效':'两类旧响应指针仍保留'):(fixed?'Old response pointers invalidated':'Old response pointers retained'),23);b+=t(x+26,417,zh?(fixed?'缺少新 ID 时拒绝续接':'下一次调用仍可能使用旧 ID'):(fixed?'Reject continuation without a new ID':'The next call may still use the old ID'),22);b+=t(x+26,475,zh?(fixed?'新写入、新响应 ID 仍可使用':'已有 mutation generation 并未代替清理'):(fixed?'New writes and response IDs still work':'Existing generation does not clear pointers'),21);}
 b+=box(48,562,1104,93,'#f2edfa','#d5c7e8')+t(75,601,zh?'并发等待对照：两版均通过':'Concurrency waiting control: both versions pass',25,'#704995',600)+t(75,636,zh?'固定完整 SDK；仅替换 clear 方法；远端 compact 为 AsyncMock。':'Pinned complete SDK; only clear substituted; remote compact is an AsyncMock.',21,'#704995');
 b+=t(48,696,zh?'5 项候选通过；旧方法 4 失败、1 通过 · 不证明远端删除':'5 candidate passes; predecessor 4 failures, 1 pass · Does not prove remote erasure',19,'#63718a');
 const c=svg(b);writeFileSync(new URL(`clear-continuation.figure.${lang}.svg`,out),c);await sharp(Buffer.from(c)).png().toFile(new URL(`clear-continuation.figure.${lang}.png`,out).pathname.replace(/^\/([A-Z]:)/,'$1'));
}
console.log('Built four localized inline figures');
