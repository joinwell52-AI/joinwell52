# P2 专项研究审稿中心（本地）

该页面只用于本地查看和人工审核 P2 专项研究稿件，不进入 GitHub Pages，也不会自动发布文章。

## 启动

在仓库根目录 `D:\TMPA\joinwell52` 执行：

```bash
npm run p2:review
```

看到以下提示即表示启动成功：

```text
P2 internal review center: http://127.0.0.1:4174
```

浏览器访问：<http://127.0.0.1:4174/>

服务会持续占用当前终端。按 `Ctrl+C` 停止服务。再次使用时需要重新运行启动命令。

## 页面内容

- 当前上海日期与时间；
- 数据刷新时间；
- 下次 P2 周检查时间（每周日 20:30，`Asia/Shanghai`）；
- P2 对象、待审稿件、周检查记录；
- 中英双语研究规则；
- 人工审核结论与审核时间。

## 可选端口

默认端口为 `4174`。如端口被占用，可在启动前设置 `P2_REVIEW_PORT` 环境变量，再运行 `npm run p2:review`。

## 数据边界

- 研究规则：`research/intelligence/P2-SPECIAL-STUDY-CONTRACT.md`
- 专项报告：`research/intelligence/p2-studies/`
- 审核记录：`research/intelligence/p2-reviews/`
- 周检查记录：`research/intelligence/p2-runs/`

审核操作会写入本地审核记录，并重新生成 P2 状态投影；不会直接发布到官网。
