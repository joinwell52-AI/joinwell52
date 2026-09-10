# Six AIs, One Task / 六个AI，同一道题

Public article: https://joinwell52-ai.github.io/joinwell52/articles/codeflowmu-six-ai-20260909/index.html

English: https://joinwell52-ai.github.io/joinwell52/articles/codeflowmu-six-ai-20260909/en.html

Runs: 2026-09-09. Article: 2026-09-10. Test system: CodeFlowMu V2.2.9 / FCoP.

This public article package is independent of the private CodeFlowMu implementation repository. Selected source and evidence excerpts are disclosed for explanation. Full private logs, configuration and credentials are not included. See sources.html / sources.en.html for disclosure boundaries and attachment languages.

公开文章、双语正文、图片和附件独立于CodeFlowMu私有实现仓库。完整原始日志与配置不公开；来源说明区分公开摘录、分析和私有原件标识。

## Rebuild the web pages

Use Python 3.12+ with Pillow and Matplotlib. The Markdown sources are the editorial inputs. Run:

```sh
python build-public-charts.py
python build-source-pages.py
python build-web-preview.py
python build-web-preview.py --en
python -m http.server 8000
```

Open http://localhost:8000/index.html or en.html. Browser-native image zoom preserves original screenshot pixels. Static Chinese mechanism diagrams are supplied as figures; the chart script rebuilds the four English quantitative figures from the CSV files. This rebuild is not a rerun of the historical AI experiment.

## Rights

Copyright © 2026 joinwell52-AI. All rights reserved. Publicly readable for discussion and citation; other uses follow the website repository's LICENSE.md. This package does not change the private product's source-code license.
