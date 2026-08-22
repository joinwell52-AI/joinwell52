# 视觉制作与检查记录

日期：2026-08-23<br>
状态：**视觉已由用户确认；以下三张题图已冻结。发布仍须另行获得用户明确授权。**

## 题图候选

| 文章 | Brief | 尝试 | 候选资产 | 1600px 检查 | 320px 缩略图检查 | 内部结果 |
|---|---:|---:|---|---|---|---|
| T1《多个 Agent 怎样真正组成团队？》 | V1 | 2 | `03-visuals/cover-team-governance-state-rail-v1.png` | 互锁平面模块、输入与输出路径、紫色核验锚点清楚；无文字或界面 | 输入收束和中央任务计划仍清楚 | **用户已确认，已冻结** |
| T2《任务怎样在 Agent 团队中流转？》 | V2-R1 | 3 | `03-visuals/cover-task-file-state-machine-v3.png` | 同一任务文档在连续阶段槽位中流转；琥珀色副本独立留在上方；无文字或界面 | 中心任务、横向迁移和隔离副本可分辨 | **用户已确认，已冻结** |
| T3《轨道机怎样带动一支 Agent 团队？》 | V3 | 2 | `03-visuals/cover-rail-assistance-boundary-v1.png` | 中央计算内核推进青蓝路径；琥珀决定被送往核心外的授权锚点；无文字或界面 | 主体、执行线与授权锚点可分辨 | **用户已确认，已冻结** |

## 每张图的视觉语义

### T1：治理、文件状态与轨道机

**一个视觉句子**：一束需求与证据流进入一张互锁的数字责任计划，离开时成为一条可追踪的稳定任务路径。

- 中心四块紧密咬合的平面模块是共同责任计划，而不是四个独立面板；
- 青蓝输入流绑定到模块，右下方较细、稳定的青蓝路径表示任务可被追踪地继续；
- 紫色环只表示核验锚点，不替代任务路径；
- 首次生成把中心误画成三个圆形装置，容易误读为产品陈列，已拒绝；第二次仅把中心形态改为互锁平面模块。

### T2：文件状态机

**一个视觉句子**：同一任务文档沿四个连续的文件阶段前进，重复副本被单独留下对账，而不进入前进路径。

- 中央发亮任务文档表示当前任务身份，四个紧密连接的阶段槽位表达文件位置的迁移；
- 青蓝方向从左向右连贯，表达当前合法迁移；
- 琥珀色文档被保留在上方的独立对账位，表达冲突保留而非“选择一份继续”；
- 紫色细线作为只追加迁移历史锚点，大小不与任务主体竞争。

用户指出原 V2 “不清楚”后，原 `v1` 候选已降级为拒绝记录；随后 v2 虽有正确语义但存在异常透明/黑边，也已拒绝。当前 v3 使用了完整不透明画布，并直接表现任务工件跨阶段移动。

### T3：轨道机的自动化边界

**一个视觉句子**：中央计算轨道推进可确认的任务，同时把一枚不确定决定送到轨道之外的独立授权锚点。

- 中央扁平计算内核是轨道对任务事实与技术动作的处理区；
- 青蓝直线表示可确认动作继续前进；
- 琥珀路径垂直离开核心，抵达更小的授权锚点，表达决定不被运行时吞没；
- 第一版中心被生成为高塔式装置，具有建筑/工厂误读风险，已拒绝；第二版改成扁平、紧凑的计算内核。

## 生成提示与可追溯性

工具：内置 ImageGen，逐篇单独生成。提示词只使用各自 Cover Brief 的正向视觉字段；未将文章标题、运行记录或工作流文字放入题图。

| 文章 | 接受候选的提示摘要 | SHA-256 | 尺寸 | 缩略图 |
|---|---|---|---|---|
| T1 | `cyan requirement and evidence braid → interlocking planar digital responsibility plan → stable cyan lineage` | `D5807A1E2143345D84ACD482DCFABE11A21296CCC598DEEB9A6F001D18E4B57D` | 1672×941, 2,200,311 bytes | `cover-team-governance-state-rail-v1.thumb.png` |
| T2 | `task document through four connected phase chambers; contained amber duplicate; violet event history` | `D98D8A7060910D8127DB4CD5C6DA067B9E83A75A0C75CA64D29EDED95EE148D2` | 1672×941, 1,608,238 bytes | `cover-task-file-state-machine-v3.thumb.png` |
| T3 | `flat state-bearing computational rail kernel; cyan confirmable action; amber decision to independent authorization` | `FB1593920D150298BDD91BF576B02830E69FB36BBA63758F38605BBC14FF9591` | 1672×941, 1,987,460 bytes | `cover-rail-assistance-boundary-v1.thumb.png` |

完整的 Cover Brief 在 [03-cover-briefs.md](03-cover-briefs.md)。源图保存在本次运行的 `03-visuals/`，并已镜像到 `staging/publication-candidates/2026-08-22-codeflowmu-rail-state-series/`，但还没有嵌入发布稿或进入发布步骤。

## 文中图

| 文章 | 图 | 作用 | 依据 |
|---|---|---|---|
| T1 | `figure-governance-state-rail.svg` | 说明 TMPA、FCoP 与 CodeFlowMu 的责任分工，不把三者混成一个产品能力 | 已通过的 T1 正文与事实矩阵 |
| T2 | `figure-file-state-and-history.svg` | 区分当前路径、追加迁移历史、REPORT 与验收决定 | 已通过的 T2 正文与事实矩阵 |
| T3 | `figure-rail-decision-boundary.svg` | 区分事实、建议、机械拒绝和业务决定，明确谁能作结论 | 已通过的 T3 正文与事实矩阵 |

三张文中图均为确定性 SVG，所有节点、箭头和术语来自已核验正文；没有把图像模型生成的伪文字用作流程说明。

## 用户确认与冻结

用户在本轮查看三张确认题图后回复“好的”。该确认指向以下精确像素资产，不是一般视觉方向：

- T1：`cover-team-governance-state-rail-v1.png`，SHA-256 `D5807A1E2143345D84ACD482DCFABE11A21296CCC598DEEB9A6F001D18E4B57D`；
- T2：`cover-task-file-state-machine-v3.png`，SHA-256 `D98D8A7060910D8127DB4CD5C6DA067B9E83A75A0C75CA64D29EDED95EE148D2`；
- T3：`cover-rail-assistance-boundary-v1.png`，SHA-256 `FB1593920D150298BDD91BF576B02830E69FB36BBA63758F38605BBC14FF9591`。

任何后续变体必须使用新文件名，不能覆盖以上冻结资产。

## 发布前仍需完成的门禁

1. 将确认的题图和文中图嵌入中英文候选稿并运行文章构建、布局与链接检查；
2. 重新计算含视觉项的最终质量评分；
3. 仅在用户明确批准发布后，才允许进入 Research Center 发布步骤。
