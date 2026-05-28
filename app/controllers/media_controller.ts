import type { HttpContext } from '@adonisjs/core/http'
import Media from '#models/media'

const mapFormatToType = (format: string) => {
  if (format === 'texte') return 'document'
  if (format === 'podcast') return 'audio'
  return format // audio, video
}

export default class MediaController {
  public async index({ inertia }: HttpContext) {
    const latestMedias = await Media.query()
      .orderBy('createdAt', 'desc')
      .limit(3)
      .preload('catMedia')

    return inertia.render('media', {
      videos: latestMedias.map((m) => ({
        id: m.id.toString(),
        title: m.title,
        category: m.catMedia?.name || 'Média',
        date: m.date ? m.date.toFormat('dd LLL yyyy') : m.createdAt.toFormat('dd LLL yyyy'),
        duration: m.duration ? new Date(m.duration * 1000).toISOString().substring(11, 19) : '',
        speaker: m.orateur,
        thumbnail: m.urlFile || '',
        url: m.file || '#',
      })),
    } as never)
  }

  public async allContent({ inertia }: HttpContext) {
    const allMedias = await Media.query()
      .orderBy('createdAt', 'desc')
      .preload('catMedia')

    return inertia.render('allContent', {
      items: allMedias.map((m) => ({
        id: m.id.toString(),
        title: m.title,
        type: mapFormatToType(m.format),
        category: m.catMedia?.name || 'Média',
        date: m.date ? m.date.toFormat('dd LLL yyyy') : m.createdAt.toFormat('dd LLL yyyy'),
        duration: m.duration ? new Date(m.duration * 1000).toISOString().substring(11, 19) : undefined,
        thumbnail: m.urlFile || '',
        url: m.file || '#',
        speaker: m.orateur,
      })),
    } as never)
  }
}