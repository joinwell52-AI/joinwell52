# 界痕文章修订核查记录

日期：2026-11-16（北京时间）

## 范围与基线

本次根据作者对既有中文文章的审核修改要求，修订《界痕 BoundaryXP：让 AI 团队的任务边界看得见》，并同步英文对应页。原文章发布日和路由保留，页面新增修订日期。

- 原文：https://joinwell52-ai.github.io/joinwell52/zh/research/2026-11-14-boundaryxp-local-global-cycle
- 网站源文基线：`ac13a5f8fabe7bc1fc1aa71ded19c5666fbf3625`。
- 中文原文 blob：`4f8278a2a8ea4d9792352441cdb6e941251d92bc`。
- 英文原文 blob：`2858f8313f96b2d834be549add5c334d7a76e8c6`。
- BoundaryXP 事实核对版本：`4a843cd63b804cf2f0d3280e50689afca698d320`。
- 原网页已直接读取，正文与基线中文源文一致。

本次工作是现有文章的内容与图示修订，不新增 V5 日运行记录，不改写 11 月 14 日保存的实验记录。

## 审核发现与修改

| 发现 | 修改 |
| --- | --- |
| 开篇直接进入产品与闭环，智能体自主规划为何带来边界问题解释不足 | 用明确标为假设的车辆维修记录核查引出目的、允许动作和禁止修改的关系。 |
| 7+1 八维与自然语言问题的对应不够直观 | 增加八问表和双语八轴解释图，保留轮廓、轴、填充及原文关系，图形不表达分数。 |
| 数学方法的作用主要停留在闭环例子 | 补充同一预算下四项费用合计540元、超限40元的原理说明例，以及集合、逻辑前置和依赖图的对应。预算例不是新增实验。 |
| 容易把局部可满足、整体未越界和任务完成混读 | 明确RT044的比较范围与组合冲突归属，补明RT042的端点释放/清场前提和L23-050的身份缺口。 |
| 统计容易被误读成全项正确 | 明确625组整体一致的比较对象、模型与程序逐项9项差异（6项标签编码、3项计算判断）及3项指定输入缺失。 |
| rc.6及必须自行配置API的说明已经过时 | 更新为截至11月16日的rc.8预发行；说明当前宿主模型模式与可选独立API模式。 |
| 中文图存在英文岗位标签；英文图将“送检”简写为“Testing” | 中文化岗位标签；英文事件C改为“Send for testing”，与正文对象一致。 |

正文说明方法、协议与工具的关系，不把协议草案的存在或工程实现视为完整符合性证明。Core原实现源码的私有状态如实保留。

## 来源

以下资料按固定版本核对，文章正文提供对应链接：

- [BXP-0001中文协议，第3.1节八类视图](https://github.com/joinwell52-AI/BoundaryXP/blob/4a843cd63b804cf2f0d3280e50689afca698d320/protocol/versions/0.4.0-draft.2/BXP-0001.zh-CN.md)
- [RT044严格前置闭环](https://github.com/joinwell52-AI/BoundaryXP/blob/4a843cd63b804cf2f0d3280e50689afca698d320/docs/demo/reports/R389-383.zh.md)
- [RT042相邻设备占用](https://github.com/joinwell52-AI/BoundaryXP/blob/4a843cd63b804cf2f0d3280e50689afca698d320/docs/demo/reports/R389-381.zh.md)
- [L23-050责任人指代不明](https://github.com/joinwell52-AI/BoundaryXP/blob/4a843cd63b804cf2f0d3280e50689afca698d320/docs/demo/reports/R389-153.zh.md)
- [625组分析](https://github.com/joinwell52-AI/BoundaryXP/blob/4a843cd63b804cf2f0d3280e50689afca698d320/docs/paper/materials/analysis625/REPORT.zh-CN.md)
- [625组统计口径与逐项差异](https://github.com/joinwell52-AI/BoundaryXP/blob/4a843cd63b804cf2f0d3280e50689afca698d320/docs/paper/materials/evidence-r18/SOURCE-REPORT.md)
- [rc.8发布说明](https://github.com/joinwell52-AI/BoundaryXP/releases/tag/mcp-v0.4.0-rc.8)
- [安装指南与宿主模型流程](https://github.com/joinwell52-AI/BoundaryXP/blob/4a843cd63b804cf2f0d3280e50689afca698d320/docs/mcp/npm/INSTALL.zh-CN.md)
- [原11月14日复核记录](https://github.com/joinwell52-AI/joinwell52/blob/ac13a5f8fabe7bc1fc1aa71ded19c5666fbf3625/research/manual-runs/2026-11-14-boundaryxp/00-report.md)

## 实际完成的验证

采用独立的双文章最小构建工程，使用仓库原有的ArticleCover、ArticleTableScroll组件与封面样式，运行真实VitePress生产构建与静态页面渲染：

- Node v24.22.1、VitePress 1.6.4、Vue 3.5.13。
- 构建成功，日志未发现SSR或未解析组件错误。
- 75项定向检查通过：双语标题、摘要、发布日期与修订日、语言互跳、每篇3幅内文图、替代文字与图注、图片存在性、部署base路径，以及SVG结构等。
- 4个解释SVG经栅格化逐图检查，文字与箭头可读，八问图保持八轴结构。
- 两篇文章共21个GitHub blob链接的路径在对应固定版本目录树中均存在。该项是仓库路径核对，不宣称逐一测试所有外部服务可用性。
- 预算示例复算为540元，超出40元；漏掉80元时为460元。
- 对RT044事件顺序作独立排列检查：各条子顺序分别加入主任务时存在可行排列，全部合并后不存在。
- 两段半开区间[10:00,11:00)、[11:00,12:00)交集为空。
- 定向检查记录的9项源文件及资产摘要与最终工作文件一致。

另生成完整中文单文件HTML预览，封面与三幅内文图全部内嵌，无外部JavaScript或CSS依赖。

## 验证与交付范围

本次没有重新调用BoundaryXP模型、没有重跑625组端到端实验、没有重算全部3469项查询；11月14日的六项数学见证与费用案例复算仍属于原历史记录。

实际构建覆盖两篇文章及其使用的组件、图片和链接路径，不等同于全站构建或浏览器交互测试。修订提交不代表线上已替换。依现有本地发布说明，正式上线仍由既有发布流程构建完整站点并发布gh-pages后核验原网址。
