# 来源、作者与分类处置

读取日：2026-09-15。完整 SHA、基线、读取时刻见 [机器清单](sources/index.json)。下面的 OPEN / MERGED 是本轮读取快照，不等于永不变化的发布状态。作者账号不等于已验证的现实身份。

| 雷达组 | 一手来源与作者 | 核验所得与分类 | 本轮实验/文章 |
| --- | --- | --- | --- |
| 1 并行路由与用户授权 | Yue Zhao / yzhao062：[e26fafb](https://github.com/yzhao062/anywhere-agents/commit/e26fafb43962abe6fb3cd0aa12940988b66d8131)、[28acaaf](https://github.com/yzhao062/anywhere-agents/commit/28acaafe81e620c05f11df3a1b46e551da85b244) | 前者限定 prun 的 Agy 路由；后者要求新并行展开先有用户选择，同时保留已授权范围和单次窄查找例外。语义策略不等于确定性阻止。资料留存，等待真实宿主会话条件。作者的历史消耗数字未独立复测。 | 未做真实扇出实验；不单独成文 |
| 2 实时工具审批 | DeepanshuPal：[SDK #5029](https://github.com/openai/openai-agents-python/pull/5029)，OPEN | 无效 needs_approval 从宽松放行转为 UserError。API 对象有效与回调输出有效是不同边界。 | 实验 A；文章 1 |
| 3 Windows 执行身份 | copyberry[bot]：[Codex #45542](https://github.com/openai/codex/pull/45542)、[#45550](https://github.com/openai/codex/pull/45550)，MERGED | 服务记录、注册包身份与受管账户配合；registered-core 仍需 CODEX_WINDOWS_REGISTERED_CORE=1。相关 Windows 集成测试需要已安装测试包和服务。合并不等于所有用户已启用。 | 高价值环境验证线索；未安装服务/MSIX、未复现 |
| 4 沙盒个人身份 | saddlepaddle：[Superset #7555](https://github.com/superset-sh/superset/pull/7555)，MERGED 到 sandbox-v2 | 个人 OAuth 身份与 App token 后备、凭据刷新和撤销相关；实验分支不能当作生产默认。作者未现场验证 30 分钟刷新、8 小时换令牌及撤销全链路。 | 持续观察；没有真实账号/长时间刷新实验 |
| 5 暂停原因 | MrBlackTongue：[Paperclip #13443](https://github.com/paperclipai/paperclip/pull/13443)，OPEN | 每任务实时预检 + 阻塞对象 cause，避免暂停被压成预算故障。再次查询可能观察另一个时刻，故原因需随原对象传递。 | 实验 D；文章 3 |
| 6 送达与运行身份 | brennanb2025：[Orca #20723](https://github.com/stablyai/orca/pull/20723)、[#20717](https://github.com/stablyai/orca/pull/20717)、[#20718](https://github.com/stablyai/orca/pull/20718)，OPEN | #20723 保留未知，限制恢复拒绝后的新消息身份。#20717 是无消费者的新规范存储合同；#20718 接入 native chat，CLI/PTY 仍保留 legacy，且两 PR 为堆叠分支。不能写成已完成全产品身份迁移。 | 只对 #20723 做实验 C，进入文章 2；运行身份两项继续观察 |
| 7 工具重复调用 | Ritiky23：[CrewAI #7458](https://github.com/crewAIInc/crewAI/pull/7458)，OPEN | 缩小参数处理异常范围，去掉一次尝试中的第二次 invoke；外层重试仍可重复副作用。 | 实验 B；文章 2 |

分类理由：四个对象提供了可以固定的决定性代码边界与可控制反例，因此本轮实际执行。其余对象涉及真实会话策略、系统包身份、长期凭据轮换或尚未完成的消费者迁移，不能靠重新写一套玩具模型假装验证。它们保留来源与未验证原因，不包装成开发评审。

## 本轮形成的新启发与问题

- A：拒绝非法顶层设置，不等于验证回调结果；回调返回空值的处理位置仍可讨论。
- B：重复次数从六次减少到三次，仍不是业务幂等；应区分尝试次数、工具调用次数与实际提交次数。
- C：未知可以阻止不安全重发，也可能让操作等待；后续需要可解释的核实与解除等待机制。
- D：原因必须绑定当次观察；后一次活跃状态不能为前一次暂停原因提供反证。

以上是本轮受控输入所支持的启发，不声称比原作者讨论更早提出，也不把上游自述计入我们的数据。
