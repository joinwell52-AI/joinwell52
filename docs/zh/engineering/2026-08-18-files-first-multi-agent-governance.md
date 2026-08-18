---
title: "多 Agent 治理为什么可以从文件开始？‘万物皆文件’的工程价值"
date: '2026-08-18'
column: open-source-engineering
category: daily
article_type: technical-analysis
edition: research-center
research_question: "为什么文件、路径与事件适合作为本地优先多 Agent 治理的起点，它们又明确不保证什么？"
summary: "文件不是消息队列或工作流引擎的廉价替代品；它的首要价值是先建立一份人和 Agent 都能检查的共同工作账本，再用真实压力决定是否升级基础设施。"
item_id: "MANUAL-20260818-FILES"
lifecycle: "Published"
cover: "/assets/covers/daily-2026-08-18-files-first-multi-agent-governance-cover.webp"
evidence_status: "Completed"
citation_status: "Completed"
editing_status: "Completed"
publication_authorized: true
sources:
  - research/manual-runs/2026-08-18-guided-article-pipeline-round1/02-source-register.md
  - research/manual-runs/2026-08-18-guided-article-pipeline-round1/02-fact-matrices.md
  - research/manual-runs/2026-08-18-guided-article-pipeline-round1/02-article-briefs.md
  - research/manual-runs/2026-08-18-guided-article-pipeline-round1/02-independent-editorial-review.md
---

<ArticleCover
  image="/assets/covers/daily-2026-08-18-files-first-multi-agent-governance-cover.webp"
  kicker="开源工程 · 研究文章"
  title="多 Agent 治理为什么可以从文件开始？‘万物皆文件’的工程价值"
  summary="文件不是消息队列或工作流引擎的廉价替代品；它的首要价值是先建立一份人和 Agent 都能检查的共同工作账本，再用真实压力决定是否升级基础设施。"
  version="MANUAL-20260818-FILES"
  status="Independent Editorial PASS · 2026-08-18"
  languageHref="/en/engineering/2026-08-18-files-first-multi-agent-governance"
  languageLabel="English"
/>

# 多 Agent 治理为什么可以从文件开始？“万物皆文件”的工程价值

> 文件不是消息队列、数据库和工作流引擎的廉价替代品。它更适合承担第一份治理基础设施：一份人和 Agent 都能直接读取、检查、复制与恢复的工作账本。

**系列导航：**本篇解释为什么从文件开始；接着阅读[状态机实现篇](/zh/engineering/2026-08-18-fcop-file-state-machine)，再进入[Cursor 团队实操篇](/zh/digital-employee/2026-08-18-cursor-ai-development-team)。三篇分别回答治理价值、协议内核和真实交付。

多 Agent 协作最先遇到的问题，不是怎样同时打开更多会话，而是怎样让一个角色交代的任务、另一个角色提交的结果、第三个角色给出的审查判断，成为所有参与者都能读取的共同事实。

如果这些内容只留在各自的上下文里，即使所有 Agent 都声称“完成”，团队仍可能回答不了几个最普通的问题：当前正式任务是哪一版？谁改了范围？测试报告对应哪次实现？驳回理由有没有进入下一轮任务？

很多系统在这一步会直接讨论更重的基础设施。但对于单机、本地优先、低到中等并发的 Agent 协作，第一步往往可以更朴素：先把任务、状态、回执和审查判断写成文件，让目录位置表达当前状态，让只追加事件保留迁移历史。

协议的核心只有一句话：

> **AI 角色之间不能只在脑子里说话，必须落成文件。**

不是因为规定要求，是因为只有文件里的东西，才是真实发生过的协作。

“文件承载协议，路径表达状态，事件记录历史”是这句话的工程展开：文件让协作内容可以被其他角色读取，路径让当前状态可以被共同判断，事件让已经发生的迁移可以被追溯。

这不是“文件包打天下”。它是一条治理顺序：先让工作可见、可检查，再根据真实压力决定是否升级运行时。

## “万物皆文件”真正值得借鉴的，不是口号

Ritchie 和 Thompson 在 [The UNIX Time-Sharing System](https://pdos.csail.mit.edu/6.828/2014/readings/ritchie78unix.pdf) 中描述的工程价值，比后来流行的口号更具体：Unix 用分层目录组织对象，尽量让普通文件、设备和进程间 I/O 共享兼容的读写接口；命令通过标准输入输出和 pipe 组合，而不要求每个程序理解所有上游和下游。

这里有三条可以迁移到 Agent 治理的原则。

第一，**使用共同接口降低接入成本**。人可以用编辑器读任务，Agent 可以解析 front matter，CLI 可以扫描目录，网页面板可以建立索引。它们不必先共享同一个 SDK 才能理解工作事实。

第二，**让名称和位置携带稳定语义**。路径不只是存储地址。`inbox/`、`active/`、`review/`、`done/` 可以成为人和程序都看得懂的状态面。

第三，**把复杂能力放在可组合的小工具中**。创建、校验、迁移、审查和归档可以由不同工具完成，只要它们遵守同一份工件契约。

但原论文也直接提醒我们不要神化文件：Unix 内部仍需要互锁；两个进程在没有锁、原子写或版本检查的情况下同时更新一个文件，可能造成内容损坏或更新丢失；pipe、process 和权限机制也不是“文件”二字自动提供的。因而本文采用的“万物皆文件”，只指**优先把协作事实外化为通用、可读的工件**，不指所有运行时问题都由文件系统解决。

## 文件为什么适合做多 Agent 的“黑板”

H. Penny Nii 在 [黑板模型](https://ojs.aaai.org/aimagazine/index.php/aimagazine/article/view/537) 中总结了一类经典问题求解架构：多个知识源围绕共享黑板读取当前问题状态，并把新的中间结果写回去。没有哪个知识源必须保存全局真相；协作发生在共享工作面上。

文件目录可以成为这种共享工作面的一个实现，但二者不能画等号。黑板可以放在内存或数据库里，文件也可能只是杂乱无章的日志。文件只有同时满足以下条件，才开始具有治理价值：

1. 每个工件有明确身份，而不是随手命名的笔记；
2. 当前状态有唯一可判定的位置，而不是正文里互相冲突的 `status` 字段；
3. 状态变化留下可排序事件，而不是移动后抹掉历史；
4. 角色知道自己能创建、迁移和批准什么；
5. 结束条件由可验证证据决定，而不是 Agent 的一句“已完成”。

这也是“保存聊天记录”与“建立工作账本”的区别。聊天记录按说话顺序组织，工作账本按工作对象和责任组织。

![多个角色写入同一文件、路径与事件事实面，再由人、Agent 和工具共同读取](/assets/covers/daily-2026-08-18-files-first-shared-ledger.png)

*图 1：文件式治理首先建立共同事实面；它协调任务、状态和证据，但不替代执行引擎或分布式一致性系统。来源：Research Center 根据 Unix、FCoP 与 TMPA 资料整理。*

## 一份最小工作账本需要四类事实

FCoP 使用四种 IPC envelope，把协作行为分成四类：

| 工件 | 回答的问题 | 最小内容 |
| --- | --- | --- |
| `TASK` | 谁被要求交付什么？ | sender、recipient、priority、parent、scope、acceptance |
| `REPORT` | 执行者实际做了什么？ | 对应任务、变更、测试、剩余风险、证据路径 |
| `ISSUE` | 什么阻碍了交付？ | 现象、影响、已尝试动作、需要谁决策 |
| `REVIEW` | 谁基于什么证据作出什么判断？ | subject、reviewer、verdict、理由、后续动作 |

这四类工件不是四个聊天窗口。`TASK` 把角色之间的工作委托正式落盘；需要继续拆分时，下游任务通过 `parent` 指回上游任务。这样，任务从哪里来、交给了谁、怎样拆分以及最终回执给谁，都不必依赖某个 Agent 的会话记忆。

## 五个生命周期桶：用文件位置回答“任务现在在哪”

`_lifecycle/` 下的五个目录不是为了整理得好看，而是一台最小、可观察的状态机：**一张 TASK 在同一时刻只能位于一个桶中，移动文件就是状态迁移。**

| 生命周期桶 | 回答的问题 | 典型动作 |
| --- | --- | --- |
| `inbox/` | 新任务已经落盘，谁来领取？ | 发送者或上游角色创建任务，等待接收者 `claim` |
| `active/` | 谁正在执行，或谁正在返工？ | 接收者认领；被驳回的任务也退回这里继续修改 |
| `review/` | 交付已经提交，谁来确认？ | 执行者提交，由上游角色或 `ADMIN` 审核 |
| `done/` | 协议生命周期是否已经完成或批准？ | `finish` 或 `approve`；但到达 `done` **不等于业务验收完成** |
| `archive/` | 这项工作是否已经退出当前协作面？ | 有权限的上游角色或 `ADMIN` 在接受交付后归档 |

它形成一条能被人和程序同时读懂的主路径：

```text
inbox --claim--> active --submit--> review --approve--> done --archive--> archive
                    |   ^                   |
                    |   +------reject-------+
                    +---------finish------->+
```

五阶段桶的关键原理有四条：

1. **单一当前位置**：不能让同一张任务同时出现在 `active` 和 `done`，否则当前状态会出现两个答案。
2. **迁移而非改标签**：状态改变通过受控移动完成，不靠 Agent 随手把正文里的 `status` 改成 `done`。
3. **现在与过去分层**：文件路径回答“现在在哪”，TASK front matter 的 `transitions:` 只追加记录“怎样来到这里”。
4. **状态与凭证分离**：`REPORT`、`ISSUE`、`REVIEW` 是交付、阻塞和治理判断的证据，不是任务当前状态。

这里还必须澄清一个容易混淆的名称。FCoP v2 曾把 `tasks / reports / issues / shared / log` 称为“旧五桶”，那是按**工件类型**分目录；FCoP v3 已废止这种任务状态表达方式。本文所说的是 v3 `_lifecycle/` 下的**五个生命周期桶**，也就是按**工作阶段**组织 TASK。两者不是同一个概念。

同时，`_lifecycle/review/` 与 `reviews/REVIEW-*.md` 也不能混为一谈：前者表示 TASK 正在等待批准或驳回，后者是一份独立的治理判断工件。

于是，一份文件式工作账本包含三个相互配合、不能互相替代的层次：

- 文件正文与四类工件说明“这是什么、做了什么、依据是什么”；
- 所在路径说明“这张任务现在位于哪个生命周期阶段”；
- `transitions:` 说明“它如何来到这里”。

> **对于当前生命周期位置，路径才是唯一的 NOW 事实；对于业务是否完成，上游对 REPORT 及其证据的接受才是判断依据。**

把三者压缩成一个可随意改写的 `status: done`，人就无法区分“执行者宣告完成”“任务被批准”和“上游真正接受交付”这三件不同的事。

## 可检查性如何改变一次返工

FCoP 仓库的 [Tetris dogfood 记录](https://github.com/joinwell52-AI/FCoP/tree/a859e6747fe6e5e2d686e0114c77774726d7f748/docs/tutorials/assets/tetris-en/evidence) 保存了一个小而真实的失败：任务规格不充分，执行者没有使用已有的 ISSUE 路径，而是自行猜测；缺陷随后出现在被猜测的区域。审查驳回后，管理员重新生成了一张范围更清楚的返工任务。

这个案例不能证明文件式治理能降低多少缺陷率，也不能外推到大型团队。它只证明一件较小但重要的事：当任务、执行回执、审查判断和返工任务分别存在时，失败不必只剩下一段模糊回忆。负责人可以追问：遗漏最早出现在哪份规格？执行者何时开始猜测？审查意见是否进入了下一张任务？

这就是工作账本带来的效果：不是消灭错误，而是**让错误能够被定位、讨论和转化为下一步行动**。

## 文件起步适用于什么边界

文件式工作账本尤其适合这些条件：

- 单机或明确的共享工作区；
- 任务吞吐量不高，人工可读性比毫秒级延迟更重要；
- 工件需要进入 Git、备份或普通文件工具链；
- 人需要直接检查、修订和批准 Agent 的工作；
- 团队仍在摸索协议，尚未稳定到值得建设复杂控制平面。

出现下列压力时，则应把文件保留为证据面，同时升级运行时或索引层：

- 多机对同一任务高频竞争；
- 需要严格事务、细粒度权限或复杂查询；
- 需要明确的重试、租约、超时调度和吞吐保证；
- 网络文件系统的缓存、一致性和故障语义无法满足要求；
- 工件规模使目录扫描和人工检索成为瓶颈。

重点不是在“文件”和“重型系统”之间宣誓效忠，而是分清两个平面：**工件平面负责留下可读事实，执行平面负责调度、隔离、重试和扩展。** 两者可以从同一台机器上的一个目录开始，也可以逐步演化为不同组件。

## 今天就能建立的最小结构

如果文章讨论的是 FCoP v3，就应该直接展示它的实际分层，而不是另造一个容易与协议混淆的 `events/` 目录：

```text
project/
  fcop/
    fcop.json
    _lifecycle/
      inbox/
      active/
      review/
      done/
      archive/
    reports/
    issues/
    shared/
    reviews/
    history/
      YYYY-MM-DD/
  workspace/
    <slug>/
```

这棵目录里有三个不同平面：

- `_lifecycle/` 是 **TASK 的当前状态面**，五个子目录就是五个生命周期桶；
- `reports/`、`issues/`、`reviews/` 是 **证据与治理面**，它们不随 TASK 的状态迁移；
- `history/` 是 **长期历史面**，已关闭任务及其配对报告可以按日期进入深归档。

每张 TASK 自身的 `transitions:` 保存只追加的迁移历史。因此不需要再创造一份可能与任务文件互相漂移的 `events/` 真相。其他系统当然可以把事件存入数据库或独立日志，但必须明确谁是权威来源。

再用七个问题检查它：

1. 每项工作是否有唯一身份和明确接收者？
2. 人能否在一分钟内找到当前正式版本？
3. “完成”是否附带测试、diff 或其他环境证据？
4. 审查判断是否与执行者回执分开保存？
5. 驳回后是否生成了可追踪的下一步，而不是回到聊天里口头修改？
6. 状态迁移是否保留时间、执行者和来源/去向？
7. 如果运行时进程现在崩溃，重启后能否仅凭磁盘工件恢复“发生过什么”？

若七个问题大多答不上来，系统缺少的通常不是更多 Agent，而是第一份共同工作账本。

## 总结：“万物皆文件”的工程价值到底是什么

“万物皆文件”在多 Agent 治理中的价值，不是把数据库、消息队列和工作流引擎粗暴地换成 Markdown，而是先为协作建立一个统一、开放的协议面。它最终带来五项工程价值：

| 工程价值 | 文件式账本如何提供它 |
| --- | --- |
| **可寻址** | 每项任务有稳定文件名、发送者、接收者和父子关系，人和程序能指向同一个工作对象 |
| **可观察** | 五个生命周期桶直接暴露任务当前所在阶段，不必相信某个 Agent 的口头状态 |
| **可回放** | `transitions:` 保留迁移时间、来源、去向、执行者和工具，进程重启后仍能恢复历史 |
| **可验证** | TASK、REPORT、ISSUE、REVIEW 分开落盘，让目标、执行回执、阻塞和独立判断能够互相核对 |
| **可组合、可演化** | 编辑器、Git、CLI、网页面板和索引器都能围绕同一批工件工作；并发和规模增加后，还可以在上面叠加数据库、队列与运行时 |

可以把它压缩成一个公式：

> **稳定身份 + 路径状态 + 迁移历史 + 交付证据 = 一份可治理的共同工作账本。**

这份账本不会自动解决并发竞争、事务、权限、重试和调度，但它先解决了更基础的问题：任务有没有被正式委托，谁正在负责，为什么被驳回，最终又凭什么被接受。

所以，“从文件开始”不是怀旧，也不是拒绝基础设施。它的工程价值是：**先让人、Agent 和工具共享同一组可检查事实，再根据真实压力升级执行平面。** 当瓶颈真的出现在竞争、查询、恢复、权限或吞吐上时，引入数据库、队列或工作流引擎才是有证据的演化，而不是一开始就用复杂系统掩盖协作事实仍然混乱的问题。

FCoP 不是行业标准，也不是最终答案。它提供的是一个可以被验证的起点：**在增加控制平面之前，先让协作本身能够被人看见、被工具读取、被证据检查。**

## 参考资料

- [Ritchie & Thompson, The UNIX Time-Sharing System](https://pdos.csail.mit.edu/6.828/2014/readings/ritchie78unix.pdf)
- [H. Penny Nii, The Blackboard Model of Problem Solving and the Evolution of Blackboard Architectures](https://ojs.aaai.org/aimagazine/index.php/aimagazine/article/view/537)
- [FCoP v3 specification](https://github.com/joinwell52-AI/FCoP/blob/a859e6747fe6e5e2d686e0114c77774726d7f748/spec/fcop-v3-spec.md)
- [ADR-0038: FCoP Boundary Charter](https://github.com/joinwell52-AI/FCoP/blob/a859e6747fe6e5e2d686e0114c77774726d7f748/adr/ADR-0038-fcop-boundary-charter.md)
