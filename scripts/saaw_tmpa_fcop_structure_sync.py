from pathlib import Path

files = {
    'zh': Path('docs/zh/industry/2026-08-10-saaw-software-as-an-agent-worker.md'),
    'en': Path('docs/en/industry/2026-08-10-saaw-software-as-an-agent-worker.md'),
}

zh = files['zh'].read_text(encoding='utf-8')
en = files['en'].read_text(encoding='utf-8')

# ---- Section 4: formal TMPA definition + four-rule road map + SME-first boundary ----
zh_old = '''## 4. TMPA：让工作事实脱离 Agent 而存在

TMPA，全称 **Textual Multi-Agent Process Architecture**。

它试图解决的核心问题非常简单：

**当多个 Agent 和人类共同完成一个长期工作时，真正可信的工作状态到底存在于哪里？**

传统 Agent 系统很容易把状态放进模型上下文、运行时内存、数据库内部状态、消息代理、中央调度器，或者一个不断增长的会话。
'''
zh_new = '''## 4. TMPA：让工作事实脱离 Agent 而存在

TMPA 试图解决的核心问题非常简单：

**当多个 Agent 和人类共同完成一个长期工作时，真正可信的工作状态到底存在于哪里？**

这是 TMPA 给出的形式化回答：

> **TMPA（Textual Multi-Agent Process Architecture，文本化多智能体流程架构）**：一种面向中小企业、最低基础设施条件的**文本消息多智能体异步流程架构**。其核心由四条相互关联的规则构成：**文本承载持久消息与状态；每个写者保持自己的局部串行流；多条串行流异步推进并形成并行协作；读端聚合现有证据，重建流程、责任、生命周期、冲突与审计状态。**

**以下第 4—7 节逐条展开这四条规则：第 4 节讨论文本承载持久消息与状态；第 5 节讨论单写者的局部串行流；第 6 节讨论多条串行流的异步并行协作；第 7 节讨论读端重建与问题集（Issue Set）。**

TMPA 的设计目标是尽可能降低治理架构对专用基础设施的依赖，但这并不意味着它只能用于小规模系统。它的定位是 **SME-first，而非 SME-only**：规模更大的实现可以使用数据库、对象存储、事件服务、身份系统和控制平面，同时保留相同的工作事实、责任、引用、生命周期和治理语义。

传统 Agent 系统很容易把状态放进模型上下文、运行时内存、数据库内部状态、消息代理、中央调度器，或者一个不断增长的会话。
'''
if zh_old not in zh:
    raise SystemExit('ZH section 4 anchor not found')
zh = zh.replace(zh_old, zh_new, 1)

zh_old7 = '''TMPA 的目标不是让这些问题消失，而是：

**让问题成为正式事实。**

Reader 因此不仅重构流程图，还需要重构**问题集（Issue Set）**，例如：
'''
zh_new7 = '''TMPA 的目标不是让这些问题消失，而是：

**让问题成为正式事实。**

这里的关键不只是“列出错误”，而是**读端重建**。Reader 聚合当前可用证据，重建流程、责任、生命周期、冲突与审计状态；**问题集（Issue Set）**是其中对冲突、缺口和非法状态的正式表达。

因此，Reader 不仅重构流程图，还需要重构问题集，例如：
'''
if zh_old7 not in zh:
    raise SystemExit('ZH section 7 anchor not found')
zh = zh.replace(zh_old7, zh_new7, 1)

en_old = '''## 4. TMPA: Work facts must exist independently of the Agent

TMPA stands for **Textual Multi-Agent Process Architecture**.

TMPA asks a simple question: when Agents and humans jointly perform long-running work, where should trustworthy work state live?
'''
# tolerate current version with or without duplicate stands-for line
if en_old not in en:
    en_old = '''## 4. TMPA: Work facts must exist independently of the Agent

TMPA stands for **Textual Multi-Agent Process Architecture**.

It asks a simple question: when Agents and humans jointly perform long-running work, where should trustworthy work state live?
'''
en_new = '''## 4. TMPA: Work facts must exist independently of the Agent

TMPA asks a simple question: when Agents and humans jointly perform long-running work, where should trustworthy work state live?

This is TMPA's formal answer:

> **TMPA (Textual Multi-Agent Process Architecture)** is an **asynchronous text-message multi-agent process architecture** designed for SMEs and minimum-infrastructure conditions. Its core consists of four connected rules: **text carries durable messages and state; each writer maintains its own local serial stream; multiple serial streams advance asynchronously to form parallel collaboration; the read side aggregates available evidence to reconstruct process, responsibility, lifecycle, conflicts, and audit state.**

**Sections 4–7 expand these four rules in order: Section 4 covers durable messages and state in text; Section 5 covers local Single-Writer serial streams; Section 6 covers asynchronous parallel collaboration across streams; Section 7 covers read-side reconstruction and the Issue Set.**

TMPA is **SME-first, not SME-only**. Its minimum-infrastructure orientation reduces dependence on dedicated coordination infrastructure, but larger implementations may use databases, object stores, event services, identity systems, and control planes while preserving the same work-fact, responsibility, reference, lifecycle, and governance semantics.
'''
if en_old not in en:
    raise SystemExit('EN section 4 anchor not found')
en = en.replace(en_old, en_new, 1)

en_old7 = '''TMPA does not try to make those problems disappear.

It makes them formal facts.

The Reader therefore reconstructs not only a Process Graph but also an Issue Set, such as:
'''
en_new7 = '''TMPA does not try to make those problems disappear.

It makes them formal facts.

The key is not merely to list errors, but to perform **read-side reconstruction**. The Reader aggregates the currently available evidence to reconstruct process, responsibility, lifecycle, conflicts, and audit state; the **Issue Set** is the formal representation of conflicts, gaps, and illegal states within that reconstruction.

The Reader therefore reconstructs not only a Process Graph but also an Issue Set, such as:
'''
if en_old7 not in en:
    raise SystemExit('EN section 7 anchor not found')
en = en.replace(en_old7, en_new7, 1)

# ---- Swap sections 9 and 10, and replace them with protocol-first wording ----
zh_s9 = zh.index('## 9. CodeFlowMu：TMPA 从理论进入运行世界')
zh_s11 = zh.index('## 11. Agent PC：真正的数字员工需要一台“电脑”')
zh_new_9_10 = '''## 9. FCoP：文件驱动协作协议

**FCoP（File-based Coordination Protocol，文件驱动协作协议）是一种以文件系统为唯一同步原语的多智能体行为治理协议。**

它的核心不变式是 **Filename as Protocol**。在项目可见的文件系统 Profile 中：

- **目录即状态**：`_lifecycle/{inbox,active,review,done,archive}/`；
- **文件名即路由**：发送者、接收者、类型与序号共同表达工作对象的来源、去向与身份；
- **内容即负载**：Markdown 正文与 YAML frontmatter 承载任务、报告、问题、引用和治理事实；
- **`os.rename()` 是唯一同步操作**：生命周期迁移依靠文件系统原子移动，而不是协调数据库、消息 Broker 或中心锁服务。

一个任务的生命周期因此可以直接被观察：

```text
inbox      收件箱 / 待领取
  │
  ▼
active     执行中
  │
  ▼
review     待审查
  │
  ▼
done       已完成
  │
  ▼
archive    已归档
```

FCoP 治理的是 **Agent 的协作行为**：任务如何交接、结果如何报告、问题如何提出、能力边界如何声明，以及这些行为如何留下事件语义、失败边界与可审计证据。

**FCoP 不治理执行运行时。** 调度、进程管理、模型会话、资源分配、身份认证和运行节点管理不属于协议本身的职责。

从 TMPA 的实现关系看，FCoP 是一种**项目可见的文件系统 Profile**。它不强制要求协调数据库、消息 Broker 或企业级控制平面，但也不会单独提供经过验证的企业身份、强角色隔离、防篡改存储或拜占庭容错。这与 TMPA 的 **SME-first，而非 SME-only** 边界一致：更大规模的部署可以增加数据库、对象存储、事件服务、身份系统和控制平面，而不改变协议所承载的治理语义。

更重要的是，**FCoP 协议、适配层、参考实现和运行环境不是同一个东西。** A0.9 中的运行栈可以直接写成：

```text
应用层 / Application Runtime
CodeFlowMu / Cursor / Claude Desktop
                │
                ▼
主机适配层 / Host Adapter Layer
fcop-mcp / fcop-cli / host bridges
                │
                ▼
★ FCoP 协议层 / FCoP Protocol Layer ★
行为治理 / 交接 / 报告 / 审查 / 能力边界
事件语义 / 失败边界 / 可审计性
                │
                ▼
参考实现 / Reference Implementation
fcop（Python library）
                │
                ▼
执行基座 / Execution Substrate
LLM APIs / MCP tools / 文件系统 / 进程管理 / 操作系统
```

因此：

- `fcop` Python Package 是 **FCoP 的参考实现**，不是 FCoP 协议本身；
- `fcop-mcp` 与 `fcop-cli` 位于**主机适配层**，负责把协议能力暴露给实际宿主；
- CodeFlowMu 位于 FCoP 之上的**应用 / 运行层**，使用 FCoP 作为协作协议；
- TMPA 不属于这个运行栈中的某一层，它提供的是这套栈试图实现的上位治理语义与架构指导。

这也解释了为什么“目录即状态”如此重要：系统管理员、人类主管、Agent 和调试工具可以观察同一组项目事实，而不必先进入一个隐藏的中央协调状态。

---

## 10. CodeFlowMu：从协议进入真实运行世界

如果说 TMPA 定义的是工作事实与治理语义，FCoP 提供项目可见的文件驱动协作协议，那么 **CodeFlowMu 解决的是这些语义和协议如何进入真实 Agent 运行世界。**

CodeFlowMu 的工程起点不是构造一个巨大的中央 Agent 运行体。

相反，它试图保持克制：推理交给成熟模型生态，工具交给实际运行环境，而自身集中解决工作编排、Agent 责任边界、生命周期、FCoP 接入、Skill 调用、报告、审查、人类决策、恢复与运行治理。

这形成一个非常重要的工程边界：

**CodeFlowMu 不需要重新发明 LLM，也不重新定义 FCoP。**

模型只是数字员工“大脑”的一部分；FCoP 是其采用的协作协议；真正决定数字员工能不能持续承担工作的是外部工作结构、运行环境和治理闭环。

[![SaaW 治理与运行架构：SaaW、CodeFlowMu、FCoP 与 TMPA](/assets/covers/02-saaw-governance-runtime-stack-fixed-v2.png)](/assets/covers/02-saaw-governance-runtime-stack-fixed-v2.png)

*图 1：SaaW 治理与运行架构。TMPA 提供工作事实与治理架构，FCoP 提供文件驱动协作协议，CodeFlowMu 承担工程运行，SaaW 描述最终的软件交付范式。*

---

'''
zh = zh[:zh_s9] + zh_new_9_10 + zh[zh_s11:]

en_s9 = en.index('## 9. CodeFlowMu: Bringing TMPA into the runtime world')
en_s11 = en.index('## 11. Agent PC: A real digital employee needs a “computer”')
en_new_9_10 = '''## 9. FCoP: File-based Coordination Protocol

**FCoP (File-based Coordination Protocol) is a multi-agent behavioral-governance protocol that uses the filesystem as its only synchronization primitive.**

Its core invariant is **Filename as Protocol**. In its project-visible filesystem profile:

- **directory is state**: `_lifecycle/{inbox,active,review,done,archive}/`;
- **filename is routing**: sender, recipient, type, and sequence identify origin, destination, and work-object identity;
- **content is payload**: Markdown plus YAML frontmatter carries tasks, reports, issues, references, and governance facts;
- **`os.rename()` is the only synchronization operation**: lifecycle transitions rely on atomic filesystem moves rather than a coordination database, message broker, or central lock service.

A task lifecycle is therefore directly observable:

```text
inbox      waiting to be claimed
  │
  ▼
active     in execution
  │
  ▼
review     awaiting review
  │
  ▼
done       completed
  │
  ▼
archive    archived
```

FCoP governs **Agent collaboration behavior**: how tasks are handed off, results are reported, issues are raised, capability boundaries are declared, and those behaviors leave event semantics, failure boundaries, and auditable evidence.

**FCoP does not govern the execution runtime.** Scheduling, process management, model sessions, resource allocation, identity authentication, and runtime-node management are outside the protocol itself.

In the TMPA implementation relationship, FCoP acts as a **project-visible filesystem profile**. It does not require a coordination database, message broker, or enterprise control plane; conversely, it does not by itself provide validated enterprise identity, strong role isolation, tamper-resistant storage, or Byzantine fault tolerance. This is consistent with TMPA being **SME-first, not SME-only**: larger deployments can add databases, object stores, event services, identity systems, and control planes without changing the governance semantics carried by the protocol.

Most importantly, **the FCoP protocol, host adapters, reference implementation, and runtime environment are not the same thing.** The A0.9 operational stack can be represented directly as:

```text
Application / Runtime
CodeFlowMu / Cursor / Claude Desktop
                │
                ▼
Host Adapter Layer
fcop-mcp / fcop-cli / host bridges
                │
                ▼
★ FCoP Protocol Layer ★
behavior governance / handoff / reporting / review
capability boundaries / event semantics / failure boundaries / audit
                │
                ▼
Reference Implementation
fcop Python library
                │
                ▼
Execution Substrate
LLM APIs / MCP tools / filesystem / process manager / operating system
```

Therefore:

- the `fcop` Python package is the **reference implementation of FCoP**, not the FCoP protocol itself;
- `fcop-mcp` and `fcop-cli` sit in the **Host Adapter Layer**, exposing protocol capabilities to actual hosts;
- CodeFlowMu sits above FCoP in the **Application / Runtime layer** and uses FCoP as its coordination protocol;
- TMPA is not a runtime layer in this stack; it supplies the higher-level governance semantics and architectural guidance the stack is intended to realize.

This also explains why “directory is state” matters: administrators, human supervisors, Agents, and debugging tools can inspect the same project-visible facts without first entering a hidden central coordination state.

---

## 10. CodeFlowMu: From protocol to the real runtime world

If TMPA defines work-fact and governance semantics, and FCoP supplies a project-visible file-based coordination protocol, then **CodeFlowMu addresses how those semantics and that protocol enter a real Agent runtime world.**

CodeFlowMu did not begin by constructing a giant central Agent Runtime.

Instead, it remains deliberately restrained: reasoning is delegated to mature model ecosystems, tools remain in real operating environments, and CodeFlowMu concentrates on work orchestration, Agent responsibility boundaries, lifecycle, FCoP integration, Skill invocation, Reports, Reviews, human decisions, recovery, and runtime governance.

This creates an important engineering boundary:

**CodeFlowMu does not need to reinvent the LLM, and it does not redefine FCoP.**

The model is only one part of a digital employee's brain; FCoP is the coordination protocol it uses; what determines whether the digital employee can sustain responsibility is the surrounding work structure, runtime environment, and governance loop.

[![SaaW governance and runtime architecture: SaaW, CodeFlowMu, FCoP, and TMPA](/assets/covers/02-saaw-governance-runtime-stack-fixed-v2.png)](/assets/covers/02-saaw-governance-runtime-stack-fixed-v2.png)

*Figure 1. TMPA supplies work-fact and governance architecture; FCoP supplies the file-based coordination protocol; CodeFlowMu provides the engineering runtime; SaaW names the resulting software-delivery paradigm.*

---

'''
en = en[:en_s9] + en_new_9_10 + en[en_s11:]

# invariant checks
for label, text in [
    ('ZH TMPA definition', '文本化多智能体流程架构' in zh),
    ('ZH four-rule map', '以下第 4—7 节逐条展开这四条规则' in zh),
    ('ZH SME boundary', 'SME-first，而非 SME-only' in zh),
    ('ZH FCoP before CodeFlowMu', zh.index('## 9. FCoP') < zh.index('## 10. CodeFlowMu')),
    ('ZH FCoP formal name', 'File-based Coordination Protocol，文件驱动协作协议' in zh),
    ('ZH os.rename', '`os.rename()` 是唯一同步操作' in zh),
    ('ZH stack', '★ FCoP 协议层 / FCoP Protocol Layer ★' in zh),
    ('EN four-rule map', 'Sections 4–7 expand these four rules in order' in en),
    ('EN SME boundary', 'SME-first, not SME-only' in en),
    ('EN FCoP before CodeFlowMu', en.index('## 9. FCoP') < en.index('## 10. CodeFlowMu')),
    ('EN stack', '★ FCoP Protocol Layer ★' in en),
]:
    if text is not True:
        raise SystemExit(f'Invariant failed: {label}')

# exactly 23 numbered sections remain
import re
if len(re.findall(r'^##\s+\d+\.', zh, flags=re.M)) != 23:
    raise SystemExit('ZH numbered section count changed')
if len(re.findall(r'^##\s+\d+\.', en, flags=re.M)) != 23:
    raise SystemExit('EN numbered section count changed')

files['zh'].write_text(zh, encoding='utf-8')
files['en'].write_text(en, encoding='utf-8')
print('SaaW TMPA/FCoP bilingual structure sync completed')
