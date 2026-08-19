# 题图成功经验与冻结记录

日期：2026-08-19
状态：三篇题图均已获用户明确确认并冻结。

## 1. 第一篇：长需求生成数字施工图

- 文章：《两万字需求，怎样拆成 AI 团队能落地的施工图？》
- 冻结资产：`03-visuals/cover-taskbook-to-task-graph.png`
- SHA-256：`4C547CA85EB5D04339D26E913D27B8AE2E6DBC3E10E23F048BF2F57AF705FBCE`
- 用户确认：用户明确指出该版本“可以”。
- 成功语义：长需求的大线束直接进入一张完整数字施工图，并在其中分配到四个紧密咬合的任务模块。
- 成功原因：模块群是唯一主体；线束虽有视觉重量但仍服务于中心；拼图边界表达依赖；`TASK 01–04` 正确；未来感来自透明计算结构而非机器人或机械设备。
- 关键经验：标题中的多个概念不需要分散成多个对象，可以收进一个完整的数字工件中。

### 最终生成提示

```text
Use case: stylized-concept. Asset type: 16:9 premium editorial technology cover. A beautiful luminous digital construction blueprint floats as the single central sculpture in a vast warm-white future space. Four large translucent crystalline task modules interlock tightly like refined jigsaw pieces, forming one complete unified plan with softly rounded precision, elegant depth and iridescent cyan edges. Typography consists of four small exact labels integrated cleanly into the glass: "TASK 01", "TASK 02", "TASK 03", "TASK 04". From the left, one majestic cobalt stream of thousands of silky requirement-data filaments sweeps toward the sculpture in a graceful curve. Near the blueprint it separates fluidly into four coherent ribbons, each ribbon weaving directly into one task module and becoming visible light paths inside the crystal. A subtle cyan intelligence field shapes the division and flows continuously through the joined seams. Restrained amber pulses travel across the interlocking boundaries, revealing dependency and progress. The whole event is one concentrated elegant composition with strong negative space, sculptural clarity, soft volumetric sunlight, fine glass refraction, flowing energy, imaginative future-computing beauty and a striking silhouette at thumbnail scale.
```

## 2. 第二篇：重复通知只产生一次派发

- 文章：《别被“全绿演示”骗了：怎样用故障注入，测出一个真正靠谱的 AI Agent 调度系统？》
- 冻结资产：`03-visuals/cover-fault-injection-dispatch.png`
- SHA-256：`57DC294629C298C3F5F3B7232201F444E13EEF2A663B387F1F165ABBD63FBF5B`
- 用户确认：用户明确指出该版本“正确”。
- 成功语义：同一任务通知被故障注入器复制；正常蓝色路径与故障橙红路径进入同一个调度状态机；重复通知被隔离，只产生一次 Agent 派发。
- 成功原因：选用了正文中的具体故障场景；中央状态机最大；下游 Agent 缩小；正常与异常颜色从分叉到结果保持一致；`TASK 001`、`DUPLICATE`、`1 DISPATCH` 三个标签准确。
- 关键经验：画“怎样测试”时，应表现故障输入和可检查裁决，而不是抽象爆炸、撞击或复杂轨道。

### 最终修订链

1. 基础构图：任务信号分成两条通知，重复项进入隔离区，只输出一次派发。
2. 颜色修订：正常路径保持钴蓝；故障复制路径从分叉点起改为橙红并进入 `DUPLICATE`。
3. 比例修订：中央状态机放大约 25%；右侧 Agent 缩小约 25%，用视觉尺寸表达裁决权和执行责任。

## 3. 第三篇：本地 PC 与手机控制面

- 文章：《人离开电脑后，怎样继续掌握 AI 团队？本地运行与手机控制面的双端设计》
- 冻结资产：`03-visuals/cover-local-runtime-mobile-control.png`
- SHA-256：`A5E0B55405140C1C848B28B6E87072831756847DBF4491E745681DD0D3E0F2D6`
- 用户确认：用户明确指出该版本“可以”。
- 成功语义：本地 PC 运行 Agent 团队并保存权威状态；手机显示同一状态；蓝色状态流向手机，金色带版本决定返回 PC 权限点。
- 成功原因：两端直接使用文章真实讨论的 PC 与手机；设备采用相同玻璃材质、圆角、透视和基线；PC 更大但手机仍有足够视觉重量；两条信息流颜色和方向明确。
- 关键经验：真实双端文章不应使用“抽象核心 + 真实设备”的混合视觉语言；端点形态统一后，语义和构图会同时变清楚。

### 最终生成提示

```text
Use case: stylized-concept. Asset type: 16:9 premium editorial technology cover. A bright elegant dual-device future-computing scene with one local PC on the left and one smartphone on the right, both designed in the same refined family of translucent rounded glass, white-silver edges, matching corner radius, matching perspective and the same baseline. The PC is larger and occupies about fifty-five percent of the visual weight; the phone occupies about twenty-eight percent, creating calm balance. The PC carries the exact small label "LOCAL PC". Inside the PC display, three compact abstract computational agents—cobalt code structure, cyan execution pulse and violet evidence ring—work closely around one shared golden task-state nucleus. The phone display shows only a simplified luminous reflection of that same nucleus. A short cobalt stream labeled exactly "STATE VIEW" travels from the PC toward the phone. A short amber stream labeled exactly "VERSIONED DECISION" returns from the phone to one visible permission point on the PC. Both streams stay close between the devices and form one unified composition. Warm-white open background, subtle floor reflection, clear glass, restrained cobalt, cyan, violet and amber, imaginative sophisticated editorial concept art, minimal internal detail, strong shape harmony and immediate thumbnail clarity.
```

## 4. 提升为全局规则

以上经验已经写入：

- `research/editorial/EDITORIAL-VISUAL-STANDARD.md` 第 13 节；
- `research/editorial/COMMUNITY-TECHNICAL-WRITING-STANDARD.md` 的视觉入口继续引用全局视觉标准。

后续题图必须先应用这些规则，再生成单篇 Brief。
