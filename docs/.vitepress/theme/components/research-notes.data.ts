import { createContentLoader } from 'vitepress'

export type ResearchColumn =
  | 'digital-employee'
  | 'industry-architecture'
  | 'open-source-engineering'

export type ResearchCategory = 'daily' | 'weekly' | 'academic'
type SourceResearchCategory = ResearchCategory | 'manifesto' | 'visual-essay'

export interface ResearchNoteRecord {
  title: string
  date: string
  column: ResearchColumn
  category: ResearchCategory
  summary: string
  cover?: string
  thumbnail?: string
  url: string
  lang: 'en' | 'zh'
  articleType?: string
}

const columns = new Set<ResearchColumn>([
  'digital-employee',
  'industry-architecture',
  'open-source-engineering'
])

const sourceCategories = new Set<SourceResearchCategory>(['daily', 'weekly', 'academic', 'manifesto', 'visual-essay'])

const displayCategory = (category: SourceResearchCategory): ResearchCategory =>
  category === 'manifesto' || category === 'visual-essay' ? 'daily' : category

const articleCoverImage = (src: string | undefined) => {
  if (!src) return undefined
  const articleCoverTag = src.match(/<ArticleCover\b[\s\S]*?>/)?.[0]
  return articleCoverTag?.match(/\bimage\s*=\s*["']([^"']+)["']/)?.[1]
}

const articleCoverThumbnail = (cover: string | undefined) => {
  if (!cover?.startsWith('/assets/covers/')) return cover
  const basename = cover.split('/').pop()?.replace(/\.[^.]+$/, '')
  return basename ? `/assets/cover-thumbnails/${basename}.webp` : cover
}

export default createContentLoader('**/*.md', {
  includeSrc: true,
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
      .map(({ url, frontmatter, src }) => {
        const cover = frontmatter.cover ? String(frontmatter.cover) : articleCoverImage(src)
        return {
          title: String(frontmatter.title),
          date: String(frontmatter.date),
          column: frontmatter.column as ResearchColumn,
          category: displayCategory(frontmatter.category as SourceResearchCategory),
          summary: String(frontmatter.summary || frontmatter.description || ''),
          cover,
          thumbnail: articleCoverThumbnail(cover),
          url,
          lang: url.startsWith('/zh/') ? 'zh' : 'en',
          articleType: frontmatter.article_type ? String(frontmatter.article_type) : undefined
        }
      })
      .sort((a, b) => {
        const byDate = b.date.localeCompare(a.date)
        return byDate || a.title.localeCompare(b.title)
      })
  }
})
