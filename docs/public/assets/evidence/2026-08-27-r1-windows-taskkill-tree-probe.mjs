import { spawn, spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const selfPath = fileURLToPath(import.meta.url);

function alive(pid) {
  if (!Number.isInteger(pid) || pid <= 0) return false;
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

if (process.argv[2] === "--child") {
  setInterval(() => {}, 60_000);
} else if (process.argv[2] === "--wrapper") {
  const pidFile = process.argv[3];
  const child = spawn(process.execPath, [selfPath, "--child"], {
    stdio: "ignore",
    windowsHide: true,
  });
  writeFileSync(pidFile, JSON.stringify({ wrapper_pid: process.pid, child_pid: child.pid }), "utf8");
  setInterval(() => {}, 60_000);
} else {
  if (process.platform !== "win32") {
    console.error("R1 probe requires Windows because it exercises taskkill /T /F.");
    process.exit(2);
  }

  const root = mkdtempSync(join(tmpdir(), "joinwell52-r1-taskkill-"));
  const pidFile = join(root, "pids.json");
  let wrapper;
  let pids;

  try {
    wrapper = spawn(process.execPath, [selfPath, "--wrapper", pidFile], {
      stdio: "ignore",
      windowsHide: true,
    });

    const deadline = Date.now() + 3_000;
    while (Date.now() < deadline) {
      try {
        pids = JSON.parse(readFileSync(pidFile, "utf8"));
        if (alive(pids.wrapper_pid) && alive(pids.child_pid)) break;
      } catch {}
      await sleep(50);
    }

    const precondition = Boolean(pids && alive(pids.wrapper_pid) && alive(pids.child_pid));
    if (!precondition) {
      console.log(JSON.stringify({
        status: "FAIL",
        scope: "windows_taskkill_tree_probe_only",
        reason: "precondition_not_observed",
      }));
      process.exitCode = 1;
    } else {
      const termination = spawnSync(
        "taskkill",
        ["/PID", String(pids.wrapper_pid), "/T", "/F"],
        { windowsHide: true, encoding: "utf8" },
      );

      const observeDeadline = Date.now() + 3_000;
      while (Date.now() < observeDeadline) {
        if (!alive(pids.wrapper_pid) && !alive(pids.child_pid)) break;
        await sleep(50);
      }

      const wrapperExitObserved = !alive(pids.wrapper_pid);
      const childExitObserved = !alive(pids.child_pid);
      const exitCode = termination.status;
      const pass = exitCode === 0 && wrapperExitObserved && childExitObserved;

      console.log(JSON.stringify({
        status: pass ? "PASS" : "FAIL",
        scope: "windows_taskkill_tree_probe_only",
        precondition_wrapper_and_child_observed: true,
        wrapper_exit_observed: wrapperExitObserved,
        child_exit_observed: childExitObserved,
        termination_exit_code: exitCode,
        kernel_containment_proven: false,
      }));
      if (!pass) process.exitCode = 1;
    }
  } finally {
    if (pids?.wrapper_pid && alive(pids.wrapper_pid)) {
      spawnSync("taskkill", ["/PID", String(pids.wrapper_pid), "/T", "/F"], {
        windowsHide: true,
        stdio: "ignore",
      });
    } else if (wrapper?.pid && alive(wrapper.pid)) {
      spawnSync("taskkill", ["/PID", String(wrapper.pid), "/T", "/F"], {
        windowsHide: true,
        stdio: "ignore",
      });
    }
    rmSync(root, { recursive: true, force: true });
  }
}
