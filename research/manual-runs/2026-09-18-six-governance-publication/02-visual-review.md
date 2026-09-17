# 配图复核

## 题图

| 项目 | checker-v1 | rules-v1 |
|---|---|---|
| 尝试次数 | 初次生成 1 次、定向编辑 1 次 | 初次生成 1 次、定向编辑 1 次 |
| 首轮不通过原因 | 背景生成了未要求的英文口号 | 文档及背景生成了未要求的英文口号 |
| 定向修正 | 恢复纯色石面，保留主体和勾叉 | 恢复纯色材质，保留括号与勾选文件 |
| 接受资产 | checking-the-checker.cover-v1.png | when-rules-change-meaning.cover-v1.png |
| 原图检查 | 同一证据册的通过判断与独立复核矛盾；无多余文字 | 空列表展开为允许的文件决定；无多余文字 |
| 320×180 | 勾、掀开的紫色证据层、琥珀叉清晰 | 空括号、展开的文档与琥珀勾选文件清晰 |
| 比例 | 1600×900，16:9 | 1600×900，16:9 |
| 编辑决定 | 通过 | 通过 |

两图均通过内置 imagegen 制作，非代码绘制题图。保存于 docs/public/assets/six-governance-20260918/。钴蓝为声明/原判断，琥珀为冲突，第一图紫色为独立证据；暖白空间和柔和日光与既有视觉语言一致。

去重：第一篇为竖向证据册与揭层复核；第二篇为横向连续文档与解释展开，主体、动作、空间结构、观看角度不同。与近期备份文章的重复副本堆叠也有不同的主要动作与结果。

这些是编辑审核通过的版本；尚未获得用户对具体像素的单独确认，不虚构用户批准。

## 定向编辑的完整提示词

### checker-v1

Preserve the exact central cobalt folio, violet peeling evidence layer, amber cross, check, lighting, viewpoint and composition. Restore both background pillars to completely plain, uninterrupted warm ivory stone surfaces. The left and right pillars have smooth natural stone texture across their full faces. All background surfaces are pure architectural material. The check and cross on the folio remain the only semantic marks in this image. Deliver the same wide 16:9 editorial cover.

### rules-v1

Preserve the central cobalt document ribbon, inset empty square brackets, amber checked folder, exact perspective and lighting. Restore every stone pillar, floor and corner area to uninterrupted plain warm ivory material. Restore every cobalt ribbon surface to uninterrupted clear cobalt optical glass apart from the single existing bracket pair. The only semantic marks in the entire composition are the inset empty square brackets and the single check on the amber folder. The rest of the image consists entirely of plain glass and plain stone surfaces, natural reflections and daylight. Retain the same wide composition and 16:9 framing.

## 文中图

- checking-the-checker.figure.zh/en：逐项核对原入口结果中的两个合成样本、100% 与 50%。首轮英文大数字与解释行距离不足，已调整并重新渲染检查。图内、图注同时说明不代表论文重算。
- when-rules-change-meaning.figure.zh/en：仅抽取六个对照中的三个，绑定 tainted、fresh_engine_same_ids、restored_history，决定分别为 block、allow、block；没有暗示实际发送或托管恢复事故。
- 四张均使用确定性 SVG；PNG 副本由 sharp 渲染。中英文数字与实验边界一致。
