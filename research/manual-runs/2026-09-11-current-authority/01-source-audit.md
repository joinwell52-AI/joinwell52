# 六组变化的来源审计

核查日期：2026-09-11。精确读取时间、作者、base/head/merge SHA 和文件列表见 [index.json](sources/index.json)。本轮通过 GitHub API 重新读取全部九个 PR，不沿用早间通知的状态作为当前事实。

| 来源 | 核查状态 | 本轮新增判断 | 证据等级 |
| --- | --- | --- | --- |
| [MCP #2127](https://github.com/modelcontextprotocol/modelcontextprotocol/pull/2127) | OPEN；文本 Final；Extensions Track | 可选扩展的提案状态与 PR 合并状态必须分别报告；静态卡排除动态工具及能力，不是权限凭证 | 固定提案全文审读 |
| [Codex #44617](https://github.com/openai/codex/pull/44617) | MERGED | 限于 AgeScore 分支、默认命名空间 exec_command、指定额外权限模式；不能写成“任何权限变化都已统一失效” | 生产差异与回归审读，未跑 Rust |
| [Codex #44655](https://github.com/openai/codex/pull/44655) | MERGED | plugin_id 加入 MCP approval key；共享连接器可保留，直接 Apps RPC 行为保持，不能称为所有访问入口全面撤销 | 生产差异审读 |
| [Codex #44675](https://github.com/openai/codex/pull/44675) | MERGED | 全局指令按模型请求边界刷新；读取失败保留最近成功内容，删除/空文件清空；不是每次无条件重读全部仓库指令 | 生产差异审读 |
| [Superset #7408](https://github.com/superset-sh/superset/pull/7408) | OPEN | 工作区 ID 与过期时间可验证；签名函数合同没有执行世代。世代绑定是否需要必须由产品合同回答 | 原签发/验签函数实测；云端性能仅上游报告 |
| [Superset #7367](https://github.com/superset-sh/superset/pull/7367) | MERGED | 移动成果 review 已合入；评论中的 approve 文本不等于类型化执行授权 | 差异审读；未跑手机 |
| [Paperclip #10972](https://github.com/paperclipai/paperclip/pull/10972) | OPEN | 新 key 的 scoped 设计与 legacy 无范围兼容分开；数据库审计原子性不包含外部效果回滚 | 原 authority 函数、范围定义及审计边界文档审读 |
| [Agents SDK #4947](https://github.com/openai/openai-agents-python/pull/4947) | MERGED | 10 个新增用例原样通过，上一版本目标函数消融 10 个全部失败；测量点为脚本模型输入 | 真实 SDK Runner + 上游回归 + 单函数消融 |
| [Orca #19946](https://github.com/stablyai/orca/pull/19946) | OPEN | 已知未列出时拒绝；无目录证据时兼容放行。恢复遇拒绝会跳过旧偏好 | 固定两版本原函数 + 连接替身实测 |

## 对早间结论的四项收窄

1. “exactly-once delivery”改为“受测恢复路径内，每份结果仅进入一次后续模型输入”。没有测试网络丢包、未知确认或模型消费。
2. “Authorization = …”是拟议评审维度，不是 Codex 已有的统一公式。三个 PR 操作不同机制和生效边界。
3. “当前上下文重新证明”不要求抛弃所有缓存或重弹所有审批。Codex 保留指令读取失败时的成功快照，Orca 明确保留旧 CLI 兼容路径。
4. “公开地址有保护”与“执行世代已绑定”分开。Superset 本地签名实验没有证明真实 Host、手机或云沙箱端到端。

## 未重复核查的内容

Yue Zhao 仓库和本人社交帖无新增的判断属于早间监测结果，本轮不将其计入独立实验或再次验证。没有核实云厂商收购事件，也没有把它用于文章因果推论。主雷达升级仍是候选，不能因本地验签通过而声称云端生产已验收。
