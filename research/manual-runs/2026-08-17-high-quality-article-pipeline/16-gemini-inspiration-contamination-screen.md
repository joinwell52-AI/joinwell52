# Gemini 灵感输入污染隔离记录

记录日期：2026-08-18  
结论：**仅吸收选题组织与文章生成方法；未把 Gemini 草稿作为事实来源，未把其四个具体 FCoP 题目纳入本轮入选稿。**

## 已应用的方法

- 母主题与目标读者先行；
- 先画 Series/Topic Map，再逐题做 Article Brief；
- 相邻文章要递进，但每篇保持独立问题、独立承诺、独立证据和独立行动；
- 完稿后检查术语、前后依赖、重复解释、交叉链接和阅读顺序；
- 导航只服务阅读，不代替八/九阶段质量门槛。

## 事实污染隔离

以下内容不得从 Gemini 草稿直接进入选题判断、事实矩阵或公开正文：

1. FCoP 正式名称是 **File-based Coordination Protocol**，不能写成 Filename Coordination Protocol。
2. 本地 FCoP v3 规范锚点使用“Files are the protocol; location defines state; events record history”的状态语义，生命周期目录为 `_lifecycle/{inbox,active,review,done,archive}`；不得采用对话虚构的通用文件名状态字段。
3. IPC envelope 是 `TASK / REPORT / ISSUE / REVIEW`；不得把 `__PENDING__ / __CLAIMED__ / __RUNNING__ / __DONE__` 写成正式 FCoP envelope 或文件名协议。
4. rename 原子性必须限定在同一挂载点/文件系统所保证的语义内，不能推导出“天然无死锁”或“天然并发安全”。
5. Git 历史不能未经额外日志与保留策略证明就等同于完整审计链。
6. 包名、命令、MCP 配置、版本、路线图和完成状态均需以当前 README、spec、代码、测试和公开包状态逐项核验。

## 对本轮成稿的检查结果

- 《Token 不是账单》与 FCoP 无关，事实链来自 Cursor/GitHub/FOCUS/OpenAI 等独立来源。
- 《别让 Agent 立刻写代码——也别盲信它的计划》与 FCoP 无关，事实链来自两项独立研究及其完整材料。
- 两篇均未引用 Gemini 对话、Gemini 草稿或其中任何未核验数字与命令。
- 因而 Gemini 输入没有改变两篇已经通过硬门槛的内容结论，只改变了后续长期选题的组织方式。

