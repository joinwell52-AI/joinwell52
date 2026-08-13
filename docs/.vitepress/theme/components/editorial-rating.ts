import scorecard from '../../generated/editorial-scorecard.json'

export type EditorialLevel = 'benchmark' | 'excellent' | 'quality' | 'passing' | 'foundation' | 'pending'

export const editorialLevel = (score: number | null): EditorialLevel => {
  if (score === null) return 'pending'
  if (score >= 95) return 'benchmark'
  if (score >= 90) return 'excellent'
  if (score >= 80) return 'quality'
  if (score >= 70) return 'passing'
  return 'foundation'
}

const canonicalPath = (url: string) => url
  .replace(/^\/(?:zh|en)/, '')
  .replace(/\/$/, '')

export const editorialRating = (url: string, lang: 'en' | 'zh') => {
  const rating = scorecard.items.find(item => item.path === canonicalPath(url))
  if (!rating) {
    return {
      score: null,
      label: lang === 'zh' ? '待周评' : 'Awaiting review',
      level: editorialLevel(null),
      pending: true
    }
  }
  return {
    score: rating.score,
    label: lang === 'zh' ? rating.publicLabel : rating.publicLabel_en,
    level: editorialLevel(rating.score),
    pending: false
  }
}
