# 读者反馈修订：引用与可理解性

日期：2026-08-18

## 触发反馈

用户指出公开文章“没有引用，读起来摸不着头脑”。复核确认：原稿虽然在正文中链接了来源名称，但缺少醒目的编号引用、集中参考文献和面向非专家的术语入口。

## 修订内容

1. 中英文稿新增白话导读，把核心问题解释为两本可检查的账：Agent 实际做了什么，以及 evaluator 如何把运行判成分数。
2. 明确定义 `trace`、`evaluator` 与 `Oracle`，并声明不要求保存隐藏思维过程。
3. 在关键数字、事实和局限段后增加醒目的 `[1]`–`[8]` 行内引用。
4. 新增“参考文献与证据边界”，逐条写明每个来源支持和不支持的主张。
5. 明确“两条执行链、八类工件、先验证 evaluator”是 Research Center 的跨来源工程综合，而非单篇论文结论或既成行业标准。
6. 拆开 EvalAgent 的两个实验口径：Sonnet 4.5 下 B1 17.5% 与 EvalAgent 65.0% 是 §4、表 5 的 `Eval@1`；79.5% 是 §3.3、表 3 的 EvalAgent 与 B4 专家比较。

## 来源复核

2026-08-18 重新访问并核验四篇论文、OpenAI 官方审计与三个工程仓库。PDF 方法、结果、表格和局限口径继续以阶段 3 阅读笔记与事实矩阵为准。

## 独立编辑复核

- 首轮：`NEEDS REVISION`。要求给三个局限段补就近引用，并拆清 EvalAgent 两个实验的表格与比较对象。
- 修订后复核：`PASS`。

## 构建与门禁

- `git diff --check`：PASS
- `npm run publication:layout:validate`：PASS
- `npm run publication:editorial:validate`：PASS
- `npm run docs:build`：PASS

中英文公开稿和本地 staging 候选稿已同步修订。发布路径不变。
