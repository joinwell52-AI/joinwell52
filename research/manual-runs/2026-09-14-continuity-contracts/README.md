# 连续性需要分别验证：9 月 13—14 日联合研究

两天十四组雷达拆为十五个工程议题，固定十三个 PR 与三个提交。来源状态以 `sources/index.json` 的读取时刻为准，不代表最新合并状态。

- [来源审计](01-source-audit.md)：十五个议题及判断修正。
- [实验](02-experiments.md)：原始失败、通过结果与未验证范围。
- [开发评审](03-development-review.md)：READY_FOR_REVIEW；评审优先级不是产品缺陷判定。
- [内容自检](05-quality-review.md)；[视觉审查](covers/review.md)。

| 本地检查 | 对照 | 固定候选 |
| --- | --- | --- |
| Agy 原 dispatcher：五场景 | 三失败、两通过 | 五通过 |
| SDK 原测试：仅替换 clear 方法 | 四失败、一通过 | 五通过 |
| Paperclip 原说明选择器：七输入 | 两种普通恢复选简短标识 | 对应输入选当前完整说明 |
| 额度与辅助策略：十一个单测 | 未做双版本对照 | 十一通过，其中七项额度策略 |

CLI 与远端压缩为替身；SQLite 提交与本地子进程真实执行。Paperclip 使用已规范化输入替身，没有数据库目标选择、真实恢复、真实额度或外部副作用实验。历史 152 次审计属于上游观察。

## 复跑

环境：Node 24.16.0、Python 3.12.10、Git、tar、uv；SDK 为完整固定源码。依赖实测版本见 `runs/environment.json`。以下在本目录执行；复跑会更新结果文件，原发布日志已由 Git 固定。

```sh
node verify.mjs
node fetch-code.mjs
node verify.mjs --sources
node setup-sdk.mjs
uv venv --python 3.12 .venv
uv pip install --python .venv/Scripts/python.exe -e external/sdk-pinned pytest pytest-asyncio pytest-mock inline-snapshot
.venv/Scripts/python.exe probe-dispatch.py
.venv/Scripts/python.exe probe-sdk.py
node probe-brief.mjs
```

Linux/macOS 将 `.venv/Scripts/python.exe` 换成 `.venv/bin/python`。安装命令解析到的依赖可能随时间变化；比较环境记录后再解释差异。`verify.mjs` 核对已保存观察与哈希，不运行实验，不证明实验覆盖之外的性质。SDK 对照故意产生失败，子进程退出码与断言保存在日志。

题图由文章语义生成并人工式视觉检查；文中图由 `build-figures.mjs` 按已保存观察排版。图像不是新增实验数据。交流稿、评论台账与回执仅在本地保存，不包含在此包。
