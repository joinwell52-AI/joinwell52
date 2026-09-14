# 实验方法、结果与限制

## 1. 结果终态

`probe-dispatch.py` 从 3c94f45 的原始测试文件加载五项集成测试，分别将测试的 DISPATCH 路径指向父提交与修复提交原脚本。每次在临时目录启动真实 dispatcher 子进程；Agy 是上游 Python CLI 夹具。测试创建的文件均是合成内容，没有真实用户工程或供应商调用。

五个输入：ERROR+narration、ERROR+Worker 文件、ERROR 后无状态事件、明确 SUCCESS、状态字段缺失。旧版前三项失败、后两项通过；修复版五项通过。失败是预期反证，不能合并成“一共十项通过”。数据见 `runs/dispatch.json`，每项有独立日志。

第二天额度提交 050ee0b 的七项额度策略单元测试及四项辅助检查通过。七项策略分别为最紧桶、非有限值、过期且无法刷新、重置时间、未报告组、模型分组、关闭门禁。不是两版本实时路由实验，不报告节约金额或吞吐。

## 2. 会话清空

`setup-sdk.mjs` 获取 #5000 的固定完整源码 bc03568c；`probe-sdk.py` 分进程执行原五项测试。对照进程仅将 `clear_session.__code__` 换回固定 base 文件中的原方法，不改变其余 SDK、测试或 SQLite 实现。不是两个完整发行版的对照。

候选版五项通过；旧方法四项失败、原有 in-flight compaction 等待对照通过。四项新增用例包含正常清空、真实 SQLite 提交后的取消、真实 SQLite 提交后确认错误、auto 模式改用 input。两项 SQLite 用例在真实提交完成后阻断确认，不用布尔变量假装数据库已提交。远端 `responses.compact` 是 AsyncMock，结论停在本地调用参数与拒绝边界。

Python 3.12.10，SDK 安装元数据 0.22.2，实际行为版本以源码 SHA 为准；其余包版本见 `runs/environment.json`。pytest 有一条导入顺序提示，无收集错误。未运行真实 OpenAI API、跨进程恢复、远端删除或全 SDK 测试。

## 3. 当前任务说明

`probe-brief.mjs` 取 #13345 base/head 的原 `selectPaperclipTaskMarkdown`、原字符串与分类辅助函数，以 Node 的类型剥离执行。唯一替身是规范化唤醒函数，返回预先构造的已规范化输入；因此不验证原规范化逻辑。

七个输入跨两版本共十四条观察。普通评论恢复、第二次普通状态恢复两项由 compact 变为 full；fresh、assignment、recovery、compact 缺失与 full 为空的对照保持行为。第二次恢复是重复调用选择函数，不是运行真实会话两次。未验证目标 objective 的数据库计算、锁归属或 provider invocation。

## 复现与保真

公共包的来源清单可下载固定文件；本地原始来源快照含完整差异，公共包仅发布必要元数据。源码 SHA-256 与发布文件 SHA-256 分开记录。`verify.mjs` 验证保存结果与文件哈希，不重新执行实验。重跑请使用各 probe，并保留新的环境和观察，不覆盖旧结果冒充同一轮。
