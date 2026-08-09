# Publication Visibility Gate V1.0 — 公开可发现性交付门禁

**生效日期：** 2026-08-09  
**适用：** Research Report Production Engine V2.0 / Runtime Center V5.0  
**目的：** 禁止“后台发布成功，但用户找不到文章”。

## 1. Publication 的完成语义

Publication 的工作成果提交为 `Completed`，不再等价于公共交付已经完成。公共交付必须同时满足：

```text
Publication Result Completed
→ Release Manifest = Released
→ 中英文源文章存在
→ VitePress 中英文文章路由生成
→ 中英文网站首页可发现
→ Research 总入口可发现
→ 对应栏目入口可发现
→ 必需封面/可视化资产存在
→ Pages Build 成功
→ Publication Visibility Gate PASS
→ Publish gh-pages
→ GitHub Pages deployment success
```

任何一步失败，都不得更新 `gh-pages`。

## 2. Visibility Gate

正式检查器：

```text
scripts/publication-visibility.mjs
```

它读取最新：

```text
research/runtime/releases/YYYY-MM-DD-publication.json
```

对每个 `releasedItems[]` 检查：

- 中文源文件存在；
- 英文源文件存在；
- 中文公开 HTML 路由存在；
- 英文公开 HTML 路由存在；
- 中文与英文公共首页能发现文章；
- `/zh/research/` 与 `/en/research/` 能发现文章；
- 对应数字员工 / 行业架构 / 开源工程栏目页能发现文章；
- Release Manifest 指定的封面存在。

Gate 失败时 Pages Verify 必须失败，`Publish gh-pages branch` 必须被跳过。

## 3. 今日发布入口

网站首页与观察笔记首页均增加 `TodayPublished` 展示层。当天 `category: daily` 的正式文章直接显示为“今日发布”，包括：

- 当前日期；
- 当天发布数量；
- 栏目；
- 标题；
- 摘要；
- 文章直接入口。

历史列表仍按日期倒序保留，但当天交付不再依赖用户从历史列表中自行寻找。

## 4. 2026-08-09 首次生产验证

首次 Visibility Gate 因错误假设 VitePress clean URL 产物为 `slug/index.html` 而主动失败并阻止发布。确认本站 `cleanUrls: true` 的实际构建产物为 `slug.html` 后修复 Gate。

随后 Pages Run #235 完整通过初版 Research/栏目 Gate。进一步把网站首页纳入正式发现面后，Pages Run #242 再次完整通过：

```text
Build VitePress site: success
Verify generated site: success
Publication Visibility Gate: PASS
Publish gh-pages branch: success
```

最终 Gate 输出确认：

```text
PASS 2026-08-09: 3 released items are routable and discoverable from home, Research and column indexes in both languages.
```

因此当天三篇文章不仅存在公开路由，也必须同时出现在中英文首页、Research 总入口和对应栏目入口的生成结果中。

## 5. 不变量

> **用户无法从正式公共入口找到的文章，不算公共交付完成。**

这条规则与 Runtime 顺序门禁、Running Lease、Completion-driven reconcile 同级，属于 Research Report Production Engine V2.0 的正式生产约束。
