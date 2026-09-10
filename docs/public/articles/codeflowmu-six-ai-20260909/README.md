# Six AIs, One Task / 六个AI，同一道题

Public article: https://joinwell52-ai.github.io/joinwell52/zh/research/2026-09-09-codeflowmu-six-ai

English: https://joinwell52-ai.github.io/joinwell52/en/research/2026-09-09-codeflowmu-six-ai

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

The published entry pages redirect to the native Research articles. The rendering scripts can regenerate a standalone local export for offline review; that export is not the website publication route. Browser-native image zoom preserves original screenshot pixels. Static Chinese mechanism diagrams are supplied as figures; the chart script rebuilds the four English quantitative figures from the CSV files. This rebuild is not a rerun of the historical AI experiment.

## Rights

Copyright © 2026 joinwell52-AI. All rights reserved. Publicly readable for discussion and citation; other uses follow the website repository's LICENSE.md. This package does not change the private product's source-code license.
