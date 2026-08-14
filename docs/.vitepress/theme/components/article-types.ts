export const articleTypes: Record<string, { en: string; zh: string }> = {
  'research-brief': { en: 'Research Brief', zh: '研究简报' },
  'technical-analysis': { en: 'Technical Analysis', zh: '技术分析' },
  'engineering-insight': { en: 'Engineering Insight', zh: '工程洞察' },
  'comparative-study': { en: 'Comparative Study', zh: '比较研究' },
  'experiment-report': { en: 'Experiment Report', zh: '实验报告' },
  'case-study': { en: 'Case Study', zh: '案例研究' },
  'research-note': { en: 'Research Note', zh: '研究札记' },
  'project-research': { en: 'Project Research', zh: '项目研究' },
  'perspective': { en: 'Perspective', zh: '研究观点' }
}

export function articleTypeLabel(articleType: string | undefined, chinese: boolean) {
  if (!articleType) return ''
  const item = articleTypes[articleType]
  if (!item) return articleType
  return chinese ? item.zh : item.en
}
