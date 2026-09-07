# 选题与论证地图

## 选题

中文：**批准了这条命令，为什么另一条也能过？一次 Agent 授权摘要实验**

英文：**You Approved One Command. Why Did Another Pass? An Experiment in Agent Authorization Identity**

只选一篇主文：F01/F02 是同一请求构造链上的相反现象，合写才能说明“该变的身份没变，不该因会话续接改变的身份反而变了”。对象 lineage 的通过结果用于限定范围，不扩写为第二个本地缺陷。

## 选题门槛

- 真实场景：真实 CodeFlowMu 审批服务和 Native/Codex resolution 函数，在隔离夹具中批准命令 A 后接受改分支的命令 B；命令未实际执行。
- 核心问题：批准记录绑定的是一个具体动作，还是适配器提取出的一类风险？
- 第一方证据：固定 SHA、31 项基线测试两轮、11 个审批输入两轮、7 个差分输入两轮、Codex resolution 两个场景两轮。
- 读者收获：能设计两类相反变异测试——改变动作语义应失配；合法运行上下文变化不应偶然破坏动作匹配；真实授权仍须独立复核。

## 叙事骨架：我们先遇到问题

1. 两行 Git 命令引出矛盾；第一屏交代合成实验、不是线上推送事故。
2. 一句话介绍 CodeFlowMu；解释为什么研究恢复资格，而非照搬 Host。
3. 简短外部动因：Codex Guardian 的证据适用性。点到为止，迅速回到本地测试。
4. 既有保护不是空白；完整保留 11 输入矩阵及一次消费正对照。
5. 沿真实门定位信息丢失，区分风险类、动作 identity 和请求 digest。
6. 新 Session 的相反错误；把底层服务单测与真实请求形状的差别讲清楚。
7. 提炼两个变异方向，给读者可执行检查表；能力状态、证据限制与结尾集中收束。

## 证据三角

- 历史剖面：没有线上事故样本，不编造频率。使用当日两轮合成实验及旧测试的当前复跑，明确不是事故统计。
- 当前代码：OperationFacts → UnifiedOperationPolicy → OperationApprovalService → Native gate → Codex resolution。
- 可复跑最小探针：原研究脚本可在相同源码/依赖环境复跑；文章证据包提供去标识观察和读取校验器，只证明记录一致性，不冒充再次执行产品。

## 冻结表达边界

- force/delete/remote 只证明摘要相同；实际批准消费验证到改分支，不把所有变体都写成已执行或已消费。
- Session 实验写“记录了 wake Session 的受控续接输入”，不声称真实 successor 的 ownership、scope grant、恢复准入已全部满足。
- 一次消费仍有效；错 TASK/Agent/thread 仍被阻止；不能写“审批完全失效”。
- 不删除所有 session，不要求 hash 所有原文，不宣布已修复，不触发开发。
- 状态：研究稿经用户授权发布；英文正文与中文同证据、同限制。此处不单独证明 GitHub 已发布。
