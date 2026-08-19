# 2026-08-19｜CodeFlowMu 专项实验运行记录

记录性质：本轮文章研究的只追加原始运行记录。它不是 CodeFlowMu 完整测试报告，也不替代已发布的 TMPA Implementation Case I1.0。

## 环境与固定身份

- 时区：Asia/Shanghai（UTC+08:00）
- Git commit：`ed5634c718b9e238c44bb70851020c9793546fe6`
- Node.js：`v24.16.0`
- npm：`11.13.0`
- 测试入口：`npx tsx --test ...`
- 工作树在运行前已非 clean；本轮没有修改这些文件：

```text
 M docs/skills/agent-skills.manifest.json
 M templates/default-project/docs/skills/agent-skills.manifest.json
?? skills/release-evidence-gate/
?? templates/default-project/skills/release-evidence-gate/
```

解释：这些既有变更使本轮结果不能被称为“clean checkout 复现”。专项测试文件与被引实现均以当前磁盘内容运行；公开 permalink 固定到上述 commit。文章只使用有限专项结论，并把依赖缺失与契约漂移单独报告。

## R1｜原子写入专项

- cwd：`D:\TMPA\CodeFlowMu-open\packages\codeflowmu-runtime`
- command：`npx tsx --test src/_internal/__tests__/atomic-write.test.ts`
- start：`2026-08-19T10:50:48.5159204+08:00`
- end：`2026-08-19T10:50:51.2768635+08:00`
- exit code：`0`
- 裁决：**PASS，9 tests executed / 9 passed**

```text
✔ TS-AW-1: rename EPERM on first attempt, succeeds on second → atomicWriteJson resolves (71.8743ms)
✔ TS-AW-2: rename always EPERM → atomicWriteJson rejects after maxAttempts (123.623ms)
✔ TS-AW-3: rename ENOENT → atomicWriteJson retries once then rejects (61.0599ms)
✔ TS-AW-4: rename succeeds on first try → exactly 1 rename call (no phantom retry) (5.6848ms)
✔ TS-AW-5: renameWithRetry honors custom maxAttempts/backoffMs (73.6546ms)
✔ TS-AW-6: buildUniqueTmpPath embeds pid and does not use fixed .md.tmp (1.1972ms)
✔ TS-AW-7: atomicWriteFcopMarkdown skipIfExists is noop when md exists (2.5018ms)
✔ TS-AW-8: atomicWriteFcopMarkdown cleans stale tmp siblings after write (8.131ms)
✔ TS-AW-9: cleanupStaleReportTmpsForTarget removes matching tmps only (4.8773ms)
ℹ tests 9
ℹ suites 0
ℹ pass 9
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 522.252
```

不支持范围：不证明目录项掉电持久性、跨挂载点/网络文件系统语义或 exactly-once 业务效果。

## R2｜长任务规划测试入口

- cwd：`D:\TMPA\CodeFlowMu-open\packages\codeflowmu-runtime`
- command：`npx tsx --test src/pm/__tests__/LongHorizonPlanning.test.ts`
- start：`2026-08-19T10:50:48.5151972+08:00`
- end：`2026-08-19T10:50:51.0634994+08:00`
- exit code：`1`
- Node runner 摘要：`tests 1 / fail 1`（测试文件加载单元）
- 领域测试体：**0 executed**；在导入阶段失败
- 证据裁决：**NOT RUN（环境依赖缺失）**，不是产品行为 PASS，也不把它解释为 LongHorizonPlanning 逻辑 FAIL

```text
Error [ERR_MODULE_NOT_FOUND]: Cannot find package 'yaml' imported from
D:\TMPA\CodeFlowMu-open\packages\codeflowmu-runtime\src\pm\ProductDeliveryGovernance.ts
    at Object.getPackageJSONURL (node:internal/modules/package_json_reader:301:9)
    at packageResolve (node:internal/modules/esm/resolve:768:81)
    at moduleResolve (node:internal/modules/esm/resolve:859:18)
    at defaultResolve (node:internal/modules/esm/resolve:992:11)
  code: 'ERR_MODULE_NOT_FOUND'

Node.js v24.16.0
✖ src\pm\__tests__\LongHorizonPlanning.test.ts (294.5829ms)
ℹ tests 1
ℹ suites 0
ℹ pass 0
ℹ fail 1
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 307.9113
```

## R3｜TaskDispatcher two-phase 测试入口

- cwd：`D:\TMPA\CodeFlowMu-open\packages\codeflowmu-runtime`
- command：`npx tsx --test src/scheduler/__tests__/TaskDispatcher.twoPhaseDispatch.test.ts`
- start：`2026-08-19T10:50:48.5514467+08:00`
- end：`2026-08-19T10:50:51.0633796+08:00`
- exit code：`1`
- Node runner 摘要：`tests 1 / fail 1`（测试文件加载单元）
- 领域测试体：**0 executed**；在导入阶段失败
- 证据裁决：**NOT RUN（环境依赖缺失）**，不是 TaskDispatcher 行为 PASS/FAIL

```text
Error [ERR_MODULE_NOT_FOUND]: Cannot find package '@cursor/sdk' imported from
D:\TMPA\CodeFlowMu-open\packages\codeflowmu-runtime\src\registry\AgentSdkAdapter.ts
    at Object.getPackageJSONURL (node:internal/modules/package_json_reader:301:9)
    at packageResolve (node:internal/modules/esm/resolve:768:81)
    at moduleResolve (node:internal/modules/esm/resolve:859:18)
    at defaultResolve (node:internal/modules/esm/resolve:992:11)
  code: 'ERR_MODULE_NOT_FOUND'

Node.js v24.16.0
✖ src\scheduler\__tests__\TaskDispatcher.twoPhaseDispatch.test.ts (275.0657ms)
ℹ tests 1
ℹ suites 0
ℹ pass 0
ℹ fail 1
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 286.4821
```

## R4｜LAN 地址选择专项

- cwd：`D:\TMPA\CodeFlowMu-open\codeflowmu-shell`
- command：`npx tsx --test src/__tests__/lanNetwork.test.ts`
- start：`2026-08-19T10:51:03.7868023+08:00`
- end：`2026-08-19T10:51:06.0252166+08:00`
- exit code：`0`
- 裁决：**PASS，5 tests executed / 5 passed**

```text
✔ isVirtualNetworkInterface flags docker and wsl adapters (0.9861ms)
✔ isDockerLikeIpv4 excludes docker bridge ranges (0.2535ms)
✔ filterReachableLanInterfaces prefers real LAN over docker (1.6604ms)
✔ lanIpv4PreferenceScore orders common home LAN first (0.226ms)
✔ isReachableLanInterface combines name and address heuristics (0.1177ms)
ℹ tests 5
ℹ suites 0
ℹ pass 5
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 153.6139
```

不支持范围：不证明公网/NAT/TLS、Gateway 长稳、弱网或移动端端到端安全。

## R5｜Open Edition Gateway PWA 发布边界

- cwd：`D:\TMPA\CodeFlowMu-open\codeflowmu-shell`
- command：`npx tsx --test src/__tests__/mobile-pwa-gateway-open-boundary.test.ts`
- start：`2026-08-19T10:51:03.7997144+08:00`
- end：`2026-08-19T10:51:06.1359110+08:00`
- exit code：`1`
- 裁决：**FAIL，1 test executed / 1 failed**
- 已观察差异：当前实现错误码为 `PWA_GATEWAY_PUBLISH_AUTHORITY_EXTERNAL`；测试期望 `OPEN_EDITION_GATEWAY_PUBLISH_DISABLED`
- 未裁决：这是已批准的新契约但测试陈旧，还是实现偏离规范；该决定属于维护者/产品权威

```text
✖ Open edition keeps Gateway PWA status read-only (135.8432ms)
ℹ tests 1
ℹ suites 0
ℹ pass 0
ℹ fail 1
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 310.4582

AssertionError [ERR_ASSERTION]: Expected values to be strictly equal:
+ actual - expected

+ 'PWA_GATEWAY_PUBLISH_AUTHORITY_EXTERNAL'
- 'OPEN_EDITION_GATEWAY_PUBLISH_DISABLED'

    at TestContext.<anonymous>
    (D:\TMPA\CodeFlowMu-open\codeflowmu-shell\src\__tests__\mobile-pwa-gateway-open-boundary.test.ts:20:12)
  code: 'ERR_ASSERTION'
  actual: 'PWA_GATEWAY_PUBLISH_AUTHORITY_EXTERNAL'
  expected: 'OPEN_EDITION_GATEWAY_PUBLISH_DISABLED'
  operator: 'strictEqual'
```

静态补充：当前实现还返回非空 `steps`，测试在错误码断言处已提前失败，因而该轮 stdout 未执行到 steps 断言。正文只把它写成静态合同差异，不把未执行的第二个断言写成第二项运行失败。

## 本轮可引用裁决

| 运行 | 退出码 | 执行的领域测试 | 裁决 |
|---|---:|---:|---|
| Atomic write | 0 | 9 | PASS 9/9 |
| LongHorizonPlanning | 1 | 0 | NOT RUN：缺 `yaml`，导入失败 |
| TaskDispatcher two-phase | 1 | 0 | NOT RUN：缺 `@cursor/sdk`，导入失败 |
| LAN address | 0 | 5 | PASS 5/5 |
| PWA publish boundary | 1 | 1 | FAIL 1/1：错误码契约漂移 |
