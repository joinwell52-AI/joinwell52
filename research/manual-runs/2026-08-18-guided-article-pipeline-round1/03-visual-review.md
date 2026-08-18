# 三篇文章视觉生产与检查记录

- 检查日期：2026-08-18
- 状态：独立图文终审 PASS；等待用户视觉确认
- 生产范围：三张独立题图、四张解释性文中图
- 生成方式：题图使用 ImageGen；解释图使用确定性 Pillow 渲染脚本 `03-render-explanatory-figures.py`
- 发布状态：未发布

## 方向纠偏

首轮“金属账本、机械轨道、实体原型”的产品隐喻被用户否决，原因是画面偏暗、像产品或化妆品宣传，而且信息元素过碎。最终方向统一改为明亮的未来工程空间，并让每张图只保留一个集中机制：共享文件工作面、路径状态迁移、Cursor 内的交付闭环。被否决的图片不进入候选包。

## 题图 1：文件作为共同工作账本

- 最终文件：`03-visuals/cover-files-first-final.png`
- WebP：`03-visuals/cover-files-first-final.webp`
- 缩略图：`03-visuals/cover-files-first-final-thumb.png`
- 尺寸：1672 × 941；缩略图 320 × 180
- 最终正向生成指令：明亮、连续的未来建筑空间；三名象牙白未来 Agent 紧密围绕同一组大型半透明水蓝文件夹工作；嵌套文件夹是唯一中心主体；一条暖琥珀事件轨迹把不同 Agent 的操作汇入同一事实面；画面无标题、无海报文字、无仪表盘、无装饰性散件。
- 语义：多个 Agent 不是分别对着聊天窗口工作，而是直接读写同一可检查文件工作面。
- 检查：全尺寸主体集中；320px 下三名 Agent、共享文件夹和事件轨迹仍可辨识；无伪文字；亮度与边缘裁切通过。

## 题图 2：路径定义状态，事件记录历史

- 最终文件：`03-visuals/cover-fcop-state-machine-final.png`
- WebP：`03-visuals/cover-fcop-state-machine-final.webp`
- 缩略图：`03-visuals/cover-fcop-state-machine-final-thumb.png`
- 尺寸：1672 × 941；缩略图 320 × 180
- 最终正向生成指令：明亮的未来测试空间；一名未来 Agent 把一块水蓝任务文件移动到五个连续的文件夹形路径框架之间；五个框架保持同一视觉轴线；一条暖琥珀事件轨迹贯穿路径并留下记录；无状态文字、无 UI、无通用节点网络。
- 语义：同一个 TASK 通过位置变化进入新状态，同时保留可检查的迁移事件；题图不声称 exactly-once 或分布式一致性。
- 检查：全尺寸和 320px 下都能读出“一名 Agent、一个 TASK、连续路径状态”；没有把路径画成零碎卡片；无伪文字；对比度与裁切通过。

## 题图 3：Cursor 内的分工与验收

- 最终文件：`03-visuals/cover-cursor-ai-team-final.png`
- WebP：`03-visuals/cover-cursor-ai-team-final.webp`
- 缩略图：`03-visuals/cover-cursor-ai-team-final-thumb.png`
- 尺寸：1672 × 941；缩略图 320 × 180
- 最终正向生成指令：明亮的未来本地开发空间；一名人类开发负责人在一个 Cursor 工作面中组织三名专用未来 Agent，分别围绕同一份 diff、测试与构建证据工作；所有动作收敛到同一条从修改到通过的交付线；官方二维 Cursor 立方体标志只在右上角出现一次；无标题、无大段界面文字、无多个散乱窗口。
- 语义：多个 Cursor Agent 只有围绕同一需求、分离责任并由人最终批准，才构成团队。
- 品牌核对：2026-08-18 访问 Cursor 官方品牌规范 `https://cursor.com/en-US/brand`；使用二维默认标志，仅用于描述 Cursor 操作场景，不暗示官方背书。
- 检查：人、三名 Agent、交付证据和通过状态形成单一中心；320px 下仍可辨；标志只出现一次；无可读伪代码或错误拼写；裁切通过。

## 解释性文中图

### 共同工作账本

- 文件：`03-visuals/figure-shared-working-ledger.png`
- 尺寸：1600 × 900
- 结论：PM、DEV、OPS、QA 写入同一文件／路径／事件事实面；人、Agent、CLI 与 PWA 读取同一事实。底部明确它协调事实，不替代执行或分布式一致性。

### FCoP 生命周期与工件

- 文件：`03-visuals/figure-fcop-lifecycle-and-artifacts.png`
- 尺寸：1600 × 900
- 结论：包含 `_lifecycle/{inbox,active,review,done,archive}` 五个位置和七条合法 TASK 迁移；`REPORT-*` 是执行证据，`REVIEW-*` 是治理判断，二者均不会自行迁移 TASK。

### FCoP 原子提交时序

- 文件：`03-visuals/figure-fcop-atomic-commit.png`
- 尺寸：1600 × 900
- 结论：读取来源 → 内存追加 transition → 写完整目标临时文件 → fsync 临时文件 → `os.replace` 到目标 → 清理来源。图中明确同挂载点语义、文件 fsync 不等于目录持久性、也不推出 exactly-once。

### Cursor 可接受交付链

- 文件：`03-visuals/figure-cursor-accepted-delivery.png`
- 尺寸：1600 × 900
- 结论：需求卡 → PM 拆分 → DEV／OPS／QA → diff、测试与报告 → PM 接收或返工 → PM 最终报告 → 人工批准；EVAL 作为旁路观察，不与 QA 或最终裁决混写。

## 路径与布局检查

- 六篇 staging 正文均使用各自题图；中文与英文共用同一语义资产，但使用各自自然语言 alt 与图注。
- 题图位于候选正文 H1 之前；文中图位于对应论证段落之后。
- 所有文中图均有中英文编号、说明和来源；所有引用路径均落到 `staging/publication-candidates/` 的现存文件。
- `npm run publication:layout:validate`：PASS。

## 独立图文终审

- 文件起步：视觉 9/10，最终 95/100，PASS。
- FCoP 状态机：视觉 9/10，最终 94/100，PASS。
- Cursor 操作手册：视觉 8/10，最终 92/100，PASS。
- reviewer 只读复核，未修改文件；未发现视觉阻断项。

## 待完成

- 用户确认完整双语图文包之前，不进入发布阶段。
