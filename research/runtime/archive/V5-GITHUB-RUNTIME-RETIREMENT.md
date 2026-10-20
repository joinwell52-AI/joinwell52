# GitHub Runtime V5 退役记录

V5 最后正式公开运行日固定为 **2026-09-18**。历史基线为 `d4e150e608590451ee16e833e6e5da160a77d943`。

V6 由本地研究 Runtime 统一调度、认领、执行、恢复、验证和归档。GitHub 只接收经过本地验证的公开成果及同批附带的公开快照。公开页面不是实时控制面，不能据其状态决定本地任务准入。

2026-09-19 至 V6 正式启用日前不补造 Runtime 数据。历史页面保留原日期与原状态；未完成的历史阶段不会被改写成已完成。

## 退役的 20 个工作流

- deploy-research-center-pages.yml
- diagnose-20260818-production-stage.yml
- execute-20260816-publication.yml
- execute-20260817-publication-retry.yml
- execute-20260817-publication.yml
- execute-20260818-publication.yml
- execute-governed-publication.yml
- recover-20260815-production.yml
- recover-20260815-publication.yml
- repair-saaw-cover.yml
- research-production-rework.yml
- research-runtime-production-actions-bridge.yml
- research-runtime-scheduler.yml
- research-runtime-shift-completion.yml
- research-runtime-shift-verification.yml
- research-runtime-worker-claim.yml
- runtime-markdown-sync.yml
- sync-20260815-publication-build-generated.yml
- tmp-rewrite-saaw-workday.yml
- validate-site.yml

原脚本与历史数据保留作档案，不再参与 Runtime admission，也不再由 GitHub 自动运行。网站验证与构建全部由本地执行。

## 原样保留的 7 个工作流

- chinese-layer-cache.yml
- chinese-layer-mail-candidate-test.yml
- chinese-layer-mail-preview.yml
- chinese-layer-mobile-test.yml
- chinese-layer-production-check.yml
- test-drive-originals.yml
- wp13-attachment-notify.yml

这些工作流属于 Chinese Layer 或其他独立项目，不属于本次研究 Runtime 退役范围。

## 公开同步规则

没有公开成果时不提交、不推送；公开快照不单独触发同步。多个公开成果合并为一次源码提交、一次 main 推送和一次受控网页发布。main 禁止强制推送。源码已发布而网页失败时只重试网页发布。

GitHub 故障只使公开同步等待重试，本地研究继续运行。V5 档案与 V6 公开快照在中英文原有运行中心地址展示。
