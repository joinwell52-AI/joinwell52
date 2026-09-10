import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {stripTypeScriptTypes} from 'node:module';
import {spawn} from 'node:child_process';
import {once} from 'node:events';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
const root=new URL('./',import.meta.url),file=new URL('sources/code/paperclip-13119/head/packages/adapter-utils/src/acpx-engine/local-process-control.ts',root);
const raw=await readFile(file,'utf8'),mod=await import('data:text/javascript;base64,'+Buffer.from(stripTypeScriptTypes(raw,{mode:'transform'})).toString('base64'));
const child=spawn(process.execPath,['-e','setTimeout(()=>{},30000)'],{windowsHide:true,stdio:'ignore'});
try{
 await once(child,'spawn');const captured=mod.captureLocalProcess(child.pid);
 assert.equal(captured,child);assert.equal(mod.capturedProcessExited(captured),false);
 const exit=once(child,'exit');const killRequested=mod.killCapturedLocalProcess(captured);assert.equal(killRequested,true);
 const immediatelyExited=mod.capturedProcessExited(captured);await exit;
 const afterExit=mod.capturedProcessExited(captured);assert.equal(afterExit,true);
 assert.equal(mod.killCapturedLocalProcess(captured),false);assert.equal(mod.captureLocalProcess(child.pid),undefined);
 assert.equal(mod.capturedProcessExited(undefined),false);assert.equal(mod.killCapturedLocalProcess(undefined),false);
 const result={at:new Date().toISOString(),node:process.version,kind:'full upstream process-control module; real harmless Node child; no ACP provider, tools, descendants or continuation',source_sha256:createHash('sha256').update(raw).digest('hex'),observations:{captured_same_handle:true,alive_before_kill:true,kill_requested:killRequested,immediate_exit_evidence:immediatelyExited,exit_evidence_after_event:afterExit,repeated_kill:false,removed_from_capture_map:true,unknown_handle_is_exit_evidence:false}};
 await mkdir(new URL('runs/',root),{recursive:true});await writeFile(new URL(`runs/paperclip-${process.argv[2]??'1'}.json`,root),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result,null,2));
}finally{if(child.exitCode===null&&child.signalCode===null)child.kill('SIGKILL');}
