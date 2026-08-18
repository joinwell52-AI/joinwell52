# 文件、路径与事件：FCoP 协作状态机如何实现和测试

![未来 Agent 将单一任务文件迁入新的路径状态，同时保留事件轨迹](03-visuals/cover-fcop-state-machine-final.webp)

> FCoP 的核心不是“用目录监听器收任务”，而是同时守住四份契约：文件身份、路径状态、事件证据和写入原子性。漏掉任何一份，系统都可能看起来在运行，却无法可靠解释自己做过什么。

**系列导航：**如果你还在判断为什么值得从文件开始，先读[治理价值篇](/zh/engineering/2026-08-18-files-first-multi-agent-governance)；本文完成协议内核后，可继续读[Cursor 团队实操篇](/zh/digital-employee/2026-08-18-cursor-ai-development-team)。

一个 Agent 把任务正文里的 `status` 改成 `done`，另一个进程还把同一文件留在 `active/`。面板相信正文，调度器相信目录，审查器则只看到一条“执行成功”的日志。此时系统有三个答案，却没有一个可被公认的当前事实。

文件式协调最常见的误区，是把“文件落盘”当作协议完成。真正需要实现的是一台状态机：什么文件可以进入系统，哪个路径代表当前生命周期，谁能发起哪种迁移，每次迁移如何留下证据，以及进程在写一半或移动一半时失败会发生什么。

[FCoP v3 规范](https://github.com/joinwell52-AI/FCoP/blob/a859e6747fe6e5e2d686e0114c77774726d7f748/spec/fcop-v3-spec.md) 将这组约束压缩为一句话：**Files are the protocol; location defines state; events record history.** 本文把它展开成一个可以实现和测试的最小内核。

## 第一份契约：文件身份回答“这是什么”

FCoP 的正式 IPC envelope 是 `TASK`、`REPORT`、`ISSUE` 和 `REVIEW`。它们的身份语义并不相同：`TASK` 与 `REPORT` 使用 sender→recipient 路由，`ISSUE` 标识 reporter，`REVIEW` 则绑定被审对象。例如：

```text
TASK-20260818-001-PM-to-DEV.md
REPORT-20260818-002-DEV-to-PM.md
ISSUE-20260818-003-QA.md
```

`REVIEW` 的身份绑定被审对象，而不是把它伪装成普通路由消息：

```text
REVIEW-20260818-004-QA-on-report-002.md
```

文件名只提供快速识别和路由，正文仍需保存可校验字段：

```yaml
---
protocol: fcop
version: 3
type: TASK
sender: PM
recipient: DEV
priority: P1
subject: 实现 CSV 导出并补充测试
task_id: TASK-20260818-001-PM-to-DEV
date: 2026-08-18T15:00:00+08:00
---
```

实现时至少要验证：前缀与 `type` 一致，存在 `task_id` 时与文件名 stem 一致，sender/recipient 合法，时间可解析，`ref_task`/`parent` 等派生关系不存在明显循环。文件名不是权限系统，更不是完整业务模型；它只是让错误工件尽早被拒绝，而不是悄悄进入生命周期。

## 第二份契约：路径回答“它现在在哪里”

当前 FCoP 生命周期使用五个位置：

```text
_lifecycle/inbox
_lifecycle/active
_lifecycle/review
_lifecycle/done
_lifecycle/archive
```

![FCoP 五个生命周期位置、七条合法迁移，以及独立的 REPORT 与治理 REVIEW 工件](03-visuals/figure-fcop-lifecycle-and-artifacts.png)

*图 1：路径表达 TASK 当前状态；REPORT 是执行证据，治理 REVIEW 是独立判断，二者都不会自行迁移 TASK。*

图中的两条虚线不是自动状态迁移：REPORT 是执行证据，治理 REVIEW 是独立判定；它们都不能自行把 TASK 推进到 `done/`。

一组最小合法迁移如下：

| 操作 | 来源 | 目标 | 主要责任 |
| --- | --- | --- | --- |
| create/write | 外部 | inbox | 创建者 |
| claim | inbox | active | 执行者或 lifecycle governor |
| submit | active | review | 执行者 |
| finish | active | done | 有权终结的角色 |
| approve | review | done | reviewer/leader |
| reject | review | active | reviewer/leader |
| archive | done | archive | ADMIN/leader |

这张表有两个重要含义。

第一，正文里的 `status` 不能压倒路径。路径是唯一生命周期事实；正文状态只能是派生信息或兼容字段，否则两个写入面迟早分叉。

> **正文里的 `status: done` 不等于状态，路径才是唯一生命周期事实；把位置与事件压缩成一个字段，你将失去整个审查历史。**

第二，worker 报告完成不等于自己归档。FCoP [3.2.5 版本说明](https://github.com/joinwell52-AI/FCoP/blob/a859e6747fe6e5e2d686e0114c77774726d7f748/docs/releases/3.2.5.md) 明确收紧了责任：worker 写 REPORT 后停止；归档由 ADMIN 或 leader 执行。这样才能把“我做完了”和“系统确认这项工作可以关闭”分开。

## 第三份契约：事件回答“它如何来到这里”

只移动旧文件会改变路径，却不会解释历史。FCoP v3 因此把事件直接保存在 TASK front matter 的 `transitions:` 数组里；每次迁移追加一项：

```yaml
transitions:
  - at: 2026-08-18T15:18:43+08:00
    from: active
    to: review
    by: DEV-01
    tool: submit_task
    note: REPORT-20260818-002-DEV-to-PM
```

规范要求的五个字段是 `at`、`from`、`to`、`by` 和 `tool`；`note`、`supersedes` 等是可选补充。事件跟随 TASK 本身迁移，因此不需要用独立 event ID 再关联一次任务。审计程序可以比较当前路径与最后一条 transition：目标在 `review/`，最后记录却仍停在 `active`，就说明磁盘工件发生了非规范修改或不完整迁移。

状态和历史应当可以交叉校验，而不是互相复制同一个不可信字段。

## 第四份契约：写入算法回答“别人会不会看见半成品”

新建 TASK 时，最小安全写入不是直接打开最终路径写正文，而是在内存加入 creation transition，把完整文本写入目标目录临时文件，fsync 后再 `os.replace` 到 `inbox/` 的最终名称。

状态迁移也不能写成“先 rename，再单独追加事件”。当前实现按以下顺序提交：

1. 读取来源 TASK；
2. 在内存向 `transitions:` 追加本次事件；
3. 把完整新文本写入目标目录的唯一临时文件；
4. fsync 临时文件；
5. `os.replace(tmp, destination)`，使“新路径 + 新事件”一起出现在目标；
6. 目标提交成功后清理来源文件。

```python
def transition(source, target_stage, event):
    require_legal_edge(source, target_stage, event.tool)
    require_same_mount(source, target_stage)
    old_text = read(source)
    new_text = append_to_transitions(old_text, event)
    tmp = unique_temp_in(target_stage)
    write_all(tmp, new_text)
    fsync_file(tmp)
    os.replace(tmp, destination_in(target_stage, source.name))
    unlink_source_after_commit(source)
```

![FCoP 从读取来源任务到写临时文件、fsync、replace 和清理来源的提交时序](03-visuals/figure-fcop-atomic-commit.png)

*图 2：`os.replace` 是目标路径的提交点；来源文件随后清理，因此这套算法不应被误写成完整跨目录移动只有一个系统调用。*

这里必须准确理解“原子”。[POSIX.1-2024 `rename`](https://pubs.opengroup.org/onlinepubs/9799919799/functions/rename.html) 规定，在其适用条件下 rename 的动作是原子的；但跨文件系统可能得到 `EXDEV`。POSIX 的 [Base Definitions rationale](https://pubs.opengroup.org/onlinepubs/9799919799/xrat/V4_xbd_chap01.html) 还特别指出，目录操作可以是原子、可串行化的，却不一定已经持久化到存储介质。

因此目标目录中的 replace 提交点能保证的是“观察者不会在目标路径读到半份新 TASK”，并把目标路径与新 transition 放在同一份文件里；它不是：

- 多个 worker 自动只有一个获胜；
- 进程崩溃后数据必然持久；
- 网络文件系统与本地磁盘语义一致；
- 系统没有死锁；
- 任务只会执行一次。

认领竞争需要明确的 compare-and-move 规则或单写者 governor；重复执行需要幂等键和结果去重；崩溃恢复需要扫描磁盘与事件差异。这些不能从“rename 原子”四个字推导出来。

## 两个 review，必须在模型里分开

FCoP 中有两个容易混淆的 review：

- `_lifecycle/review/` 是任务生命周期位置，表达“等待审查”；
- `reviews/REVIEW-*` 是治理工件，表达“某个审查者对某个对象作出的判断”。

一个任务进入 `review/`，不代表已经存在有效 REVIEW；一份 REVIEW 被创建，也不一定批准了任务。FCoP conformance 只要求两条链分别合法，不规定自动绑定。宿主如果希望更严格，可以额外校验 REVIEW 的 subject、reviewer 权限，并要求高风险 approve/reject 引用对应 REVIEW；这属于治理增强，不是协议默认要求。

这种正交设计多写了一份工件，却换来了关键的责任边界：位置由生命周期管理，判断由审查者负责。

## 测试不要只测“能移动”，要测四层不变量

本轮在 FCoP 当前工作树运行：

```text
python -m pytest \
  tests/test_lifecycle/test_atomic.py \
  tests/test_lifecycle/test_project_v3_writes.py -q
```

结果为 `22 passed in 0.89s`。这只覆盖当前提交、当前环境中的两个局部测试文件，不是性能基准，也不证明跨机或高并发能力。实际覆盖与建议补测必须分开。

### 本轮 22 项实际覆盖

- 合法创建进入 `inbox/` 并写入 creation transition；
- 文件名含路径分隔符、创建事件带非法来源、目标已存在时拒绝；
- `inbox → active` 和完整生命周期链成功；
- transition 出现在目标 TASK，成功后不遗留临时文件；
- 越级迁移、错误工具、事件来源/目标不一致时拒绝且磁盘不变；
- 项目写入、归档幂等、跨生命周期桶定位和 v2 兼容路径保持有效。

### 建议新增的身份与治理测试

- filename/front matter schema 全量一致性；
- REVIEW subject、decision 枚举与治理层权限；
- worker 不能自行 archive 的权限适配。

### 建议新增的故障与并发测试

- 写临时文件后崩溃：最终路径不出现半成品；
- 目标 replace 成功、来源清理失败：恢复扫描识别重复副本；
- 两个执行者同时 claim：只有允许的获胜模型成立；
- REPORT 重复提交：相同幂等键不会产生两个业务结果；
- 目标目录不存在、权限不足、磁盘满和 `EXDEV`：错误显式暴露。

真正有区分度的是故障测试。快乐路径只能证明代码会跑，故障路径才说明协议在保护什么。

## 一个可用实现还需要哪些外层组件

状态机内核之外，工程系统通常还要补上：

- schema validator：校验 envelope 和事件；
- lifecycle governor：集中执行或仲裁迁移；
- recovery scanner：比较目录、事件和关联工件；
- permission adapter：把角色权限映射到本地进程或服务身份；
- index/view：当目录规模增大时提供搜索和观察面；
- runtime adapter：真正调用模型、工具、沙箱和测试环境。

[ADR-0038](https://github.com/joinwell52-AI/FCoP/blob/a859e6747fe6e5e2d686e0114c77774726d7f748/adr/ADR-0038-fcop-boundary-charter.md) 对最后一点很明确：FCoP 描述、外化和协调工作，但不执行任务，也不拥有模型运行时和全局编排。把这些边界留在协议之外，不是功能缺失，而是避免“文件协议”膨胀成另一个不可替换的平台。

## 结论：可检查来自四份契约同时成立

一个文件状态机是否可靠，不取决于目录是否漂亮，而取决于系统能否在任何时刻回答四个问题：这是什么工件？它现在处于什么状态？它如何来到这里？观察者是否可能读到半成品？

文件身份、路径状态、事件证据和写入原子性分别回答这四个问题。再加上权限、幂等和恢复，FCoP 才从一组命名约定变成可测试的协作内核。

它仍然有清楚的边界：本文的测试没有证明网络文件系统、高并发争抢、跨机一致性或 exactly-once。下一步不是用口号填上这些空白，而是把每种故障模型写成测试，再让实现用证据回答。

有了可测试的状态迁移与原子提交约束，下一步是把协议接入日常研发，而不让多 Agent 退化为多个互不相干的聊天窗口。继续阅读：《[在 Cursor 里带一支 AI 开发团队：从需求拆解到测试验收](/zh/digital-employee/2026-08-18-cursor-ai-development-team)》。

## 参考资料

- [FCoP v3 specification](https://github.com/joinwell52-AI/FCoP/blob/a859e6747fe6e5e2d686e0114c77774726d7f748/spec/fcop-v3-spec.md)
- [FCoP 3.2.5 release notes](https://github.com/joinwell52-AI/FCoP/blob/a859e6747fe6e5e2d686e0114c77774726d7f748/docs/releases/3.2.5.md)
- [FCoP lifecycle tests](https://github.com/joinwell52-AI/FCoP/tree/a859e6747fe6e5e2d686e0114c77774726d7f748/tests/test_lifecycle)
- [POSIX.1-2024 rename](https://pubs.opengroup.org/onlinepubs/9799919799/functions/rename.html)
- [POSIX.1-2024 Base Definitions rationale](https://pubs.opengroup.org/onlinepubs/9799919799/xrat/V4_xbd_chap01.html)
- [ADR-0038: FCoP Boundary Charter](https://github.com/joinwell52-AI/FCoP/blob/a859e6747fe6e5e2d686e0114c77774726d7f748/adr/ADR-0038-fcop-boundary-charter.md)
