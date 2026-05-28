import type { HttpContext } from '@adonisjs/core/http'
import Media from '#models/media'
import Image from '#models/image'

const mapFormatToType = (format: string) => {
  if (format === 'texte') return 'document'
  if (format === 'podcast') return 'audio'
  return format // audio, video
}

export default class MediaController {
  public async index({ inertia }: HttpContext) {
    const [latestMedias, latestImages] = await Promise.all([
      Media.query().orderBy('createdAt', 'desc').limit(3).preload('catMedia'),
      Image.query().orderBy('createdAt', 'desc').limit(3).preload('galery'),
    ])

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
      galleryImages: latestImages.map((img) => ({
        id: img.id.toString(),
        url: img.url,
        title: img.title || img.galery?.title || 'Sans titre',
        date: img.date ? img.date.toFormat('dd LLL yyyy') : img.createdAt.toFormat('dd LLL yyyy'),
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