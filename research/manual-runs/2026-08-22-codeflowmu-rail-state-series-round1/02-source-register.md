# 来源清单

访问日期均为 2026-08-22；S12 于 2026-08-23 复核。

| ID | 来源身份 | URL / 路径 | 支持范围 | 不支持范围 |
|---|---|---|---|---|
| S1 | TMPA 架构论文 A1.0，第一方正式研究 | https://github.com/joinwell52-AI/joinwell52/blob/main/docs/public/releases/tmpa/v1.0/artifacts/tmpa-architecture-paper-a1.0-zh.md | TMPA 的四条运行规则、分层关系、SME-first 定位与证据边界 | 不证明 V1.9.7 具体实现 |
| S2 | TMPA Core Specification S1.0，第一方规范 | https://github.com/joinwell52-AI/joinwell52/blob/main/docs/public/releases/tmpa/v1.0/artifacts/tmpa-core-specification-s1.0-zh.md | 主载体、单写者对象、权限、生命周期、冲突保留、确定性 Reader | 不规定调度器、UI 或操作系统进程 |
| S3 | TMPA Implementation Case I1.0，第一方工程案例 | https://github.com/joinwell52-AI/joinwell52/blob/main/docs/public/releases/tmpa/v1.0/artifacts/tmpa-implementation-case-i1.0-zh.md | V1.8.0 固定 Bundle 的产品 Reader 14/14、71 项强制断言作者运行证据 | 不是 V1.9.7 验证，也不是独立认证 |
| S4 | FCoP v3 当前中文规范，第一方协议 | https://github.com/joinwell52-AI/FCoP/blob/main/spec/fcop-v3-spec.zh.md | 文件、路径、事件、L1 生命周期工具、同挂载点写入后 rename、review 消歧与边界 | 不提供 Agent 执行、调度、沙箱、全局锁或跨主机一致性 |
| S4-en | FCoP 3.0 specification，第一方协议语言变体 | https://github.com/joinwell52-AI/FCoP/blob/main/spec/fcop-3.0-spec.md | 与 S4 相同；用于英文稿术语和边界表述 | 与 S4 相同 |
| S2-en | TMPA Core Specification S1.0，第一方规范英文语言变体 | https://github.com/joinwell52-AI/joinwell52/blob/main/docs/public/releases/tmpa/v1.0/artifacts/tmpa-core-specification-s1.0-en.md | 与 S2 相同；用于英文稿术语和边界表述 | 与 S2 相同 |
| S1-en | TMPA 架构论文 A1.0，第一方正式研究英文语言变体 | https://github.com/joinwell52-AI/joinwell52/blob/main/docs/public/releases/tmpa/v1.0/artifacts/tmpa-architecture-paper-a1.0-en.md | 与 S1 相同；用于英文稿术语和边界表述 | 与 S1 相同 |
| S3-en | TMPA Implementation Case I1.0，第一方工程案例英文语言变体 | https://github.com/joinwell52-AI/joinwell52/blob/main/docs/public/releases/tmpa/v1.0/artifacts/tmpa-implementation-case-i1.0-en.md | 与 S3 相同；用于英文稿术语和边界表述 | 与 S3 相同 |
| S5 | CodeFlowMu V1.9.7 母版源码，第一方私有实现 | `joinwell52-AI/codeflowmu@2c901972`，内部检查见 `01-codeflowmu-v197-source-inspection.md` | 事实内核、轨道辅助合同、命令内核、角色门禁、派工、持久作业 | 公众不能独立访问；不构成公开源码或安全认证 |
| S6 | CodeFlowMu V1.9.7 候选证据包，第一方运行证据 | `V1.9.7-RAIL-ASSISTANCE-RC-20260822-001`，内部检查见 `01-codeflowmu-v197-release-evidence-inspection.md` | 固定测试、构建、版本和实机重启结果 | 不支持跨平台、第三方复现或正式 RELEASED |
| S7 | W3C PROV-O Recommendation，独立标准 | https://www.w3.org/TR/prov-o/ | Entity、Activity、Agent 及来源关系可分开表达的通用背景 | 不验证 TMPA、FCoP 或 CodeFlowMu |
| S8 | NIST AI RMF 1.0，独立官方框架 | https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-ai-rmf-10 | 治理贯穿生命周期、角色责任与人工监督需要明确的通用背景 | 不规定本文的文件状态机或轨道机实现 |
| S9 | POSIX.1-2024 `rename()`，独立正式规范 | https://pubs.opengroup.org/onlinepubs/9799919799/functions/rename.html | `rename()` 的原子目录项语义及错误边界 | 不证明跨挂载点、网络文件系统或完整事务语义 |
| S10 | Microsoft Job Objects，独立平台文档 | https://learn.microsoft.com/en-us/windows/win32/procthread/job-objects | Windows 可把进程组作为单元管理的工程背景 | 不证明 CodeFlowMu 使用了全部 Job Object 能力 |
| S11 | TMPA Core S1.0 公开符合性工件与参考 Reader，第一方公开测试材料 | https://github.com/joinwell52-AI/joinwell52/tree/main/research/conformance/tmpa-core-s1.0 | 已发布 Schema、fixtures、Reference Reader 与 runner 可用于公开的治理语义检查 | 不证明 V1.9.7 私有 Runtime 的轨道机行为或第三方产品符合性 |
| S12 | OWASP AI Agent Security Cheat Sheet，独立安全工程指南 | https://cheatsheetseries.owasp.org/cheatsheets/AI_Agent_Security_Cheat_Sheet.html | Agent 工具调用的显式授权、最小权限与隔离防线的通用安全背景 | 不证明本文的任何私有工具策略已经完备或通过安全认证 |

## 代码披露规则

文章只摘录足以解释公开论点的短接口，并注明“字段节选”或“结构化改写”。不公布大段私有实现，不给公众无法访问的私有 GitHub 链接伪装成公开引用。CodeFlowMu Open 源码不进入本轮来源。
