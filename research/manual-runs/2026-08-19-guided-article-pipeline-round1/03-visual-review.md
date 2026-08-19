# 三篇文章视觉终审

日期：2026-08-19

状态：`PASS — Awaiting user visual/package approval`
范围：三张用户已确认题图、三张中文文中图、三张英文对应图，以及六份正文中的引用。

## 结论

三篇文章的视觉包通过语义、构图、文字、裁切、对比度、尺寸与引用路径检查。每篇只保留一张真正降低理解成本的文中图，没有为了数量增加重复流程图。三张题图的精确像素已冻结，不再覆盖。独立最终复核 Round 2 判定六份正文全部 PASS；最低总分 90/100，最低证据 22/25。

## 逐篇检查

| 文章 | 题图语义 | 文中图命题 | 结果 |
|---|---|---|---|
| 两万字需求，怎样拆成 AI 团队能落地的施工图？ | 密集需求流进入由四个任务模块咬合而成的完整数字施工图 | 五步工程链分别标出输入、责任、输出和阻断；规划工件与正式 FCoP 协作工件分层 | PASS |
| 别被“全绿演示”骗了 | 重复通知被中央状态机识别并隔离，只允许一次派工 | TMPA、FCoP、CodeFlowMu 与产品故障测试逐层建立，不能互相代证 | PASS |
| 人离开电脑后，怎样继续掌握 AI 团队？ | PC 保存并运行权威状态；手机查看状态并返回带版本决定 | 手机请求必须回到本地权威服务复核；任务 REVIEW 与高风险操作批准分离 | PASS |

## 题图冻结记录

| 资产 | 尺寸 | SHA-256 | 用户状态 |
|---|---:|---|---|
| `03-visuals/cover-taskbook-to-task-graph.png` | 1672×941 | `4C547CA85EB5D04339D26E913D27B8AE2E6DBC3E10E23F048BF2F57AF705FBCE` | 明确确认 |
| `03-visuals/cover-fault-injection-dispatch.png` | 1672×941 | `57DC294629C298C3F5F3B7232201F444E13EEF2A663B387F1F165ABBD63FBF5B` | 明确确认 |
| `03-visuals/cover-local-runtime-mobile-control.png` | 1672×941 | `A5E0B55405140C1C848B28B6E87072831756847DBF4491E745681DD0D3E0F2D6` | 明确确认 |

三图均接近标准 16:9；题图标签逐一检查，无错误拼写、伪文字或水印。320×180 缩略图已检查，主体未被裁断，核心关系仍可辨认。

## 文中图记录

| 资产 | 尺寸 | SHA-256 |
|---|---:|---|
| `03-visuals/figure-taskbook-five-stage-pipeline.zh.png` | 1600×900 | `6AE5B76B84D71B1D27EFFEEA6F6E2F840F399A79BA5DA480ED53CC438A52D295` |
| `03-visuals/figure-taskbook-five-stage-pipeline.en.png` | 1600×900 | `F72D438B94B921DB3D6C6137A6E43400AAE30E87CADBC9FFD8AA83EC60DA6197` |
| `03-visuals/figure-governance-to-fault-testing.zh.png` | 1600×900 | `268CC6FD3E478A1D2830FA595F320BBDFE8197AA6F08CFE5DDB8594D554B11E1` |
| `03-visuals/figure-governance-to-fault-testing.en.png` | 1600×900 | `3648C35D5AF7701C5EEFCF98B44DC444F6A211E54D61F0DA7440F797A9D4DC25` |
| `03-visuals/figure-mobile-decision-boundary.zh.png` | 1600×900 | `6CF2D80A1DC16291169FF41CCE12AB6F2508724AECC903A1CB3D96B605536C79` |
| `03-visuals/figure-mobile-decision-boundary.en.png` | 1600×900 | `015AB1CF9979864B53FC8AB50458BD3D3155962DAAB9E0D342BE2FBAF4F19485` |

文中图文字逐项人工目视检查；未发现裁切、溢出或低对比文字。英文图不是把中文 PNG 直接复用，而是使用同一命题与构图重新排字，避免英文正文中出现中文说明。

## 引用与版面检查

- 六份正文各引用一张题图和一张本语言文中图，共 12 条图片引用；逐条解析均存在。
- 2026-08-19 逐一访问六份正文中的 27 个不重复外部 URL，最终响应均为 HTTP 200；仓库固定提交链接、Research Center 论文、W3C、POSIX、Cursor、arXiv 与独立论文链接均可达。
- 题图位于 H1 之后，不编号；文中图在每篇内编号为图 1 / Figure 1。
- 每张文中图都有命题型替代文本、图注与来源范围；图注不把设计目标写成已完成实验。
- 题图三篇分别形成“需求编译”“故障裁决”“双端控制”三个视觉身份，没有模板化复用同一场景。
- SVG 为可维护源文件，PNG 为文章实际引用资产；二者语言和语义一致。

## 仍存边界

- 图 1 是解释性模型，不代替正文中的规范、代码与实验来源。
- 第二篇的 12 项故障场景仍是测试清单；图片明确区分了 TMPA 一致性证据与待完成的产品故障验证。
- 第三篇的操作批准流程是目标边界说明；图片和图注均明确没有声称当前手机 API 已完整实现客户端版本与幂等合同。
