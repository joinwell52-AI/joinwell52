"""Fetch only the explicit public research repositories at pinned commits."""
import pathlib,json,subprocess
ROOT=pathlib.Path(__file__).resolve().parent
sources=json.loads((ROOT/'sources/repositories.json').read_text(encoding='utf-8'))
for source in sources:
    path=ROOT/'upstream'/source['name']
    if not path.exists():
        subprocess.run(['git','-c','core.longpaths=true','clone','--depth','1','https://github.com/'+source['repository']+'.git',str(path)],check=True)
    head=subprocess.check_output(['git','-C',str(path),'rev-parse','HEAD'],text=True).strip()
    if head!=source['sha']:
        dirty=subprocess.check_output(['git','-C',str(path),'status','--porcelain'],text=True)
        if dirty: raise RuntimeError('Existing checkout has changes: '+str(path))
        subprocess.run(['git','-C',str(path),'fetch','--depth','1','origin',source['sha']],check=True)
        subprocess.run(['git','-C',str(path),'-c','core.longpaths=true','checkout','--detach',source['sha']],check=True)
    assert subprocess.check_output(['git','-C',str(path),'rev-parse','HEAD'],text=True).strip()==source['sha']
    print(source['repository'],source['sha'])
