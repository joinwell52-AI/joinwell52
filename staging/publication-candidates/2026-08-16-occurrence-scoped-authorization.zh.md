---
schema: publication-candidate-article/v2
title: "持久化 Agent 授权需要动作实例边界"
date: '2026-08-16'
column: digital-employee
category: daily
article_type: engineering-insight
edition: research-center
research_question: "How should a durable agent runtime represent one human decision for one concrete tool-call occurrence when a broader sticky authorization default already exists?"
summary: "更稳健的持久化授权，需要把宽泛默认策略与单次动作实例例外作为不同事实保存。精确 Call Identity 可以让一次决定跨恢复继续有效，但它并不能证明审批者身份、策略来源或外部效果恰好执行一次。"
cover: staging/publication-candidates/2026-08-16-occurrence-scoped-authorization-cover.png
sources:
  - research/analysis/Q-20260816-01-occurrence-scoped-authorization-state.md
---

![持久化 Agent 授权需要动作实例边界题图](staging/publication-candidates/2026-08-16-occurrence-scoped-authorization-cover.png)

# 持久化 Agent 授权需要动作实例边界

一个可以长期运行的 Agent，可能在工具调用前暂停，等待人工决定，保存状态，重启后再继续执行。连续性带来一个看似简单、实际上非常关键的问题：人工究竟授权了什么？

“这个工具默认允许或拒绝”与“这一次具体调用允许或拒绝”不是同一个事实。如果用户只是批准某一次调用，而系统为了保存这次批准去修改更宽的默认规则，就会静默扩大人工决定的作用范围。更精确的做法，是保留原来的宽泛规则，再把单次例外绑定到具体的待执行动作实例。

2026-08-16 的 Research Object 分析了 OpenAI Agents Python 的一个已合并变更：系统先解析精确的 Approved/Rejected Call ID，再回退到 Sticky Default。相关回归测试与序列化证据表明，单次 Exception 可以和宽泛 Default 一起跨 Resume 保存；当精确决定发生反转时，实现会移除相反记录，而不是让互相矛盾的状态同时存在。这里的证据来自维护者代码与测试，是有边界的一手实现事实，不是企业授权体系的独立评估。

## 持久决定需要窄范围授权对象

Occurrence-scoped State 的第一个价值，是控制授权范围。Sticky Policy 天生用于重复适用，例如“以后这个 Tool 都允许”或“以后这个 Tool 都拒绝”。Exact-call Exception 的含义不同：它表示“对于已经记录的这一次调用，使用这个决定”。

恢复时，这个区别尤其重要。如果 Exception 在重启后消失，系统可能重新落回更宽的 Default，导致有效授权语义发生变化；如果为了保留一次例外而改写 Default，又可能误伤其他同类调用。把两层状态分别持久化，可以同时避免这两类问题。

决定反转也应当成为显式状态替换。某个具体 Call 从批准改为拒绝，或者从拒绝改为批准时，相反的 Exact Entry 应被清除。一个动作实例不应同时携带两个互相冲突的终态决定。

但 Exact Call ID 只回答一个问题：**这个决定针对哪一次调用？** 它并不回答“谁做了决定”“这个人是否有权决定”“跨 Trust Domain 的 Call ID 是否可信”，也不证明外部效果是否恰好执行一次。

## 把决定、主体与外部效果分开

对持久化数字工作，更清晰的授权链可以拆成四类事实：

**默认策略 → 动作实例决定 → 主体与权限证据 → 外部效果证据**。

默认策略定义可重复使用的规则；动作实例决定记录具体 Pending Action 的有界例外；主体与权限证据说明由谁、依据什么角色或策略产生这个例外；外部效果证据则说明授权之后实际发生了什么。

这几层的生命周期和证明要求并不相同。Approval 可以跨重启保存，而 Approver 的身份认证可能由外围 Identity Provider 提供。相反，一个完全正确的授权记录，也不能证明付款、发信、部署或其他外部副作用已经 Exactly-once 完成。

这种分离也会让审计记录更容易解释。“从状态恢复了批准”不能等价成“已验证批准者身份”，更不能等价成“外部效果已完成”。治理系统可以记录三者，但不能互相推导。

对于高风险工具，还应该考虑把持久 Exception 与 Action Fingerprint 绑定，并在 Resume 时重新检查。Tool Identity、Arguments、Tool Version 与 Governing Policy 都可能是 Fingerprint 的组成部分。当这些要素发生实质变化时，更安全的策略是让旧 Exception 失效或重新准入，而不是把旧决定重放到已经改变的工作上。这一点属于 Research Object 的架构解释，并非所选 SDK Patch 已经实现的行为。

## 这个机制没有建立什么

现有实现证据没有认证 Approver 身份，没有建立 Role Policy、密码学 Provenance、全局唯一且不可伪造的 Call Identifier，也没有建立 External Effect Finality。它同样不能说明所有场景都值得引入 Occurrence-scoped Approval。

对低风险单用户 Agent，外围应用完全可以承担 Identity 与 Authorization；在高度受控的环境里，如果 Pause 与 Resume 之间 Tool Arguments 与 Policy 不会变化，Stable Call ID 加 Durable Exact Decision 也可能已经足够。

因此，这里的工程结论不是“每个 Agent 都必须内置完整授权栈”，而是更窄的一条：**不要让一个持久化决定替代多种本来应该分别存在的证据。**

## 高风险恢复动作仍待回答的问题

高风险 Exact-call Decision 旁边应该持久化哪些 Actor、Role 与 Policy Evidence？Action Fingerprint 中哪些字段必须不可变？导入状态时，系统怎样证明 Occurrence Identifier 与 Approval Record 没有跨 Trust Domain 被伪造或重放？

Durability 让一次决定能够恢复；它不会自动让这个决定变得真实、合规或具有最终性。Occurrence Boundary 适合保存授权范围，而完整信任链仍需要独立证据。
