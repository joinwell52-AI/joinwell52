---
schema: "publication-candidate-article/v1"
title: "Agent 资源平面需要角色感知调度，而不只是平均利用率目标"
date: "2026-08-07"
column: "industry-architecture"
category: "daily"
summary: "生产级 Agent 工作流同时包含控制路径、工具 Runner 和推理服务；平均 CPU/GPU 空闲率不足以指导安全回收，资源策略必须按角色和并发形态调度，并在尾延迟或争用恶化时可逆退出。"
sources:
  - "research/analysis/Q-20260807-02-role-aware-heterogeneous-agent-resource-plane.md"
  - "research/reading/Q-20260807-02-agentic-workflow-server-architecture.md"
item_id: "Q-20260807-02"
lifecycle: "Publication Candidate"
source_research_object: "research/analysis/Q-20260807-02-role-aware-heterogeneous-agent-resource-plane.md"
source_reading_result: "research/reading/Q-20260807-02-agentic-workflow-server-architecture.md"
visualization: "staging/publication-candidates/2026-08-07-role-aware-agent-resource-plane.svg"
visualization_decision: "Required — role-aware heterogeneous resource-plane diagram included; Research Center synthesis based on the cited Research Object"
evidence_status: "Completed"
citation_status: "Completed"
editing_status: "Completed"
publication_authorized: false
---

# Agent 资源平面需要角色感知调度，而不只是平均利用率目标

传统模型服务常把一个请求理解成“进入 GPU、完成推理、返回结果”。生产级 Agent 工作流不是这样。它会在 GPU inference、scheduler/orchestrator 控制逻辑和短促但高强度的工具执行之间反复切换，而这些角色对延迟、并发、资源争用和隔离的要求并不相同。

同日完成的 Research Object 因此提出一个更适合生产 Agent 平台的判断：**资源平面应该调度工作流角色和执行形态，而不只是追求 CPU/GPU 的平均利用率。**

## 核心判断

平均空闲不是可回收容量的充分证据。

一个系统可以同时表现为“平均 CPU/GPU 利用率不高”和“关键路径在 burst 时刻已经饱和”。如果调度器只看到平均 idle percentage，就可能在最不应该回收的时候收走 runner CPU 或 GPU capacity，把一次效率优化变成尾延迟崩塌。

因此，生产 Agent 的资源控制需要四个条件同时成立：角色分类、并发/突发形态、未来工作可见性，以及可逆 retreat policy。效率门禁还必须与 tenant、credential、sandbox 和业务优先级等 trust policy 分开。

## 来源

本文只消费 `Q-20260807-02` 的 Production-authorized Research Object。Production 没有从 Signal Pool 或 Reading Result 重新研究，也没有加入新的外部材料。Reading Result 仅作为 Research Object 已声明的证据边界和来源追溯入口。

## 观察

Research Object 保留了几个对架构决策非常重要的负向运行点。

第一，control/scheduler 与 runner 的资源特征不同。控制路径需要稳定、低尾延迟的 CPU 保障；runner 则具有明显的 burst 和 locality 特征。因此，控制池与 runner capacity 不应被一个统一回收规则处理。

第二，GPU consolidation 并不是“越激进越好”。来源机制在一种工作负载上能从 consolidation/harvesting 获益，但在高负载并行 CORAL 场景中，激进 GPU removal 会显著恶化表现。这个反例说明，同一个平均利用率信号可能对应完全不同的安全 operating point。

第三，CPU isolation 也不是单调收益。完全私有的 task cores 虽然隔离更强，却会损失一部分可利用 slack，Research Object 明确保留了“最大隔离并非最优”的结果。

第四，host-visible graph/tool hints 能让资源控制更主动，但 model-orchestrated 工作流在推理结束前并不知道下一步 tool 或 branch，因此需要更保守的 reactive policy。

## 比较

| 运行角色 | 主要目标 | 典型资源形态 | 可以激进回收吗 | 失败信号 |
|---|---|---|---|---|
| Control / Orchestrator | 稳定决策与低尾延迟 | 持续 CPU、关键路径敏感 | 不宜；优先隔离 | 调度延迟、上下文切换、控制阻塞 |
| Tool Runner | 吞吐与 burst 响应 | 短促 CPU/IO 峰值、并发变化大 | 可以有界回收 | queue 增长、runner contention、尾延迟上升 |
| Inference service | GPU throughput 与 latency | GPU residency、批处理和并发相关 | 依工作负载而定 | GPU contention、batch tail 恶化 |
| Trust / Business gate | 安全与业务边界 | 不是算力池 | 不属于效率回收 | tenant、credential、sandbox、priority 冲突 |

前三行来自 Research Object 对资源角色的分析；最后一行强调一个独立的工程边界：计算上高效的 collocation 不等于治理上允许的 collocation。

## 讨论

真正的变化不是“把利用率拉高”，而是把资源控制从 model-serving unit 提升到 workflow-role unit。

控制路径、工具执行和推理服务需要不同 SLO。调度器应知道哪些工作对 latency 最敏感、哪些 runner 容量可以暂时让渡、哪些 GPU workload 可以 consolidation，以及什么时候必须撤退。一个安全的 reclaim controller 必须持续观察 workload phase、并发、role overlap 和 tail latency，而不是发布一次静态 packing 结果后长期不变。

这也意味着负向 operating point 应成为策略的一等输入。CORAL-like 争用不是“优化效果不好”这么简单，而是提醒系统：当前回收策略已经跨过安全边界。retreat reason 应被显式记录，后续调度应能解释为什么停止 harvesting。

对于 model-driven orchestration，未来 tool mix 不可见，资源调度更不能假装拥有完整 DAG。此时需要以最近观测、角色标签和保守边界做 reactive control，而不是套用 host-visible graph 场景的提前规划能力。

## 工程影响

对企业 Agent 平台，建议最先分离三个资源类：control plane cores、tool-runner capacity 与 inference capacity。每个执行单元应暴露 role class、latency sensitivity、tool-burst profile、concurrency shape 和 trust/credential boundary，而不是只上报一个进程级 CPU/GPU average。

对于中小企业，未必需要复制大型云的 server design 或优化器。更实际的路径是先隔离 PM/QA/控制路径，再对 worker/tool capacity 做有界、可逆的回收；只在收集到少量可重复 workload signatures 后再开放 adaptive consolidation。

对 CodeFlowMu，PM/QA 和关键控制服务应优先与 opportunistic worker capacity 分离。Runtime telemetry 应分别标记 control、inference、tool-runner 时间，并记录回收阈值触发、retreat reason 和恢复时间。任何跨 sandbox、credential 或 tenant 的资源合并都必须先过 trust gate，不能因为 profiler 发现“还有空闲”就自动 collocate。

## 边界与反证

Research Object 的置信边界非常明确：生产 trace 只覆盖一个报告的 24 小时窗口；controlled study 使用一套披露的 CPU/GPU 服务器和四个框架；10.3-core control demand、pool width 和 harvesting threshold 都是经验 operating point，而不是通用常数。

更重要的是，这些证据衡量的是基础设施行为，不证明 Agent 输出质量、治理正确性、安全隔离或业务成功。即使资源调度让 throughput 更好，也不能推导出 trust boundary 可以放松。

## 未来工作

下一步需要回答四个工程问题：最小 telemetry 如何可靠区分 control、runner 与 inference phase；哪个在线信号能在 tail latency 崩塌前识别 CORAL-like 争用；tenant/credential/business priority 如何约束本来计算上高效的 collocation；以及在模型决定下一步 tool 的情况下，什么 reactive policy 能避免过度保守又不跨过负向 operating point。

## 可视化说明

配图将资源平面分成 Role Classifier、Control Pool、Runner Pool、Inference Pool、Adaptive Reclaim Loop 与独立 Trust Gate。retreat arrow 表达策略可逆，不表达任何来源未支持的固定阈值或收益百分比。

## 证据与引用

1. [Research Object — Role-Aware Heterogeneous Agent Resource Plane](https://github.com/joinwell52-AI/joinwell52/blob/main/research/analysis/Q-20260807-02-role-aware-heterogeneous-agent-resource-plane.md)：本文唯一分析输入，包含负向 operating point、不确定性、反证和工程影响。
2. [Reading Result — Agentic workflow server architecture](https://github.com/joinwell52-AI/joinwell52/blob/main/research/reading/Q-20260807-02-agentic-workflow-server-architecture.md)：Research Object 声明的证据边界与来源追溯记录；Production 未从该文件重新开展分析。

> 编辑状态：已完成双语结构对齐，保留 CORAL GPU harvesting 的有害运行点、CPU isolation 非单调结果、host-visible/model-driven 差异以及效率与信任策略分离；尚未发布。
