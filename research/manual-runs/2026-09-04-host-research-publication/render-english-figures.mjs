import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
const dir = path.resolve('docs/public/assets/host-research-20260903');
const variants = [
 ['figure-01-evidence-completeness', [
 'No failure received does not mean complete success evidence',
 'CodeFlowMu V2.2.6 · Controlled result injection into the real service; no live provider launch',
 'The plan requires four distinct test IDs (Cursor plan shown)',
 '01','Supply chain','02','Type exports','03','Agent listing','04','Live send',
 'Results actually returned','[ ]','Empty array','Completed: 0 / 4',
 'Aggregation searches for','FAIL  /  BLOCKED','Neither found → PASS',
 'PASS','VERIFIED','Verification still issued',
 'Gap: no check for required-ID coverage, duplicates, or membership; empty results can pass.',
 'Proposal (not implemented)','Check completeness before deciding whether the candidate passed.',
 'Source: E1, injected results through the real service; no provider launched and no update applied.'
 ]],
 ['figure-02-process-identity', [
 'The same PID does not establish executor continuity',
 'CodeFlowMu V2.2.6 · Controlled durable records; not a production incident or process-restart experiment',
 'The same controlled owner facts',
 'Old record: started in 2000','PID: current research process','OS: this process is alive','OS creation time: this study (2026)',
 'Process created after the old record','→ Not the original executor from 2000',
 'Approval record read path','Same PID skips death check; no generation comparison','Remains executing',
 'Existing writer-lock function (legacy format)','OS creation time is later than synthetic acquired_at','Recognized as stale',
 'Identity mismatch ≠ effect absent ≠ retry authorized',
 'Even after identifying a stale owner, inspect effect facts and current authority.',
 'Limits','Synthetic old record + real OS query; no induced PID reuse; zero executor calls.',
 'Source: E2. Different responsibilities; the comparison tests recognition of the same temporal contradiction.'
 ]],
 ['figure-03-cloud-enterprise-boundary', [
 'Enterprise machines; the Agent loop can remain in the cloud',
 'Self-Hosted Machines · Execution location, data flow, and business responsibility are separate questions',
 'Cursor Cloud','Organizes the next Agent step','Agent loop','Reasoning and planning','Receives execution results',
 'Enterprise-owned machines','Worker executes tools','File edits · Terminal commands','Local MCP · Desktop interaction','Local workspace · Build environment',
 'Tool calls','Required content returned','Files · Output · Diffs','Screenshots · MCP results',
 'Worker initiates connection','Outbound HTTPS',
 'Local execution ≠ no outbound data; Privacy Mode ≠ offline operation.',
 'Author’s product questions','Who authorizes and accepts work? Can evidence be read outside one platform?',
 'Source: official Cursor Self-Hosted Machines documentation, checked through 2026-09-03.',
 'A responsibility/data-flow diagram, not a UI, deployment benchmark, or completed CodeFlowMu integration.'
 ]]
];
const xml = s => s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
for (const [name, strings] of variants) {
 let index = 0;
 let svg = fs.readFileSync(path.join(dir, name+'-zh.svg'),'utf8');
 svg = svg.replace(/<text([^>]*)>(.*?)<\/text>/g, (_, attrs) => {
  const s = strings[index++];
  if (s === undefined) throw new Error('Missing translation');
  const x = Number(attrs.match(/x="([\d.]+)"/)[1]);
  const y = Number(attrs.match(/y="([\d.]+)"/)[1]);
  let width = 1600;
  if(y>230 && y<735) {
   if(name.includes('evidence')) width = x===925 ? 450 : x===1515 ? 335 : x===295 ? 345 : y===253 ? 1550 : 340;
   if(name.includes('identity')) width = x===132 ? 505 : 752;
   if(name.includes('enterprise')) width = x===900 ? 390 : 505;
  }
  if(y===906) width = x===105 ? 270 : 1270;
  if(y===912) width = x===105 ? 160 : 1400;
  if(y===920) width = x===105 ? 290 : 1270;
  const size = Number(attrs.match(/font-size="([\d.]+)"/)[1]);
  const fitted = Math.min(size, Math.floor(width/(s.length*0.57)));
  attrs=attrs.replace(/font-size="[\d.]+"/, `font-size="${fitted}"`);
  return `<text${attrs}>${xml(s)}</text>`;
 });
 if(index !== strings.length) throw new Error('Unused translation');
 svg=svg.replace('Microsoft YaHei, Noto Sans CJK SC, sans-serif','Arial, sans-serif');
 fs.writeFileSync(path.join(dir,name+'-en.svg'),svg);
 await sharp(Buffer.from(svg)).resize({width:3600}).png().toFile(path.join(dir,name+'-en.png'));
 console.log(name+'-en: 3600 px, '+index+' translated labels');
}
