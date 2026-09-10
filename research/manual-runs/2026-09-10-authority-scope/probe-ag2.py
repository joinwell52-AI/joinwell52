"""Pinned upstream admission method; synthetic subtask, two real OS threads/loops."""
import asyncio, hashlib, json, pathlib, re, sys, textwrap, threading, weakref
from types import SimpleNamespace
ROOT=pathlib.Path(__file__).parent
def method(phase):
    path=ROOT/f'sources/code/ag2-3243/{phase}/ag2/agent.py'
    raw=path.read_text(encoding='utf-8')
    match=re.search(r'^    async def _spawn_subtask\(.*?(?=^    (?:async )?def |^    @|\Z)',raw,re.M|re.S)
    source=textwrap.dedent(match.group())
    ns={'asyncio':asyncio}
    exec('from __future__ import annotations\n'+source,ns)
    return ns['_spawn_subtask'],hashlib.sha256(path.read_bytes()).hexdigest()
def trial(phase,dual=True):
    fn,digest=method(phase)
    obj=SimpleNamespace(_task_config=SimpleNamespace(max_concurrency=1))
    if phase=='head': obj._task_slots=weakref.WeakKeyDictionary();obj._task_slots_lock=threading.Lock()
    else: obj._task_slots=None;obj._task_slots_loop=None
    lock=threading.Lock();a=threading.Event();b=threading.Event();release=threading.Event()
    active={'A':0,'B':0};peaks={'A':0,'B':0};total=[0,0];errors=[];completed=[]
    async def run(task,ctx,tc):
        lane=task[0]
        with lock:
            active[lane]+=1;peaks[lane]=max(peaks[lane],active[lane]);total[0]+=1;total[1]=max(total)
        if task=='A1': a.set()
        if task=='B1': b.set()
        while not release.is_set(): await asyncio.sleep(.001)
        with lock: active[lane]-=1;total[0]-=1;completed.append(task)
        return task
    obj._run_subtask=run
    async def lane_a():
        one=asyncio.create_task(fn(obj,'A1',None))
        while not a.is_set(): await asyncio.sleep(.001)
        if dual:
            while not b.is_set(): await asyncio.sleep(.001)
        two=asyncio.create_task(fn(obj,'A2',None))
        await asyncio.sleep(.03)
        release.set();await asyncio.gather(one,two)
    async def lane_b():
        while not a.is_set(): await asyncio.sleep(.001)
        await fn(obj,'B1',None)
    def worker(coro):
        try: asyncio.run(coro())
        except BaseException as e: errors.append(repr(e));release.set();a.set();b.set()
    threads=[threading.Thread(target=worker,args=(lane_a,))]
    if dual: threads.append(threading.Thread(target=worker,args=(lane_b,)))
    for t in threads:t.start()
    for t in threads:t.join(5)
    assert not any(t.is_alive() for t in threads),'worker timeout'
    assert not errors,errors
    expected=3 if dual and phase=='base' else 2 if dual else 1
    assert total[1]==expected,(phase,dual,peaks,total)
    assert peaks['A']==(2 if dual and phase=='base' else 1)
    return {'phase':phase,'loops':2 if dual else 1,'configured_cap':1,'per_loop_peak':peaks,'global_peak':total[1],'completed':sorted(completed),'errors':errors,'source_sha256':digest}
rows=[trial(p,d) for p in ['base','head'] for d in [False,True] for _ in range(5)]
result={'kind':'extracted-original-method; fixture initialization and synthetic subtask; real threads and loops; no model','python':sys.version,'harness_sha256':hashlib.sha256(pathlib.Path(__file__).read_bytes()).hexdigest(),'rows':rows}
(ROOT/'runs').mkdir(exist_ok=True)
round=sys.argv[1] if len(sys.argv)>1 else '1'
(ROOT/f'runs/ag2-{round}.json').write_text(json.dumps(result,indent=2)+'\n',encoding='utf-8')
print(json.dumps({'round':round,'trials':len(rows),'representative':[rows[i] for i in [0,5,10,15]]},indent=2))
