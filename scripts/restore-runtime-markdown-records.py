from pathlib import Path
import json

ROOT = Path(__file__).resolve().parents[1]


def replace_once(path: Path, old: str, new: str) -> None:
    text = path.read_text(encoding='utf-8')
    if old not in text:
        raise SystemExit(f'expected block not found in {path.relative_to(ROOT)}')
    path.write_text(text.replace(old, new, 1), encoding='utf-8')


component = ROOT / 'docs/.vitepress/theme/components/RuntimeOperationsCenterClassic.vue'
replace_once(
    component,
    """const recordPath = (item: RecordItem) => {\n  const [year, month] = item.date.split('-')\n  return `research/runtime/records/daily/${year}/${month}/${item.date}-daily-runtime.json`\n}\n""",
    """const recordPath = (item: RecordItem) => {\n  const [year, month] = item.date.split('-')\n  return `research/runtime/${year}/${month}/${item.date}-runtime.md`\n}\n"""
)

scheduler = ROOT / '.github/workflows/research-runtime-scheduler.yml'
replace_once(
    scheduler,
    """      - name: Validate four Runtime systems\n        run: npm run runtime:validate\n""",
    """      - name: Synchronize readable Runtime ledger\n        shell: bash\n        env:\n          RUNTIME_DATE: ${{ steps.runtime.outputs.runtime_date }}\n        run: node scripts/runtime-markdown.mjs render --date \"$RUNTIME_DATE\"\n\n      - name: Validate four Runtime systems\n        run: |\n          npm run runtime:validate\n          node scripts/runtime-markdown.mjs validate --date \"${{ steps.runtime.outputs.runtime_date }}\"\n"""
)
replace_once(
    scheduler,
    """          git add research/runtime/records research/intelligence\n""",
    """          git add research/runtime/records research/runtime/[0-9][0-9][0-9][0-9] research/intelligence\n"""
)

package_path = ROOT / 'package.json'
package = json.loads(package_path.read_text(encoding='utf-8'))
scripts = package.setdefault('scripts', {})
scripts['runtime:markdown'] = 'node scripts/runtime-markdown.mjs render --all'
scripts['runtime:markdown:validate'] = 'node scripts/runtime-markdown.mjs validate --all'
package['version'] = '9.0.5'
package_path.write_text(json.dumps(package, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')

sync_workflow = ROOT / '.github/workflows/runtime-markdown-sync.yml'
sync_workflow.write_text("""name: Synchronize Runtime Markdown Ledger

on:
  push:
    branches:
      - main
    paths:
      - 'research/runtime/records/daily/**/*.json'
  workflow_dispatch:

permissions:
  contents: write

concurrency:
  group: runtime-markdown-ledger-sync
  cancel-in-progress: false

jobs:
  synchronize:
    name: Synchronize human-readable Runtime records
    runs-on: ubuntu-latest
    steps:
      - name: Checkout authoritative main branch
        uses: actions/checkout@v4
        with:
          ref: main
          fetch-depth: 0

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 22

      - name: Render all V5 Daily Runtime ledgers
        run: |
          node scripts/runtime-markdown.mjs render --all
          node scripts/runtime-markdown.mjs validate --all

      - name: Commit synchronized ledgers
        shell: bash
        run: |
          git config user.name "joinwell52 Research Runtime"
          git config user.email "actions@users.noreply.github.com"
          git add research/runtime/[0-9][0-9][0-9][0-9]

          if git diff --cached --quiet; then
            echo "Readable Runtime ledgers are already synchronized."
            exit 0
          fi

          git commit -m "runtime: synchronize human-readable Runtime ledger"

          for attempt in 1 2 3; do
            if git pull --rebase origin main && git push origin HEAD:main; then
              exit 0
            fi
            git rebase --abort || true
            if [[ "$attempt" -eq 3 ]]; then
              echo "Unable to publish synchronized Runtime ledgers after three attempts."
              exit 1
            fi
            sleep $((attempt * 5))
          done
""", encoding='utf-8')

readme_zh = ROOT / 'research/runtime/README.zh-CN.md'
replace_once(
    readme_zh,
    """V4 历史记录保留在原路径并冻结，不改写成 V5 记录。\n""",
    """V4 历史记录保留在原路径并冻结，不改写成 V5 机器记录。\n\n每一份 Daily Runtime JSON 必须同时维护同日的人类可读运行账本：\n\n```text\nresearch/runtime/YYYY/MM/YYYY-MM-DD-runtime.md\n```\n\nJSON 是机器事实源；Markdown 是不可缺失的人类可读账本。Markdown 必须逐时点保留执行槽打开、Running、阶段成果、Completed/Blocked/Failed/Skipped、GitHub Commit Verify 等完整时间线，并展示每个班次的 Input、Work Result、Output、Next、Metrics、Evidence 与 Artifacts。网站“查看记录”必须链接 Markdown，不得直接把机器 JSON 作为主要阅读页面。\n"""
)

readme_en = ROOT / 'research/runtime/README.md'
if readme_en.exists():
    text = readme_en.read_text(encoding='utf-8')
    section = """\n## Mandatory human-readable Daily Runtime ledger\n\nEvery Daily Runtime JSON record must have a same-day human-readable ledger:\n\n```text\nresearch/runtime/YYYY/MM/YYYY-MM-DD-runtime.md\n```\n\nJSON is the machine source of truth; Markdown is the mandatory human-readable ledger. The Markdown ledger must preserve every execution-slot opening, Running transition, stage result, terminal status, and commit-verification timepoint, together with Input, Work Result, Output, Next, Metrics, Evidence, and Artifacts for every shift. Website “View record” links must target Markdown rather than the machine JSON.\n"""
    if '## Mandatory human-readable Daily Runtime ledger' not in text:
        readme_en.write_text(text.rstrip() + '\n' + section, encoding='utf-8')
