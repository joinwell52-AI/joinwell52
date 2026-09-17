const HOTFIX_VERSION=APP_VERSION;

function hotfixOpenMail(){
  document.querySelector('#launcherShell')?.classList.add('hidden');
  document.querySelector('#devShell')?.classList.add('hidden');
  document.querySelector('#mailShell')?.classList.remove('hidden');
  if(typeof window.loadMailApp==='function')window.loadMailApp();
  window.scrollTo(0,0);
}

document.addEventListener('click',event=>{
  const mailBrowse=event.target.closest?.('.browse-app[data-app="mail"]');
  if(!mailBrowse)return;
  event.preventDefault();
  event.stopImmediatePropagation();
  hotfixOpenMail();
},true);

document.addEventListener('DOMContentLoaded',()=>{
  ['#launcherVersion','#versionBadge','#mailVersion'].forEach(sel=>{
    const el=document.querySelector(sel);if(el)el.textContent=`v${HOTFIX_VERSION}`;
  });
});
