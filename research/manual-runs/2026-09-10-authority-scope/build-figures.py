import sys,pathlib,json
ROOT=pathlib.Path(__file__).parent
sys.path.insert(0,str(ROOT/'.deps'))
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from matplotlib.font_manager import FontProperties
plt.rcParams.update({'font.size':19,'axes.titlesize':24,'axes.labelsize':18,'xtick.labelsize':18,'ytick.labelsize':17,'axes.spines.top':False,'axes.spines.right':False,'axes.spines.left':False,'axes.edgecolor':'#cdd3df','text.color':'#17243d','axes.labelcolor':'#17243d','figure.facecolor':'#faf9f5','axes.facecolor':'#faf9f5','savefig.facecolor':'#faf9f5'})
cobalt='#245bd5';amber='#ca821b';violet='#7b62ae'
font=FontProperties(fname='C:/Windows/Fonts/msyh.ttc')
def finish(fig,path,lang):
    if lang=='zh':
        for text in fig.findobj(matplotlib.text.Text):
            text.set_fontproperties(FontProperties(fname='C:/Windows/Fonts/msyh.ttc',size=text.get_fontsize()))
    fig.savefig(ROOT/'articles'/path,dpi=110,bbox_inches=None);plt.close(fig)
def values(ax,bars):
    for b in bars:ax.text(b.get_x()+b.get_width()/2,b.get_height()+.08,str(int(b.get_height())),ha='center',va='bottom',fontsize=22,fontweight='bold')
oh=json.loads((ROOT/'runs/openhands-1.json').read_text())['rows']
ag=json.loads((ROOT/'runs/ag2-1.json').read_text())['rows']
oc=json.loads((ROOT/'runs/orca-1.json').read_text())['rows']
for lang in ['zh','en']:
    fig,ax=plt.subplots(figsize=(11,7));fig.subplots_adjust(left=.09,right=.97,bottom=.23,top=.68)
    fig.text(.07,.91,'文件端变少，不等于接收方少拿到秘密' if lang=='zh' else 'Fewer files can mean another delivery route',fontsize=24,fontweight='bold')
    fig.text(.07,.84,'四类合成凭证 · 原代码接缝 + 真实接收子进程' if lang=='zh' else 'Four synthetic blobs · source seam + real receiving child',fontsize=16)
    selected=[oh[i] for i in [0,3,1,4]];x=list(range(4));w=.34
    b1=ax.bar([i-w/2 for i in x],[len(r['file_materialization_callbacks']) for r in selected],w,color=violet,label='文件物化回调' if lang=='zh' else 'File callbacks')
    b2=ax.bar([i+w/2 for i in x],[r['child_visible_blob_count'] for r in selected],w,color=cobalt,label='子进程 blob 变量' if lang=='zh' else 'Child blob variables');values(ax,b1);values(ax,b2)
    ax.set_xticks(x,['Claude\n修复前','Claude\n候选修复','Codex\n修复前','Codex\n候选修复'] if lang=='zh' else ['Claude\nBase','Claude\nHead','Codex\nBase','Codex\nHead']);ax.set_ylim(0,5);ax.set_yticks([0,1,2,3,4]);ax.set_ylabel('数量' if lang=='zh' else 'Count');ax.legend(loc='upper left',bbox_to_anchor=(0,1.3),ncol=2,frameon=False,fontsize=17)
    fig.text(.07,.055,'文件写入为夹具回调；没有真实认证或外网传输。' if lang=='zh' else 'File writes are fixture callbacks; no authentication or network disclosure.',fontsize=15)
    finish(fig,f'01-secret-route.figure.{lang}.png',lang)
    fig,ax=plt.subplots(figsize=(11,7));fig.subplots_adjust(left=.09,right=.97,bottom=.19,top=.7)
    fig.text(.07,.91,'每个循环都是 1，总数仍然可以是 2' if lang=='zh' else 'One per loop can still mean two overall',fontsize=24,fontweight='bold')
    fig.text(.07,.84,'同一 Agent · 两个真实线程 / 事件循环 · 配置上限为 1' if lang=='zh' else 'One Agent · two threads / loops · configured cap = 1',fontsize=16)
    rows=[ag[5],ag[15]];w=.23
    for j,(key,color,label) in enumerate([('A',violet,'循环 A' if lang=='zh' else 'Loop A'),('B',amber,'循环 B' if lang=='zh' else 'Loop B'),('global',cobalt,'合计' if lang=='zh' else 'Aggregate')]):
        ys=[r['global_peak'] if key=='global' else r['per_loop_peak'][key] for r in rows]
        bars=ax.bar([i+(j-1)*w for i in range(2)],ys,w,color=color,label=label);values(ax,bars)
    ax.set_xticks([0,1],['修复前','候选修复'] if lang=='zh' else ['Base','Proposed head']);ax.set_ylim(0,3.9);ax.set_yticks([0,1,2,3]);ax.set_ylabel('在途峰值' if lang=='zh' else 'Peak in flight');ax.legend(loc='upper left',bbox_to_anchor=(0,1.25),ncol=3,frameon=False,fontsize=17)
    fig.text(.07,.055,'等待型合成子任务；不表示模型吞吐量、调用费用或全局服务容量。' if lang=='zh' else 'Synthetic waiting subtasks; not model throughput, cost or service capacity.',fontsize=15)
    finish(fig,f'02-concurrency-domain.figure.{lang}.png',lang)
    fig,axes=plt.subplots(1,2,figsize=(11,7));fig.subplots_adjust(left=.1,right=.96,bottom=.2,top=.7,wspace=.35)
    fig.text(.07,.91,'清理删掉历史，冷却与累计上限一起失效' if lang=='zh' else 'Erasing history defeats both limits',fontsize=24,fontweight='bold')
    fig.text(.07,.84,'终端行存在、界面索引缺失 · 两面板使用不同纵轴' if lang=='zh' else 'Terminal row present, UI entry absent · separate y-scales',fontsize=16)
    for ax,scenario,limit,title in zip(axes,['drift-fast','drift-spaced'],[240,12],['200 次请求 / 间隔 10ms','10 次请求 / 间隔 16s'] if lang=='zh' else ['200 requests / 10ms gaps','10 requests / 16s gaps']):
        ys=[next(r['remounts'] for r in oc if r['phase']==p and r['scenario']==scenario) for p in ['base','head']]
        bars=ax.bar([0,1],ys,.52,color=[amber,cobalt])
        for b in bars:ax.text(b.get_x()+b.get_width()/2,b.get_height()+limit*.025,str(int(b.get_height())),ha='center',va='bottom',fontsize=25,fontweight='bold')
        ax.set_title(title,fontsize=18,pad=18);ax.set_xticks([0,1],['修复前','候选修复'] if lang=='zh' else ['Base','Head']);ax.set_ylim(0,limit);ax.set_ylabel('恢复数' if lang=='zh' else 'Remounts')
    fig.text(.07,.055,'原模块 + 内存 store / 可控时钟；不是 Electron 崩溃复现。' if lang=='zh' else 'Original modules + fixture store / clock; not an Electron crash reproduction.',fontsize=15)
    finish(fig,f'03-recovery-budget.figure.{lang}.png',lang)
print('Generated six bilingual figures from saved observations.')
