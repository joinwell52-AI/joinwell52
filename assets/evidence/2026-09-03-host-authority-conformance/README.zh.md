# Host 验证完整性、执行者身份与企业执行位置：公开证据说明

[English](/en/research/evidence/2026-09-03-host-authority-conformance)

这份材料服务于三篇 2026-09-03 文章。前两篇是固定基线上的受控研究，第三篇是依据官方资料的产品展望。**研究没有实施修复，也不是独立 QA 或发版验收。**

## 基线与方法

CodeFlowMu 是我们开发的本地多 Agent 协作系统。受测产品版本为 **V2.2.6**，提交为 `5c94d8c3b0147b779b17f620b811c6a17cc65288`；环境为 Windows x64、Node v24.16.0。原研究记录中的 before/after 提交一致，工作区状态均为空。文章发布没有改产品代码。

E1 将受控结果注入既有 registry、staging、probe 接缝，但通过真实 `HostAdmissionControlPlaneService.runTests` 与持久化边界。没有启动真实 provider、执行 npm 安装、批准同步、接纳 Host 更新或启动 SDK。fixture 的 Host 标签是 Cursor/Codex，不是这两个产品发生了故障。

E2 通过真实 OperationApproval prepare/approve、受控持久记录和新建服务的 get 路径，结合真实 OS 进程查询及既有 writer-lock 函数。旧记录时间 2000 年是合成条件；没有诱发操作系统真实 PID 复用，也没有重启 Runtime。**外部执行器调用为 0。**

## 主张—观察—限制

| 主张 | 对应数据 | 允许的结论与限制 |
|---|---|---|
| 结果为空仍被标记 VERIFIED | E1，empty，2 Hosts × 2 rounds；progress 为 0/4 | 当前真实服务接收空列表后仍通过，不等于真实 provider 没执行 |
| 不完整、不属于计划或重复的结果也通过 | E1，partial/duplicate/unknown-id，加上 empty，共 16 个反例/32 次观察 | 缺少计划完整性检查；不是线上错误率或权限绕过成功率 |
| 完整、BLOCKED、FAIL、抛异常有正确对照 | E1，full/blocked/failed/throws，共 16 次 | 保留已有保护，不能据此说审批全失效；VERIFIED 后 ADMIN 同步门仍存在 |
| 相同活 PID 不足以确认原执行者 | E2，reused-pid-fixture，两轮均保留 executing，而旧格式写锁识别 stale | 合成旧时间 + 真实 OS 创建时间矛盾；身份失配不证明效果未发生或可重试 |
| 既有回归持续通过 | 7 组 × 2 轮；每轮 41 pass / 0 fail / 0 skip | 不是 82 个独立用例，也不是上述缺口已修复 |
| 企业执行和云端控制可以分离 | S4–S7 的 Cursor 官方文档 | 产品边界及条件性展望；没有部署、成本、恢复成功率或市场对比实验 |

原始数据顺序、状态、结果、轮次、时间及计数均保留。公开投影删除本机路径、临时目录、合成 run/candidate ID、命令和完整日志；进程 token 被去除，但保留创建时间毫秒值，仍可核对时间矛盾。

## 资料下载与只读核对

将下面文件保存到同一目录，然后执行 `node check.mjs`。无需安装依赖，不访问网络，不写文件，不启动产品或 Agent。

- [E1：32 条逐轮观察 JSON](https://joinwell52-ai.github.io/joinwell52/assets/evidence/2026-09-03-host-authority-conformance/observations-e1.json)
- [E2：6 条逐轮观察 JSON](https://joinwell52-ai.github.io/joinwell52/assets/evidence/2026-09-03-host-authority-conformance/observations-e2.json)
- [7 组回归的两轮记录 JSON](https://joinwell52-ai.github.io/joinwell52/assets/evidence/2026-09-03-host-authority-conformance/regressions.json)
- [来源与固定提交 JSON](https://joinwell52-ai.github.io/joinwell52/assets/evidence/2026-09-03-host-authority-conformance/sources.json)
- [脱敏规则与原始文件 SHA-256](https://joinwell52-ai.github.io/joinwell52/assets/evidence/2026-09-03-host-authority-conformance/provenance.json)
- [只读检查器 check.mjs](https://joinwell52-ai.github.io/joinwell52/assets/evidence/2026-09-03-host-authority-conformance/check.mjs)
- [公开文件 SHA-256 清单](https://joinwell52-ai.github.io/joinwell52/assets/evidence/2026-09-03-host-authority-conformance/manifest.json)
- [中文 README](https://joinwell52-ai.github.io/joinwell52/assets/evidence/2026-09-03-host-authority-conformance/README.zh.md) / [English README](https://joinwell52-ai.github.io/joinwell52/assets/evidence/2026-09-03-host-authority-conformance/README.en.md)

预期检查结果：

```text
E1: 32 observations / 16 counterexamples
E2: 6 observations / 0 executor calls
Regression round 1: 41 pass / 0 fail / 0 skip
Regression round 2: 41 pass / 0 fail / 0 skip
```

检查器核对数据组合、对照场景、逐轮数量、状态、时间矛盾与文件摘要。**它不是原实验的公开产品复跑器。** 产品源码和完整内部探针仍受访问限制；公开包不能独立证明受限源码的运行行为。摘要只能检查相对清单的完整性，不证明记录真实、来源可信，也不是签名认证。读者可以检查作者导出的观察是否支持文章数字，但完整产品复现仍需要获授权的相同基线和内部探针。

## 外部来源及其背景

- [OpenHands software-agent-sdk #4834](https://github.com/OpenHands/software-agent-sdk/pull/4834)：OpenHands 的软件开发 Agent SDK。该变更以真实 provider 配置构造、不发起推理的方式检查配置约定；不是 CodeFlowMu 验证计划完整性修复，也不应写成默认 CI 全覆盖。
- [OpenAI Codex #42381](https://github.com/openai/codex/pull/42381) 与 [#42392](https://github.com/openai/codex/pull/42392)：Codex 是 OpenAI 的编程 Agent；两项变更分别提供 Windows 进程身份与 successor readiness/handoff 的外部工程对照，不证明 CodeFlowMu 已具备相同能力。
- [Cursor 发布说明](https://cursor.com/changelog/self-hosted-machines)、[Self-Hosted Machines](https://cursor.com/docs/cloud-agent/self-hosted)、[Team Pools](https://cursor.com/docs/cloud-agent/self-hosted/pool)、[Computer use](https://cursor.com/docs/cloud-agent/self-hosted/computer-use)：Cursor 是 Anysphere 的 AI 编程产品。9 月 2 日更新与截至 9 月 3 日核验文档支持云端 loop、企业 worker、条件性 workspace 恢复和人工接管；不支持“所有数据不出网”或“全部 Agent 已私有化”。

以上网页会继续更新，本文的时点为 2026-09-03；PR 的固定 merge SHA 见 sources.json。本文不转存第三方全文。

## 三篇文章

1. [测试结果是空的，为什么还显示“验证通过”？](/zh/engineering/2026-09-03-empty-test-results-verified)
2. [进程还活着，原来的执行者还在吗？](/zh/engineering/2026-09-03-process-alive-owner-identity)
3. [当 Agent 开进企业内网：Cursor Self-Hosted Machines 改变了什么？](/zh/digital-employee/2026-09-03-cursor-self-hosted-agent-outlook)
