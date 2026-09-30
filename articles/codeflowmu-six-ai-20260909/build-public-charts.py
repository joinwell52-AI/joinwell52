from pathlib import Path
import csv
ROOT=Path(__file__).parent
# Numeric charts use Matplotlib and the same CSV inputs as the Chinese article.
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from matplotlib.ticker import MultipleLocator
plt.rcParams.update({'font.family':'DejaVu Sans','font.size':11,'svg.fonttype':'none','axes.spines.top':False,'axes.spines.right':False,'axes.edgecolor':'#cddce7','axes.labelcolor':'#344d62','text.color':'#152b41','xtick.color':'#53677d','ytick.color':'#53677d','figure.facecolor':'#f7f9fb','axes.facecolor':'#f7f9fb'})
rows=list(csv.DictReader((ROOT/'scorecard.csv').open(encoding='utf-8-sig')))
times=list(csv.DictReader((ROOT/'timing.csv').open(encoding='utf-8-sig')))
names={'豆包':'Doubao','千问':'Qwen'}
label=lambda x:names.get(x,x)
def save(fig,name):
    fig.savefig(ROOT/'assets'/name,format='svg',bbox_inches='tight')
    plt.close(fig)
colors=['#087e99','#2454a6','#53859c','#7999ad','#b96618','#bd9068']
fig,ax=plt.subplots(figsize=(11,5.4))
vals=[int(r['score']) for r in rows]
ax.barh([label(r['model']) for r in rows],vals,color=colors,height=.6)
ax.invert_yaxis();ax.set_xlim(0,100);ax.xaxis.set_major_locator(MultipleLocator(20))
ax.set_xlabel('Integrated-run score / 100');ax.set_title('Six AI teams: delivery, quality and control',loc='left',pad=24,fontweight='bold',fontsize=16)
ax.grid(axis='x',alpha=.16);ax.set_axisbelow(True)
for i,v in enumerate(vals):ax.text(v+1,i,str(v),va='center',fontweight='bold')
fig.text(.125,-.015,'One observed run per scheme. Scores are analytical judgments, not pure model capability.',fontsize=10)
save(fig,'en-scores.svg')
fig,ax=plt.subplots(figsize=(11,5.5))
fields=['completion','quality','efficiency','scope','recovery','observability'];maxima=[25,30,15,15,10,5]
matrix=[[int(r[f])/m for f,m in zip(fields,maxima)] for r in rows]
ax.imshow(matrix,cmap='Blues',vmin=0,vmax=1,aspect='auto')
ax.set_xticks(range(6),[f'{f.title()}\n/{m}' for f,m in zip(fields,maxima)])
ax.set_yticks(range(6),[label(r['model']) for r in rows])
for i,r in enumerate(rows):
    for j,f in enumerate(fields):ax.text(j,i,r[f],ha='center',va='center',color='white' if matrix[i][j]>.63 else '#152b41',fontsize=13)
ax.set_title('Where the 100 points come from',loc='left',pad=24,fontweight='bold',fontsize=16)
fig.text(.125,-.015,'Cell color is the share of its dimension maximum; numbers are actual points.',fontsize=10)
save(fig,'en-score-matrix.svg')
fig,ax=plt.subplots(figsize=(11,5.4))
for i,r in enumerate(times):
    ok=r['normal_complete']=='True';v=float(r['seconds'])/60
    ax.barh(i,v,color='#087e99' if ok else '#b96618',height=.6,hatch=None if ok else '//')
    sec=round(float(r['seconds']));ax.text(v+1,i,f'{sec//60}m {sec%60:02d}s'+(' — terminated' if not ok else ''),va='center',fontsize=10)
ax.set_yticks(range(6),[label(r['model']) for r in times]);ax.invert_yaxis();ax.set_xlim(0,163)
ax.set_xlabel('Elapsed minutes to formal delivery or forced termination')
ax.set_title('Longer is not automatically more complete',loc='left',pad=24,fontweight='bold',fontsize=16)
ax.grid(axis='x',alpha=.16);ax.set_axisbelow(True)
fig.text(.125,-.015,'Teal: final PM report submitted. Hatched amber: no complete delivery before termination.',fontsize=10)
save(fig,'en-duration.svg')
bytime={r['model']:r for r in times}
fig,ax=plt.subplots(figsize=(11,5.5))
for r in rows:
    tm=bytime[r['model']];x=float(tm['seconds'])/60;y=int(r['quality']);ok=tm['normal_complete']=='True'
    ax.scatter(x,y,s=115,color='#087e99' if ok else '#b96618',marker='o' if ok else 'X')
    offsets={'Codex':(-14,12),'Cursor':(10,-18),'豆包':(10,0),'DeepSeek':(10,4),'千问':(-42,12),'Kimi':(10,0)}
    ax.annotate(label(r['model']),(x,y),textcoords='offset points',xytext=offsets[r['model']],fontsize=11)
ax.set_xlim(0,135);ax.set_ylim(0,30);ax.set_xlabel('Elapsed minutes');ax.set_ylabel('Result quality / 30')
ax.set_title('Time spent versus evidence-backed result quality',loc='left',pad=24,fontweight='bold',fontsize=16)
ax.grid(alpha=.16)
fig.text(.125,-.015,'Circles: completed. Crosses: terminated. Six observations do not establish a general speed–quality law.',fontsize=10)
save(fig,'en-quality-time.svg')
print('English excerpts, public provenance index and four English charts prepared.')
