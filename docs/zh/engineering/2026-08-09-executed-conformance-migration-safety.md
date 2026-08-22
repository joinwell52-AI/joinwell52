---
title: "迁移安全不能只看输出正确，还要证明 Conformance 真正在每个后端执行"
date: '2026-08-09'
column: open-source-engineering
category: daily
summary: "持久状态迁移可能在结果仍然正确时破坏关键机制，例如把有界增量回放退化成每次从根历史重放。治理迁移需要读端兼容所有受支持的历史表示，并把跨后端 Conformance 的实际执行情况作为 CI 事实，而不是把测试文件存在等同于覆盖。"
item_id: Q-20260809-03
source_research_object: "research/analysis/Q-20260809-03-executed-conformance-migration-safety.md"
source_reading_result: "research/reading/Q-20260809-03-checkpoint-conformance-migration.md"
lifecycle: Published
evidence_status: Completed
citation_status: Completed
editing_status: Completed
publication_authorized: true
outline: deep
cover: "/assets/covers/daily-2026-08-09-executed-conformance-migration-safety-cover-v2.jpg"
---

<ArticleCover
  image="/assets/covers/daily-2026-08-09-executed-conformance-migration-safety-cover-v2.jpg"
  kicker="开源工程 · 每日研究"
  title="迁移安全不能只看输出正确，还要证明 Conformance 真正在每个后端执行"
  summary="持久状态迁移可能在结果仍然正确时破坏关键机制，例如把有界增量回放退化成每次从根历史重放。治理迁移需要读端兼容所有受支持的历史表示，并把跨后端 Conformance 的实际执行情况作为 CI 事实，而不是把测试文件存在等同于覆盖。"
  version="Q-20260809-03"
  status="Daily Runtime V5 · 2026-08-09"
  languageHref="/en/engineering/2026-08-09-executed-conformance-migration-safety"
  languageLabel="English"
/>
# 迁移安全不能只看输出正确，还要证明 Conformance 真正在每个后端执行

持久化系统最隐蔽的迁移缺陷，不一定表现为错误结果。一个 Reader 即使遗漏了历史状态中的有效 Seed，也可能通过从根节点重放全部写入，最终重建出同样的值。用户看到的输出正确，但原本承诺的有界回放、延迟和存储访问机制已经失效。

## 核心判断

**迁移安全是 Reader 对历史表示的兼容契约，也是 Conformance 在真实后端上的执行事实。**

只修新 Writer 不能修复已经落盘的旧数据；只检查测试文件存在，也不能证明相关 Backend 真正运行过测试。若一个架构机制承诺有界回放或固定查询复杂度，这些性能性质本身就是可验证的正确性条件。

本文唯一分析输入是 `Q-20260809-03` Research Object。Production 未对数据库实现进行新的独立 Benchmark。

## 来源

本文基于 [Research Object — Executed Conformance for Migration Safety](https://github.com/joinwell52-AI/joinwell52/blob/main/research/analysis/Q-20260809-03-executed-conformance-migration-safety.md)。证据追溯入口是 [Reading Result — Checkpoint Conformance and Persisted-State Migration](https://github.com/joinwell52-AI/joinwell52/blob/main/research/reading/Q-20260809-03-checkpoint-conformance-migration.md)。

Reading Result 记录的具体缺陷发生在持久化 Delta History Seed 查找：历史值可能保存在内联 `channel_values`，也可能保存在 `checkpoint_blobs`。旧逻辑依赖一种 Marker，导致迁移后的 Plain Value Seed 不可见。

## 观察

Seed 未被识别时，系统仍可以从空状态开始回放所有历史写入。对于加法型 Reducer，最终列表可能与正确结果一致，因此普通输出断言无法发现机制退化。

Research Object 保留了以下实现事实：

- 修复后的 Reader 同时检查 Blob 和 Inline 两种存储位置；
- 当 Blob 存在时优先解析 Blob，否则使用 Inline Value；
- Writer-only Marker 修复不会覆盖已经存在的历史 Checkpoint；
- `None` 在该层无法与“没有值”可靠区分，因此不被当作 Seed；
- 直接回归测试覆盖 Plain Value、Snapshot、Version Bump 和 Inline Primitive；
- 所选实现报告 Postgres Conformance 从 6/8 提升到 8/8；
- 通用 Conformance 对部分 Backend 可能因为依赖缺失而静默 Skip。

## 安全层次比较

| 检查层 | 能发现输出错误 | 能发现历史表示不兼容 | 能发现回放复杂度退化 | 能证明每个后端有覆盖 |
|---|---:|---:|---:|---:|
| 结果值单元测试 | 是 | 不一定 | 否 | 否 |
| Backend 本地回归测试 | 是 | 针对已知缺陷 | 可以 | 只覆盖单个后端 |
| 共享 Conformance 文件存在 | 理论上 | 理论上 | 取决于断言 | 否，可能被 Skip |
| 每个 Backend 实际执行 Conformance | 是 | 是 | 可显式编码 | 是 |

表格是 Research Center 基于 Research Object 的测试治理综合。

## 讨论

迁移兼容的责任首先在 Reader。新版本 Writer 只能决定未来数据如何保存，无法改变已经存在的 Plain Value、Blob、Marker 或旧 Schema。只给新写入补 Marker，等于让新数据健康、旧数据继续退化。

第二个问题是测试的“存在”和“执行”不能混同。仓库里有一个 Conformance 文件，不代表 CI 安装了依赖、构造了目标 Backend 并真正执行了全部 Case。`importorskip` 对可选功能很有用，但如果该 Backend 已被列为受治理实现，静默 Skip 就应该被视为缺失覆盖，而不是绿色通过。

第三个问题是性能不总是非功能指标。Delta Channel 的核心设计就是避免每次从根历史回放；一旦读取次数随线程长度线性增长，即使最后值正确，架构契约也已经被破坏。因此 Replay Count、Query Count 或最大扫描页数需要进入测试断言。

## 工程影响

对 CodeFlowMu 和 Research Runtime，Schema 演进应保留一组历史 Fixture：扁平 Result、结构化 Narrative、旧 Metric Name、字符串 Evidence/Artifact 等。每次 Validator 或 Markdown Projection 修改都应在这些 Fixture 上执行，而不是只验证当前 Writer 产生的新格式。

对数字员工的 WorkOrder 存储，迁移记录还应说明 Reader 支持的历史表示范围、修复扫描边界和最坏回放成本。运营者需要知道“值可读”与“读取机制符合设计”是两个不同结论。

## 边界与不确定性

所选具体缺陷是 Postgres 路径问题；Reading Result 明确指出 SQLite 的存储方式不同，并不受同一 Bug 影响。文中的延迟与回放数字来自维护者测试，不是 Research Center 的独立生产 Benchmark。

因此，本文不主张所有 Backend 必须共享完全相同的内部实现，而主张它们必须共享可执行的外部语义和关键不变量。

## 未来工作

下一步应确定哪些 Conformance 属于“不可 Skip”的发布门禁；如何让 CI 明确报告 Not Run 与 Pass；如何把 Replay/Query 复杂度编码成跨后端不变量；以及 Schema Version 如何帮助 Reader 选择历史解析路径。

## 可视化说明

配图展示 Inline 与 Blob 两种历史表示进入 Migration-aware Reader，再由实际执行的 Backend Conformance 验证。底部强调“输出正确”并不等于“迁移不变量安全”。

## 证据与引用

1. [Research Object — Executed Conformance for Migration Safety](https://github.com/joinwell52-AI/joinwell52/blob/main/research/analysis/Q-20260809-03-executed-conformance-migration-safety.md)：本文唯一分析输入。
2. [Reading Result — Checkpoint Conformance and Persisted-State Migration](https://github.com/joinwell52-AI/joinwell52/blob/main/research/reading/Q-20260809-03-checkpoint-conformance-migration.md)：实现事实、测试结果、限制与未决问题的追溯入口。
