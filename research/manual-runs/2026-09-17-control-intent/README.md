# 2026-09-17：控制意图怎样进入真实执行
[English](./README.en.md)

## 本轮结论

7 组资讯拆成 9 个独立来源对象，逐项处理；对其中 7 个议题执行有界原代码实验，得到 75 条观察，产出 3 篇中英双语文章。2 个议题仅完成源码核查，未列入实验成果。不同粒度的观察不能合并成“可靠性通过率”。

| 议题与来源 | 本轮处理 | 实测与边界 | 文章 |
| --- | --- | --- | --- |
| [anywhere-agents ce6457a](https://github.com/yzhao062/anywhere-agents/commit/ce6457a830dead5e05c3a17f685f7ff32575ce20)，yzhao062 | 两版完整合并程序，6 场景 × 2 | 12 条；无变化合并不再挤掉旧备份；人为格式反例仍消耗保留窗口；真实 Windows 文件/锁/8 进程 | 备份历史 |
| [Codex #46042](https://github.com/openai/codex/pull/46042)，copyberry[bot] | 源码核查，未运行 Rust | 强制只读元数据、服务器策略身份、共享缓存排除；不证明任意服务器实际服从 | 不产出实验文章 |
| [Paperclip #13539](https://github.com/paperclipai/paperclip/pull/13539)，cryppadotta | 源码核查，未运行数据库/完整派发 | 类型化交互载荷、精确修订、普通回答与显式 steer 区分；不把读取代码当端到端验证 | 不产出实验文章 |
| [Paperclip #13549](https://github.com/paperclipai/paperclip/pull/13549)，electrumnz | 原分类代码和辅助函数，9 输入 × 2 | 18 条；新入口接住额度原因并产生恢复时间；否定句为人为关键词边界；未运行调度 | 额度重试 |
| [Paperclip #13529](https://github.com/paperclipai/paperclip/pull/13529)，electrumnz | 原绑定模块，内存投影替身 | 4 条；只删投影后同步会重建；移除配置引用后对应绑定消失；未测认证撤销路由/DB | 研究记录 |
| [Superset #7585](https://github.com/superset-sh/superset/pull/7585)，AviPeltz | 原工具模块，合成 provider | 6 条；安装级隔离、缺失/查询失败/工具不可用区分；只读工具清单 Linear 11/GitHub 12；未调用真实服务 | 研究记录 |
| [Superset #7589](https://github.com/superset-sh/superset/pull/7589)，AviPeltz | 原状态判断函数，合成快照 | 8 条；PermissionRequest 已映射 waiting；没有运行 Slack 投递/持久声明 | 研究记录 |
| [Orca #21106](https://github.com/stablyai/orca/pull/21106)，brennanb2025 | 原持久存储与准入，真实临时文件 | 11 条；已保存结果重放，未结算拒绝，八并发一获准；同进程重开，不是崩溃测试；未启动真实助手 | 重试与重复启动 |
| [Orca #20977](https://github.com/stablyai/orca/pull/20977)，brennanb2025 | 原开线程模块，录制连接替身 | 16 条；Manual 显式 on-request/workspace-write，Yolo 与未设置配置为宽松策略；替身返回冲突策略仍被局部助手接收，不能外推真实服务失效 | 研究记录 |

## 纠正资讯中的时效差异

本轮固定版本见 sources/*.json。Codex #46042、Paperclip #13539、Superset #7585 已合入；Orca #21106 与 #20977 于 9 月 17 日 UTC 合入。Paperclip #13549/#13529、Superset #7589 在本轮读取时仍 open。

Superset #7589 最新代码已有 15 秒转发超时、两分钟可恢复声明租约、PermissionRequest 等待状态和孤儿清理；不沿用旧摘要“等满 24 小时/没有超时”的描述。Orca #21106 上游已另报真实 Electron/强杀恢复 QA，但那不是本轮执行的实验，当前客户端尚未采用外层 operationId 的限制仍存在。

## 三篇文章

- [备份越来越多，为什么反而找不回昨天？](../../../docs/zh/engineering/2026-09-17-backup-without-history.md) · [English](../../../docs/en/engineering/2026-09-17-backup-without-history.md)
- [没收到回复，再点一次会启动两个 AI 吗？](../../../docs/zh/engineering/2026-09-17-retry-without-second-launch.md) · [English](../../../docs/en/engineering/2026-09-17-retry-without-second-launch.md)
- [额度已经耗尽，AI 为什么还在重试？](../../../docs/zh/engineering/2026-09-17-quota-behind-error-code.md) · [English](../../../docs/en/engineering/2026-09-17-quota-behind-error-code.md)

每篇包含来源与研究动机、对照、未验证部分、实验后的问题及普通读者可提供的反馈。三个独立题图；正文图按语言分别绘制。上游的 198 份备份和 320 次运行没有计入本轮实验。

## CodeFlowMu 处置

本轮正式开发评审项目 **0**，最终决定：**不新增开发任务**。备份案例未确认对应的限量备份淘汰路径；本地派发存储已有幂等记录和租约检查，隔离实测支持现有保护；额度案例未证明同一错误入口贯通到本地重试。没有本地问题证据时，不凭上游 PR 推导开发范围和工时。

私有工程核查、候选筛选理由保留在本地。没有将私有代码、交流稿、评论正文、加星记录或互动台账放入此公开目录。

## 复跑

需要 Git、tar、Python 3、Node.js 与 npm；本次在 Windows 上运行。首次下载固定源码需要网络与磁盘空间。上游源码不复制进公开包，setup 保留原仓库许可文件。所有输入为合成数据；使用临时目录，不读取真实密钥、不连接真实模型。

```sh
npm ci --ignore-scripts
node setup.mjs anywhere head base
node setup.mjs quota head base
node setup.mjs manual head base
node setup.mjs revoke head
node setup.mjs callback head
node setup.mjs replay head
node setup.mjs slack head
python probe-backup.py
node probe-boundaries.mjs
node probe-replay.mjs
node probe-slack.mjs
```

脚本输出 JSON，已执行结果见 results/。原始函数提取通过锚点检查，源码变化导致锚点缺失会停止；固定提交避免默默运行最新分支。npm 包锁定于 package-lock.json。源码归原项目作者，许可随下载源码保留。实验脚本不代表上游官方测试。

未覆盖：真实 provider/数据库/手机/Slack、异常断电和跨进程崩溃恢复、完整重试调度、生产负载、UI 意图到全部外部动作的全链路。
