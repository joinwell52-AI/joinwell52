# 两篇治理研究文章图文发布

研究完成于 2026-09-17；图文版本制作于 2026-09-18。本文档记录文章资产与发布检查，不包含私人交流稿或评论台账。

| 文章 | 中文 | English |
|---|---|---|
| 检查检查者 | [在线阅读](https://joinwell52-ai.github.io/joinwell52/zh/research/2026-09-18-checking-the-checker) | [Read](https://joinwell52-ai.github.io/joinwell52/en/research/2026-09-18-checking-the-checker) |
| 规则含义 | [在线阅读](https://joinwell52-ai.github.io/joinwell52/zh/research/2026-09-18-when-rules-change-meaning) | [Read](https://joinwell52-ai.github.io/joinwell52/en/research/2026-09-18-when-rules-change-meaning) |

- [原实验与固定证据](https://github.com/joinwell52-AI/joinwell52/tree/d258d0b925af198f0920fc6e897c390e02979900/research/manual-runs/2026-09-17-six-governance)
- [视觉生产卡与初始提示词](01-visual-briefs.md)
- [配图复核记录](02-visual-review.md)
- [资产哈希](assets-integrity.json)

两篇各包含一张生成式题图，中英文共用相同像素；每篇一张文中图，中文和英文分别制作。确定性 SVG 为文中图源文件，PNG 为便于后续分发的副本。

## 检查结果

- 四篇语言版本均保留来源、实验数字、研究范围、后续问题和固定提交证据链接。
- README 默认折叠目录继续位于深入阅读之后，新增第 71、72 项；研究页通过文章元数据自动收录。
- publication:layout:validate 通过；既有 publication:editorial:validate 通过（该检查主要覆盖候选稿记录，不代替本轮正文人工复核）。
- docs:build 通过，包括严格 VitePress SSR 检查与构建后投影校验。
- 四个页面均经浏览器预览确认图片加载。桌面检查中文第一篇题图；390 像素宽度检查另外三个页面，页面宽度 375，无页面横向溢出。中英文四张文中图均已逐张检查文字及数字。
- 原研究包保持不变；本次不新增实验或开发结论，也不声称重算论文成绩。

发布授权：用户要求“两篇研究稿，你要配图，发GitHub”，并已授权自行检查、修改与发布。本轮执行该授权；没有把编辑复核写成用户对具体像素的批准。
