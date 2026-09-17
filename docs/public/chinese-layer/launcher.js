const CHINESE_LAYER_VERSION='0.6.0';
const INSTALLED_APPS_KEY='cl-installed-apps-v1';
const APP_CATALOG={
  dev:{id:'dev',name:'DEV',subtitle:'开发者社区',description:'英文技术文章自动中文浏览',badge:'已接入',ready:true,mark:'DEV'},
  mail:{id:'mail',name:'Mail',subtitle:'Gmail 收件箱',description:'实时读取 Gmail，并以中文浏览邮件',badge:'Gmail 已接入',ready:true,mark:'✉'}
};

const launcherState={mode:'mine',installed:loadInstalledApps()};

function loadInstalledApps(){
  try{
    const value=JSON.parse(localStorage.getItem(INSTALLED_APPS_KEY)||'null');
    if(Array.isArray(value)&&value.length)return [...new Set(value.filter(id=>APP_CATALOG[id]))];
  }catch{}
  return ['dev'];
}
function saveInstalledApps(){localStorage.setItem(INSTALLED_APPS_KEY,JSON.stringify(launcherState.installed))}
function launcherEsc(value=''){return String(value).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}

function renderInstalledApps(){
  const root=document.querySelector('#installedApps');
  if(!root)return;
  if(!launcherState.installed.length){
    root.innerHTML='<div class="launcher-empty"><strong>还没有加入 App</strong><span>点“添加 App”，选择后就会留在这里。</span></div>';
    return;
  }
  root.innerHTML=launcherState.installed.map(id=>{
    const app=APP_CATALOG[id];
    return `<article class="app-card">
      <div class="app-card-icon ${app.id==='dev'?'app-card-icon-dev':''}">${launcherEsc(app.mark)}</div>
      <div class="app-card-copy">
        <div class="app-card-title-row"><h2>${launcherEsc(app.name)}</h2><span class="app-status">${launcherEsc(app.badge)}</span></div>
        <div class="app-card-subtitle">${launcherEsc(app.subtitle)}</div>
        <p>${launcherEsc(app.description)}</p>
      </div>
      <div class="app-card-actions">
        <button class="primary-btn browse-app" data-app="${app.id}">中文浏览</button>
        <button class="ghost-btn remove-app" data-app="${app.id}">移除</button>
      </div>
    </article>`;
  }).join('');
  root.querySelectorAll('.browse-app').forEach(btn=>btn.addEventListener('click',()=>openApp(btn.dataset.app)));
  root.querySelectorAll('.remove-app').forEach(btn=>btn.addEventListener('click',()=>removeApp(btn.dataset.app)));
}

function renderCatalog(){
  const root=document.querySelector('#catalogApps');
  if(!root)return;
  root.innerHTML=Object.values(APP_CATALOG).map(app=>{
    const installed=launcherState.installed.includes(app.id);
    return `<article class="catalog-card">
      <div class="app-card-icon ${app.id==='dev'?'app-card-icon-dev':''}">${launcherEsc(app.mark)}</div>
      <div class="catalog-copy"><h2>${launcherEsc(app.name)}</h2><div>${launcherEsc(app.subtitle)}</div><p>${launcherEsc(app.description)}</p></div>
      <button class="${installed?'ghost-btn':'primary-btn'} catalog-add" data-app="${app.id}" ${installed?'disabled':''}>${installed?'已加入':'＋ 加入'}</button>
    </article>`;
  }).join('');
  root.querySelectorAll('.catalog-add:not([disabled])').forEach(btn=>btn.addEventListener('click',()=>addApp(btn.dataset.app)));
}

function addApp(id){if(!APP_CATALOG[id]||launcherState.installed.includes(id))return;launcherState.installed.push(id);saveInstalledApps();renderCatalog();renderInstalledApps()}
function removeApp(id){launcherState.installed=launcherState.installed.filter(x=>x!==id);saveInstalledApps();renderInstalledApps();renderCatalog()}

function showLauncher(mode='mine'){
  launcherState.mode=mode;
  document.querySelector('#launcherShell')?.classList.remove('hidden');
  document.querySelector('#devShell')?.classList.add('hidden');
  document.querySelector('#mailShell')?.classList.add('hidden');
  document.querySelector('#launcherMine')?.classList.toggle('hidden',mode!=='mine');
  document.querySelector('#launcherCatalog')?.classList.toggle('hidden',mode!=='catalog');
  renderInstalledApps();renderCatalog();window.scrollTo(0,0);
}

function openApp(id){
  if(id==='dev'){
    document.querySelector('#launcherShell')?.classList.add('hidden');
    document.querySelector('#mailShell')?.classList.add('hidden');
    document.querySelector('#devShell')?.classList.remove('hidden');
    if(typeof loadArticles==='function')loadArticles();
    window.scrollTo(0,0);return;
  }
  if(id==='mail'){
    document.querySelector('#launcherShell')?.classList.add('hidden');
    document.querySelector('#devShell')?.classList.add('hidden');
    document.querySelector('#mailShell')?.classList.remove('hidden');
    if(typeof loadMailApp==='function')loadMailApp();
    window.scrollTo(0,0);
  }
}

function bootLauncher(){
  const version=document.querySelector('#launcherVersion');if(version)version.textContent=`v${CHINESE_LAYER_VERSION}`;
  document.querySelector('#openCatalog')?.addEventListener('click',()=>showLauncher('catalog'));
  document.querySelector('#catalogBack')?.addEventListener('click',()=>showLauncher('mine'));
  document.querySelector('#devBackApps')?.addEventListener('click',()=>showLauncher('mine'));
  document.querySelector('#mailBackApps')?.addEventListener('click',()=>showLauncher('mine'));
  showLauncher('mine');
}

document.addEventListener('DOMContentLoaded',bootLauncher);
