from pathlib import Path
import html,re,json,sys
from PIL import Image

r=Path(__file__).parent
(r/'qa').mkdir(exist_ok=True)
en='--en' in sys.argv
source='article.en.md' if en else '6个AI，同一道题，会怎么样.md'
md=(r/source).read_text(encoding='utf8')
def inline(t):
    t=html.escape(t)
    t=re.sub(r'\[([^\]]+)\]\(([^)]+)\)',r'<a href="\2">\1</a>',t)
    t=re.sub(r'\*\*(.+?)\*\*',r'<strong>\1</strong>',t)
    t=re.sub(r'`([^`]+)`',r'<code>\1</code>',t)
    return t

lines=md.splitlines();first=next(i for i,s in enumerate(lines) if s.startswith('## '))
intro=next(s for s in lines[:first] if s.startswith('On September 9, 2026,' if en else '2026年9月9日，我们'))
out=[];toc=[];table=[];paragraph=[];section=False;pending_figure=False;code_lines=None;code_lang=''
def flush():
    if paragraph:
        out.append('<p>'+inline(' '.join(paragraph))+'</p>');paragraph.clear()
def flush_table():
    if not table:return
    rows=[s for s in table if not re.match(r'^\|[\s:|\-]+\|$',s)]
    out.append('<div class="table-scroll"><table>')
    for i,row in enumerate(rows):
        tag='th' if i==0 else 'td'
        out.append('<tr>'+''.join(f'<{tag}>{inline(c.strip())}</{tag}>' for c in row.strip('|').split('|'))+'</tr>')
    out.append('</table></div>');table.clear()
for line in lines[first:]:
    if line.startswith('```'):
        if code_lines is None:
            flush();flush_table();code_lang=line[3:].strip();code_lines=[]
        else:
            label=('Actual source excerpt' if code_lang in ('typescript','javascript') else 'Actual file excerpt') if en else ('真实源码节选' if code_lang in ('typescript','javascript') else '真实文件节选')
            out.append('<div class="evidence-code"><div class="code-label">'+label+' · '+html.escape(code_lang.upper())+'</div><pre><code>'+html.escape('\n'.join(code_lines))+'</code></pre></div>');code_lines=None
        continue
    if code_lines is not None:code_lines.append(line);continue
    if line.startswith('|'):flush();table.append(line);continue
    flush_table()
    if not line.strip():flush();continue
    if line.startswith('## '):
        flush()
        if section:out.append('</section>')
        title=line[3:];sid='chapter-'+str(len(toc)+1);toc.append((sid,title));section=True
        out.append(f'<section id="{sid}"><div class="eyebrow">PART {len(toc):02d} / CODEFLOWMU × FCOP</div><h2>{inline(title)}</h2>');continue
    if line.startswith('#### '):flush();out.append('<h4>'+inline(line[5:])+'</h4>');continue
    if line.startswith('##### '):flush();out.append('<h5 class="code-step">'+inline(line[6:])+'</h5>');continue
    if line.startswith('### '):
        flush();heading=line[4:];num=re.match(r'(\d+)\.(\d+) ',heading);anchor=' id="section-'+num[1]+'-'+num[2]+'"' if num else ''
        out.append('<h3'+anchor+'>'+inline(heading)+'</h3>');continue
    im=re.fullmatch(r'!\[([^\]]*)\]\(([^)]+)\)',line)
    if im:
        flush();src=im[2];alt=html.escape(im[1],quote=True)
        detail_map={
          'scene-task-panel.png':(180,178,870,188,'局部：PM分派的任务与检查范围'),
          'scene-cursor-recovery.png':(155,210,865,280,'局部：原QA任务与模型修复后重跑的任务'),
          'scene-eval-report.png':(493,251,675,280,'局部：EVAL报告生成结果'),
          'scene-team-models.png':(15,18,815,355,'局部：PM团队模型与独立EVAL配置')
        }
        name=Path(src).name
        if name in detail_map:
            x,y,cw,ch,label=detail_map[name];nw,nh=Image.open(r/src).size
            # This is a browser viewport of the untouched original PNG, not a regenerated image.
            crop=f'<div class="detail-scroll"><button class="zoom detail-window" style="width:{cw}px;height:{ch}px" data-focus-x="{x}" data-focus-y="{y}" aria-label="原像素查看：{alt}"><img loading="lazy" src="{src}" alt="{alt}（局部）" style="width:{nw}px;height:{nh}px;left:-{x}px;top:-{y}px"></button></div>'
            out.append(f'<figure class="screenshot"><div class="detail-label">{label}</div>{crop}<div class="image-actions"><span>原图 {nw} × {nh} · 点击按100%查看</span><a href="{src}" target="_blank" rel="noopener">打开原图 ↗</a></div><details class="full-scene"><summary>展开完整界面</summary><button class="zoom" aria-label="完整界面：{alt}"><img loading="lazy" src="{src}" alt="{alt}"></button></details></figure>')
        else:
            if Path(src).suffix.lower()=='.svg':
                import xml.etree.ElementTree as ET
                box=ET.parse(r/src).getroot().attrib['viewBox'].split();iw,ih=box[2:4]
            else:iw,ih=Image.open(r/src).size
            out.append(f'<figure><button class="zoom" aria-label="放大图表：{alt}"><img loading="lazy" width="{iw}" height="{ih}" style="height:auto" src="{src}" alt="{alt}"></button><figcaption>点击图表可放大查看</figcaption></figure>')
        continue
    if line.startswith('> '):flush();out.append('<blockquote>'+inline(line[2:])+'</blockquote>');continue
    paragraph.append(line)
flush();flush_table()
if section:out.append('</section>')
nav=''.join(f'<a href="#{sid}"><span>{i+1:02d}</span>{html.escape(title)}</a>' for i,(sid,title) in enumerate(toc))
page='''<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>6个AI，同一道题，会怎么样？ · CodeFlowMu</title><style>
:root{--ink:#152b41;--muted:#65768a;--line:#dce5ec;--cyan:#087e99;--navy:#09172c}*{box-sizing:border-box}html{scroll-behavior:smooth;scroll-padding-top:85px}body{margin:0;color:var(--ink);background:#f7f9fb;font-family:"Microsoft YaHei","PingFang SC",sans-serif;line-height:1.85}a{color:var(--cyan);text-underline-offset:4px}button{font:inherit;cursor:pointer}header{height:62px;background:rgba(9,23,44,.97);color:#fff;display:flex;align-items:center;justify-content:space-between;padding:0 5vw;position:sticky;top:0;z-index:10;border-bottom:1px solid #ffffff18}header a{color:#d8e8f4;text-decoration:none;font-size:13px}header .brand{font-size:17px;letter-spacing:.04em;font-weight:700}header nav{display:flex;gap:24px}#progress{position:absolute;height:3px;background:#67d1e8;bottom:0;left:0;width:0}.hero{position:relative;background:#09172c;color:white;overflow:hidden;padding:70px max(6vw,24px) 60px;min-height:660px;display:grid;grid-template-columns:1fr 1fr;align-items:center;gap:30px}.hero-copy{position:relative;z-index:1;max-width:660px}.eyebrow{font-size:12px;letter-spacing:.13em;color:var(--cyan);font-weight:700;margin-bottom:15px}.hero .eyebrow{color:#85d9e8}.hero h1{font-size:clamp(38px,4.7vw,72px);line-height:1.25;letter-spacing:-.045em;margin:20px 0}.hero .deck{font-size:clamp(18px,1.6vw,24px);color:#bce6ef;margin:22px 0}.hero p{color:#b9c9da;font-size:15px;line-height:1.95}.hero img{width:100%;border-radius:16px;box-shadow:0 30px 100px #0008}.date{font-size:12px;color:#95a9c2;margin-top:27px}.stats{display:grid;grid-template-columns:repeat(3,1fr);max-width:1120px;margin:0 auto;padding:35px 28px;border-bottom:1px solid var(--line);gap:22px}.stat{border-right:1px solid var(--line)}.stat:last-child{border:0}.stat strong{font-size:31px;display:block;line-height:1.4}.stat span{font-size:13px;color:var(--muted)}.layout{max-width:1390px;margin:auto;display:grid;grid-template-columns:245px minmax(0,890px);justify-content:center;gap:65px;padding:55px 32px 85px}aside{position:sticky;top:91px;align-self:start;max-height:calc(100vh - 115px);overflow:auto;font-size:12px;padding-right:15px}aside h2{font-size:14px;margin:0 0 12px}aside a{display:flex;gap:10px;text-decoration:none;color:var(--muted);line-height:1.65;padding:7px 8px;border-left:2px solid transparent}aside a span{font-size:10px;opacity:.7;padding-top:2px}aside a.active{border-color:var(--cyan);color:var(--cyan);background:#eaf3f6}main{min-width:0}section{padding:10px 0 54px;margin-bottom:45px;border-bottom:1px solid var(--line)}h2{font-size:clamp(26px,2.5vw,36px);line-height:1.45;letter-spacing:-.03em;margin:0 0 26px}h3{font-size:20px;line-height:1.6;color:var(--cyan);margin:34px 0 12px}p{font-size:16px;margin:0 0 21px}figure{margin:30px 0 24px;background:white;border:1px solid var(--line);border-radius:12px;overflow:hidden}.zoom{display:block;width:100%;padding:0;border:0;background:white;cursor:zoom-in}.zoom img{display:block;width:100%;height:auto}figcaption{font-size:11px;text-align:right;color:var(--muted);padding:7px 14px;background:#fff}.table-scroll{overflow:auto;margin:25px 0}table{width:100%;border-collapse:collapse;font-size:13px;min-width:610px}th,td{padding:13px 16px;text-align:left;border-bottom:1px solid var(--line)}th{background:#e9f1f6}blockquote{border-left:3px solid var(--cyan);margin:24px 0;padding:20px 24px;background:#eaf2f6;font-size:16px}code{font-size:.88em;overflow-wrap:anywhere;background:#e9eef3;padding:2px 4px;border-radius:3px}footer{background:var(--navy);color:#a9bdcf;text-align:center;padding:35px 20px;font-size:13px}footer a{color:#8ed4e4}dialog{border:0;background:#071222ec;padding:50px 16px 16px;max-width:96vw;width:1400px;max-height:95vh;border-radius:12px}dialog::backdrop{background:#000b}dialog img{display:block;width:100%;max-height:80vh;object-fit:contain}dialog button{position:absolute;right:18px;top:10px;border:0;background:transparent;color:white;font-size:25px}.mobile-toc{display:none}
@media(max-width:1000px){.layout{gap:30px;grid-template-columns:190px minmax(0,1fr);padding:40px 22px}.hero{min-height:0;padding:45px 25px;gap:25px}.hero h1{font-size:43px}aside{font-size:11px}}
@media(max-width:720px){header{padding:0 18px}header nav{gap:15px}header .brand{font-size:15px}.hero{grid-template-columns:1fr;padding:34px 22px}.hero img{max-height:330px;object-fit:cover}.hero h1{font-size:44px}.hero .deck{font-size:18px}.stats{padding:24px 20px;gap:16px}.stat strong{font-size:25px}.stat span{font-size:11px}.layout{display:block;padding:30px 20px}aside{position:static;max-height:none;padding:0 0 30px;margin-bottom:30px;border-bottom:1px solid var(--line)}aside .links{display:none}aside.open .links{display:block}.mobile-toc{display:block;width:100%;text-align:left;background:white;border:1px solid var(--line);padding:12px;color:var(--ink);border-radius:8px}aside h2{display:none}h2{font-size:27px}p{font-size:16px;line-height:1.95}section{padding-bottom:30px;margin-bottom:30px}h3{font-size:19px}figure{margin-left:-8px;margin-right:-8px}}
@media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}}@media print{header,aside,dialog,figcaption{display:none}.hero{min-height:0}.layout{display:block;padding:0}.hero img{width:250px}section{break-inside:avoid}}
</style></head><body><header><a class="brand" href="#top">CodeFlowMu / 实测手记</a><nav><a href="#chapter-1">读结论</a><a href="#contents">目录</a><a href="6个AI，同一道题，会怎么样.md">原稿</a></nav><div id="progress"></div></header>
<div class="hero" id="top"><div class="hero-copy"><div class="eyebrow">SIX AI / ONE TASK / 2026.09.09</div><h1>6个AI，同一道题，<br>会怎么样？</h1><div class="deck">用 CodeFlowMu，实测六个 AI 的团队工作能力。</div><p>INTRO</p><div class="date">2026年9月9日实测 · 9月10日整理 · 单轮观察，不是通用模型排行榜</div></div><img src="assets/hero.png" alt="六个AI通过CodeFlowMu接受同题测试的概念题图"></div>
<div class="stats"><div class="stat"><strong>6 个方案</strong><span>同一任务正文 · 多角色协作</span></div><div class="stat"><strong>4 轮交付</strong><span>2轮强制终止，保留失败记录</span></div><div class="stat"><strong>12分20秒</strong><span>最快正常交付 · 按正式回执计时</span></div></div>
<div class="layout"><aside id="contents"><h2>文章目录</h2><button class="mobile-toc" aria-expanded="false">展开文章目录 ↓</button><div class="links">NAV</div></aside><main>BODY</main></div>
<footer>CodeFlowMu 六AI同题实测 · 证据与EVAL增订版<br><a href="EVAL对照与来源.md">EVAL来源</a> · <a href="scorecard.csv">评分数据</a> · <a href="timing.csv">计时数据</a> · <a href="six-ai-article.zip">文章素材包</a></footer>
<dialog aria-label="图片原像素预览"><div class="viewer-tools"><button class="native-size" aria-pressed="true">100% 原像素</button><button class="fit-size" aria-pressed="false">适应窗口</button><a class="original-link" target="_blank" rel="noopener">打开原图 ↗</a><button class="viewer-close" aria-label="关闭图表">×</button></div><div class="viewer-canvas"><img alt=""></div></dialog><script>
const dialog=document.querySelector('dialog'),big=dialog.querySelector('img'),canvas=dialog.querySelector('.viewer-canvas'),native=dialog.querySelector('.native-size'),fit=dialog.querySelector('.fit-size');let focusX=0,focusY=0;function setSize(mode){const isNative=mode==='native';dialog.dataset.size=mode;native.setAttribute('aria-pressed',isNative);fit.setAttribute('aria-pressed',!isNative);if(isNative){big.style.width=big.naturalWidth+'px';big.style.height=big.naturalHeight+'px'}else{big.style.width='';big.style.height=''}requestAnimationFrame(()=>{canvas.scrollLeft=isNative?focusX:0;canvas.scrollTop=isNative?focusY:0})}document.querySelectorAll('.zoom').forEach(b=>b.addEventListener('click',()=>{const img=b.querySelector('img');focusX=Number(b.dataset.focusX||0);focusY=Number(b.dataset.focusY||0);big.onload=()=>setSize('native');big.src=img.src;big.alt=img.alt;dialog.querySelector('.original-link').href=img.src;dialog.showModal();if(big.complete)setSize('native')}));native.onclick=()=>setSize('native');fit.onclick=()=>setSize('fit');dialog.querySelector('.viewer-close').onclick=()=>dialog.close();dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close()});const toggle=document.querySelector('.mobile-toc');toggle.onclick=()=>{let open=document.querySelector('aside').classList.toggle('open');toggle.setAttribute('aria-expanded',open);toggle.textContent=open?'收起文章目录 ↑':'展开文章目录 ↓'};const links=[...document.querySelectorAll('aside a')],sections=[...document.querySelectorAll('main section')];function update(){const max=document.documentElement.scrollHeight-innerHeight;document.querySelector('#progress').style.width=(max>0?scrollY/max*100:0)+'%';let current=sections[0];for(const s of sections){if(s.getBoundingClientRect().top<180)current=s}links.forEach(a=>a.classList.toggle('active',a.hash==='#'+current.id))}addEventListener('scroll',update,{passive:true});update();
</script></body></html>'''
page=page.replace('.stat strong{font-size:25px}', '.stat strong{font-size:19px;white-space:nowrap}')
page=page.replace('@media(prefers-reduced-motion:reduce)', '@media(max-width:720px){dialog img{min-width:850px;max-height:none}dialog{overflow:auto}}\n@media(prefers-reduced-motion:reduce)')
page=page.replace('<meta name="viewport" content="width=device-width,initial-scale=1">','<meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="用CodeFlowMu对六个AI开展同题团队巡检实测，对比任务完成、效率、报告质量、授权恢复与EVAL证据。"><meta property="og:title" content="6个AI，同一道题，会怎么样？"><meta property="og:description" content="CodeFlowMu六AI同题实测：工作过程、独立EVAL与综合评分。"><meta property="og:type" content="article">')
page=page.replace('用 CodeFlowMu，实测六个 AI 的团队工作能力。','用 CodeFlowMu 与 FCoP，让 AI 团队工作有据可查。')
page=page.replace('href="#chapter-1">读结论','href="#chapter-4">看结论')
page=page.replace('href="six-ai-article.zip"','href="web-article.zip"')
page=page.replace('</style>','.detail-label{padding:12px 16px;color:#087e99;background:#edf4f7;font-size:13px;font-weight:700}.detail-scroll{overflow:auto;background:#101725}.detail-window{position:relative;overflow:hidden;max-width:none;margin:0 auto;flex-shrink:0}.detail-window img{position:absolute;max-width:none!important;max-height:none!important;display:block}.image-actions{display:flex;gap:12px;justify-content:space-between;align-items:center;padding:11px 16px;font-size:12px;color:#60768b;background:white}.image-actions a{white-space:nowrap}.full-scene summary{padding:10px 16px;font-size:13px;background:#f5f8fa;cursor:pointer;color:#334e65}.full-scene .zoom img{width:100%}.screenshot{border-color:#cddce7}dialog{width:96vw;height:94vh;max-width:96vw;max-height:94vh;padding:0;overflow:hidden;background:#0b1727}dialog[open]{display:flex;flex-direction:column}.viewer-tools{display:flex;align-items:center;gap:12px;flex-shrink:0;min-height:58px;padding:9px 14px;color:white;background:#15273e}.viewer-tools button{position:static;font-size:13px;right:auto;top:auto;border:1px solid #56708a;border-radius:5px;padding:7px 12px;background:transparent;color:#eef7ff}.viewer-tools button[aria-pressed="true"]{background:#185773;border-color:#71bed3}.viewer-tools a{font-size:13px;color:#9de4f5}.viewer-tools .viewer-close{margin-left:auto;font-size:24px;line-height:24px;padding:3px 10px}.viewer-canvas{overflow:auto;flex:1;min-height:0;min-width:0;overscroll-behavior:contain;touch-action:pan-x pan-y}dialog .viewer-canvas img{display:block;max-width:none;max-height:none;min-width:0;object-fit:initial;margin:0}dialog[data-size="fit"] .viewer-canvas img{width:100%;height:auto;max-height:100%;object-fit:contain}dialog[data-size="fit"] .viewer-canvas{display:grid;place-items:center}@media(max-width:720px){.detail-window{margin:0}.image-actions{font-size:11px;padding:9px;flex-wrap:wrap}.viewer-tools{gap:6px;padding:8px}.viewer-tools button{padding:6px;font-size:11px}.viewer-tools a{font-size:11px}dialog{width:98vw;max-width:98vw}.detail-label{font-size:12px}}</style>')
page=page.replace('INTRO',html.escape(intro)).replace('NAV</div>',nav+'</div>').replace('BODY</main>',''.join(out)+'</main>')
page=page.replace('</style>','h3[id]{scroll-margin-top:88px}h4{font-size:17px;color:#344d62;margin:30px 0 12px} .reading-path{padding:16px 22px;border:1px solid #dce5ec;border-left:4px solid #087e99;background:white;margin:0 0 32px;font-size:14px}.reading-path a{display:inline-block;margin:4px 16px 4px 0}</style>')
page=page.replace('<main>','<main><div class="reading-path"><strong>从证据读懂本次测试</strong><br><a href="#section-1-1">团队与EVAL</a><a href="#section-1-2">任务原文</a><a href="#section-1-8">系统留下什么文件</a><a href="#section-3-1">六家PM交付链</a><a href="#section-3-13">未完成原因</a><a href="#section-4-1">CodeFlowMu的价值</a></div>')
page=page.replace('</style>','.evidence-code{margin:24px 0;border-radius:10px;overflow:hidden;border:1px solid #254158;background:#102438}.code-label{font-size:12px;color:#a5dce7;padding:10px 18px;background:#193349;letter-spacing:.04em}.evidence-code pre{margin:0;padding:18px;overflow:auto;line-height:1.8;font-size:13px;color:#e0edf5;white-space:pre}.evidence-code pre code{font-family:Consolas,"Microsoft YaHei",monospace;color:inherit;background:none;padding:0;font-size:inherit;overflow-wrap:normal}</style>')
page=page.replace('</style>','.code-step{font-size:19px;color:#087e99;border-top:1px solid #dce5ec;margin:38px 0 14px;padding-top:22px}</style>')
page=re.sub(r'href="([^"#]+)\.md"',r'href="\1.html"',page)
page=page.replace('href="6个AI，同一道题，会怎么样.html"','href="index.html"')
page=page.replace('>原稿</a>','>文章首页</a>')
if en:
    # Translate interface text only; the English article and literal source excerpts
    # above are independently authored and retain their original evidence wording.
    translations={
      'lang="zh-CN"':'lang="en"',
      '6个AI，同一道题，会怎么样？':'Six AIs, One Task: What Happened?',
      '6个AI，同一道题，<br>会怎么样？':'Six AIs. One Task.<br>What Happened?',
      'CodeFlowMu / 实测手记':'CodeFlowMu / Field Test',
      '用 CodeFlowMu 与 FCoP，让 AI 团队工作有据可查。':'Making AI teamwork inspectable with CodeFlowMu and FCoP.',
      '2026年9月9日实测 · 9月10日整理 · 单轮观察，不是通用模型排行榜':'Tested September 9, 2026 · Analyzed September 10 · One run per scheme',
      '六个AI通过CodeFlowMu接受同题测试的概念题图':'Concept cover: six AI teams tested through CodeFlowMu',
      '6 个方案':'6 schemes','4 轮交付':'4 deliveries','12分20秒':'12m 20s',
      '同一任务正文 · 多角色协作':'One task · Multiple roles',
      '2轮强制终止，保留失败记录':'2 terminated runs, with retained records',
      '最快正常交付 · 按正式回执计时':'Fastest formal delivery',
      '看结论':'Conclusions','>目录<':'>Contents<','文章首页':'Article home',
      '展开文章目录 ↓':'Show contents ↓','收起文章目录 ↑':'Hide contents ↑','文章目录':'Contents',
      '从证据读懂本次测试':'Explore the evidence',
      '团队与EVAL':'Team and EVAL','任务原文':'Exact task',
      '系统留下什么文件':'Retained artifacts','六家PM交付链':'PM delivery chains',
      '未完成原因':'Incomplete runs','CodeFlowMu的价值':'CodeFlowMu’s contribution',
      '局部：PM分派的任务与检查范围':'Detail: PM assignments and scope',
      '局部：原QA任务与模型修复后重跑的任务':'Detail: original QA task and rerun',
      '局部：EVAL报告生成结果':'Detail: EVAL report generation',
      '局部：PM团队模型与独立EVAL配置':'Detail: team model and independent EVAL',
      '原像素查看：':'View native pixels: ','（局部）':' (detail)',
      '原图 ':'Original ','点击按100%查看':'View at 100%',
      '打开原图 ↗':'Open original ↗','展开完整界面':'Show full screenshot','完整界面：':'Full screenshot: ',
      '放大图表：':'Enlarge figure: ','点击图表可放大查看':'Click to enlarge',
      'CodeFlowMu 六AI同题实测 · 证据与EVAL增订版':'CodeFlowMu · Six AI teams · Evidence and EVAL',
      'EVAL来源':'EVAL sources (Chinese)','评分数据':'Score data','计时数据':'Timing data','文章素材包':'Article package',
      '图片原像素预览':'Original image viewer','100% 原像素':'100% pixels','适应窗口':'Fit to window','关闭图表':'Close image',
      '用CodeFlowMu对六个AI开展同题团队巡检实测，对比任务完成、效率、报告质量、授权恢复与EVAL证据。':'Six AI teams tested through CodeFlowMu: delivery, efficiency, report quality, authorized recovery and EVAL evidence.',
      'CodeFlowMu六AI同题实测：工作过程、独立EVAL与综合评分。':'Six AI teams, one task: workflow evidence, independent EVAL and comparative scores.'
    }
    for old,new in translations.items():page=page.replace(old,new)
    page=page.replace('href="index.html">Article home','href="en.html">Article home')
dest='en.html' if en else 'index.html'
page=page.replace('</style>','@media(max-width:720px){header .brand{font-size:14px;white-space:nowrap}header nav{gap:16px}header nav a{white-space:nowrap}header nav a:first-child,header nav a:nth-child(3){display:none}html[lang="en"] .hero h1{font-size:38px}}</style>')
base='https://joinwell52-ai.github.io/joinwell52/articles/codeflowmu-six-ai-20260909/'
page=page.replace('</head>',f'<link rel="canonical" href="{base}{dest}"><link rel="alternate" hreflang="zh-CN" href="{base}index.html"><link rel="alternate" hreflang="en" href="{base}en.html"><meta property="og:image" content="{base}assets/hero.png"></head>')
page=page.replace('</nav>','<a href="'+('index.html" lang="zh-CN">中文' if en else 'en.html" lang="en">English')+'</a></nav>',1)
(r/dest).write_text(page,encoding='utf8')
assert len(toc)==4,len(toc)
for src in re.findall(r'<img[^>]+src="([^"]+)"',page):assert (r/src).is_file(),src
(r/('qa/web-content-check-en.json' if en else 'qa/web-content-check.json')).write_text(json.dumps({'sections':len(toc),'images':len(re.findall('<figure>',page))+1,'source':source,'image_paths':'pass','responsive_breakpoints':[1000,720]},ensure_ascii=False,indent=2),encoding='utf8')
print('Built',dest,':',len(toc),'sections;',len(out),'content blocks')
