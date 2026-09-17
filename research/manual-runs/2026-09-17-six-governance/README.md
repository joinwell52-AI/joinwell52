# 六位治理研究者：首轮证据包

- [研究报告](00-report.md)：逐人来源、实验、结果、限制与进一步问题。
- [两篇中英研究稿](articles/README.md)：正文已完成；未做题图或论坛分发。
- [文章论证地图](04-article-briefs.md)。
- [固定仓库提交](sources/repositories.json)；[环境版本](results/environment.json)。

## 复跑

建议 Python 3.12，在独立临时目录操作。本包不包含模型密钥，不调用模型，不执行受测工具的业务写入。第一次准备需要网络下载公开仓库、依赖和固定版本数据。上游代码由来源仓库按其许可证提供；本包脚本不复制完整上游源代码或论文全文。

```sh
python -m venv .venv
# Activate .venv using the command appropriate to your OS.
python -m pip install kyvvu-engine==0.11.0 pydantic==2.13.5 pyyaml==6.0.3 ruamel.yaml==0.19.1 numpy==2.5.3 antlr4-python3-runtime==4.13.2 pytest==9.1.1
python bootstrap.py
python probe-mechanisms.py
python probe-datasets.py
python verify-round.py
```

Windows 无需激活时，可将上述 `python` 改为 `.venv/Scripts/python.exe`。MAST 仓库包含较多历史材料，下载时间可能较长；bootstrap 只对这个新下载目录设置操作级长路径选项，不改全局 Git 配置。

`probe-mechanisms.py`：原 Kyvvu 引擎、原技能权限加载与判定、原 AgentSpec 解析/触发模块，以及原样提取的 NumPy 耦合函数。最后一项只提取函数 AST，避免不参与该函数的 Torch/CUDA/WandB 依赖；不冒充完整隐写程序实验。

`probe-datasets.py`：原 Who&When 评分函数、184 条标注结构、31 条限定 AG2 样本，以及固定 Hugging Face 数据下载。`verify-round.py`：分类版本检查、合成评分命令行对照、两个上游定向测试集合。

## 证据完整性与公开边界

输出在 `results/`。发布包的 `INTEGRITY.json` 对公开文件字节计算 SHA-256；重新运行含时延或临时路径的输出，哈希可以变化，数值与语义断言仍应成立。公开输出只将本机临时目录前缀替换为 `<TEMP>`，不改变预测、得分或测试结果。

本包公开研究证据，不包含交流稿、评论回执、账号通知设置台账、上游完整数据副本或 CodeFlowMu 内部评审。没有将上游测试数量、数据样本和我们的小实验相加成总成功率。
