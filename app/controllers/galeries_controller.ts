import type { HttpContext } from '@adonisjs/core/http'
import Galery from '#models/galery'

const toSlug = (title: string) =>
  title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')

export default class GaleriesController {
  public async index({ inertia }: HttpContext) {
    const albums = await Galery.query().orderBy('createdAt', 'desc')

    return inertia.render('gallery', {
      albums: albums.map((a) => ({
        id: a.id,
        title: a.title,
        slug: toSlug(a.title),
        coverImg: a.coverImg || a.urlImg || null,
        imgNber: a.imgNber,
      })),
    } as never)
  }

  public async show({ params, inertia, response }: HttpContext) {
    const albums = await Galery.query().preload('images')
    const album = albums.find((a) => toSlug(a.title) === params.slug)

    if (!album) return response.redirect('/gallery')

    return inertia.render('gallery-content', {
      album: {
        id: album.id,
        title: album.title,
        images: album.images.map((img) => ({
          id: img.id.toString(),
          url: img.url,
          title: img.title || album.title,
          date: img.date ? img.date.toFormat('dd LLL yyyy') : img.createdAt.toFormat('dd LLL yyyy'),
        })),
      },
    } as never)
  }
}