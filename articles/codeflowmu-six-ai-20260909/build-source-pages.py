from pathlib import Path
import html,re
r=Path(__file__).parent
def inline(s):
 s=html.escape(s)
 s=re.sub(r'\*\*(.+?)\*\*',r'<strong>\1</strong>',s)
 s=re.sub(r'`([^`]+)`',r'<code>\1</code>',s)
 return re.sub(r'\[([^\]]+)\]\(([^)]+)\)',r'<a href="\2">\1</a>',s)
for p in r.glob('*.md'):
 if p.name.startswith('6个') or p.name=='article.en.md':continue
 body=[];rows=[];code=False
 def table():
  if rows:
   body.append('<div class="scroll"><table>')
   for i,row in enumerate(rows):
    if re.fullmatch(r'[\s|:\-]+',row):continue
    tag='th' if i==0 else 'td';body.append('<tr>'+''.join(f'<{tag}>{inline(c.strip())}</{tag}>' for c in row.strip('|').split('|'))+'</tr>')
   body.append('</table></div>');rows.clear()
 for line in p.read_text(encoding='utf8').splitlines():
  if line.startswith('```'):
   table();body.append('</pre>' if code else '<pre>');code=not code;continue
  if code:body.append(html.escape(line)+'\n');continue
  if line.startswith('|'):rows.append(line);continue
  table()
  if not line.strip():continue
  image=re.fullmatch(r'!\[([^\]]*)\]\(([^)]+)\)',line)
  if image:
   body.append('<figure><img style="width:100%;height:auto" alt="'+html.escape(image[1],quote=True)+'" src="'+html.escape(image[2],quote=True)+'"></figure>');continue
  head=re.match(r'^(#{1,6}) (.*)',line)
  if head:level=len(head[1]);body.append(f'<h{level}>{inline(head[2])}</h{level}>')
  elif line.startswith('- '):body.append('<p class="bullet">• '+inline(line[2:])+'</p>')
  else:body.append('<p>'+inline(line)+'</p>')
 table()
 page='<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'+html.escape(p.stem)+' · CodeFlowMu</title><style>body{margin:0;background:#f6f8fb;color:#193046;font:16px/1.9 "Microsoft YaHei",sans-serif}header{background:#09172c;padding:18px 5vw}header a{color:#bdeaf2;text-decoration:none}main{max-width:950px;margin:45px auto;padding:0 25px 70px;overflow-wrap:anywhere}h1{font-size:30px}h2{margin-top:45px;border-bottom:1px solid #dbe4ea;padding-bottom:12px}h3{color:#087e99;margin-top:30px}p{margin:14px 0}a{color:#087e99}code{font-size:.85em;background:#e7edf3;padding:2px 4px}pre{overflow:auto;padding:20px;background:#e7edf3;font-size:13px}.scroll{overflow:auto}table{border-collapse:collapse;min-width:600px;width:100%;font-size:13px}th,td{padding:12px;border:1px solid #dae3eb;text-align:left}th{background:#e8f0f5}.bullet{padding-left:15px}</style></head><body><header><a href="index.html">← 返回：6个AI，同一道题，会怎么样？</a></header><main>'+''.join(body)+'</main></body></html>'
  # Keep external source links unchanged; render local Markdown documents as UTF-8 HTML.
 page=re.sub(r'href="([^":]+)\.md"',r'href="\1.html"',page)
 if p.name=='sources.en.md':
  page=page.replace('lang="zh-CN"','lang="en"').replace('← 返回：6个AI，同一道题，会怎么样？','← Return to the English article').replace('<a href="index.html">←','<a href="en.html">←')
 p.with_suffix('.html').write_text(page,encoding='utf8')
print('Generated UTF-8 source pages')
