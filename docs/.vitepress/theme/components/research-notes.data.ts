import { createContentLoader } from 'vitepress'

export type ResearchColumn =
  | 'digital-employee'
  | 'industry-architecture'
  | 'open-source-engineering'

export type ResearchCategory = 'daily' | 'weekly' | 'academic'
type SourceResearchCategory = ResearchCategory | 'manifesto'

export interface ResearchNoteRecord {
  title: string
  date: string
  column: ResearchColumn
  category: ResearchCategory
  summary: string
  url: string
  lang: 'en' | 'zh'
}

const columns = new Set<ResearchColumn>([
  'digital-employee',
  'industry-architecture',
  'open-source-engineering'
])

const sourceCategories = new Set<SourceResearchCategory>(['daily', 'weekly', 'academic', 'manifesto'])

const displayCategory = (category: SourceResearchCategory): ResearchCategory =>
  category === 'manifesto' ? 'daily' : category

export default createContentLoader('**/*.md', {
  excerpt: false,
  transform(rawData): ResearchNoteRecord[] {
    return rawData
      .filter(({ frontmatter }) => {
        return Boolean(
          frontmatter.title &&
          frontmatter.date &&
          columns.has(frontmatter.column) &&
          sourceCategories.has(frontmatter.category)
        )
      })
      .map(({ url, frontmatter }) => ({
        title: String(frontmatter.title),
        date: String(frontmatter.date),
        column: frontmatter.column as ResearchColumn,
        category: displayCategory(frontmatter.category as SourceResearchCategory),
        summary: String(frontmatter.summary || frontmatter.description || ''),
        url,
        lang: url.startsWith('/zh/') ? 'zh' : 'en'
      }))
      .sort((a, b) => {
        const byDate = b.date.localeCompare(a.date)
        return byDate || a.title.localeCompare(b.title)
      })
  }
})
