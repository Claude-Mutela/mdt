import type { HttpContext } from '@adonisjs/core/http'
import Media from '#models/media'
import CatMedia from '#models/cat_media'
import { createMediaValidator, updateMediaValidator, catMediaValidator } from '#validators/media'
import CloudinaryService from '#services/cloudinary_service'
import { DateTime } from 'luxon'

export default class AdminMediasController {

  public async index({ request, inertia }: HttpContext) {
    const page = request.input('page', 1)
    const search = request.input('search', '')
    const catId = request.input('catId', 'all')

    const query = Media.query().preload('catMedia').orderBy('created_at', 'desc')

    if (catId && catId !== 'all') {
      query.where('cat_media_id', catId)
    }

    if (search) {
      query.where((q) => {
        q.where('title', 'like', `%${search}%`)
          .orWhere('orateur', 'like', `%${search}%`)
      })
    }

    const paginated = await query.paginate(page, 21)
    const categories = await CatMedia.query().orderBy('name', 'asc')

    // Serialize pagination for React
    const paginationMeta = paginated.getMeta()

    return inertia.render('admin/medias', {
      medias: paginated.all().map(m => ({
        id: m.id,
        title: m.title,
        format: m.format,
        file: m.file,
        urlFile: m.urlFile,
        orateur: m.orateur,
        duration: m.duration,
        date: m.date ? m.date.toISODate() : null,
        catMediaId: m.catMediaId,
        catMedia: m.catMedia ? { id: m.catMedia.id, name: m.catMedia.name } : null,
        createdAt: m.createdAt.toISO()
      })),
      categories: categories.map(c => ({
        id: c.id,
        name: c.name
      })),
      meta: {
        total: paginationMeta.total,
        perPage: paginationMeta.perPage,
        currentPage: paginationMeta.currentPage,
        lastPage: paginationMeta.lastPage,
        firstPage: 1
      },
      filters: {
        search,
        catId
      }
    })
  }

  public async store({ request, response, session }: HttpContext) {
    const payload = await request.validateUsing(createMediaValidator)

    try {
      const media = new Media()
      media.fill({
        title: payload.title,
        format: payload.format,
        orateur: payload.orateur,
        duration: payload.duration,
        date: payload.date ? DateTime.fromJSDate(payload.date) : null,
        catMediaId: payload.catMediaId,
        urlFile: payload.urlFile,
      })

      // Cloudinary File Upload if present
      const mediaFile = request.file('file')
      if (mediaFile && mediaFile.tmpPath) {
        const url = await CloudinaryService.upload(mediaFile.tmpPath, 'medias')
        media.file = url
      }

      await media.save()
      session.flash('success', 'Média créé avec succès.')
    } catch (error) {
      console.error(error)
      session.flash('error', 'Erreur lors de la création du média.')
    }

    return response.redirect().back()
  }

  public async update({ params, request, response, session }: HttpContext) {
    const media = await Media.findOrFail(params.id)
    const payload = await request.validateUsing(updateMediaValidator)

    try {
      media.merge({
        title: payload.title,
        format: payload.format,
        orateur: payload.orateur,
        duration: payload.duration,
        date: payload.date ? DateTime.fromJSDate(payload.date) : null,
        catMediaId: payload.catMediaId,
        urlFile: payload.urlFile,
      })

      // Cloudinary File Upload if new file
      const mediaFile = request.file('file')
      if (mediaFile && mediaFile.tmpPath) {
        // Delete old file from Cloudinary
        if (media.file) {
          const publicId = CloudinaryService.extractPublicId(media.file)
          if (publicId) {
            await CloudinaryService.delete(publicId)
          }
        }
        const url = await CloudinaryService.upload(mediaFile.tmpPath, 'medias')
        media.file = url
      }

      await media.save()
      session.flash('success', 'Média mis à jour avec succès.')
    } catch (error) {
      console.error(error)
      session.flash('error', 'Erreur lors de la mise à jour du média.')
    }

    return response.redirect().back()
  }

  public async destroy({ params, response, session }: HttpContext) {
    const media = await Media.findOrFail(params.id)

    try {
      if (media.file) {
        const publicId = CloudinaryService.extractPublicId(media.file)
        if (publicId) {
          await CloudinaryService.delete(publicId)
        }
      }

      await media.delete()
      session.flash('success', 'Média supprimé avec succès.')
    } catch (error) {
      console.error(error)
      session.flash('error', 'Erreur lors de la suppression du média.')
    }

    return response.redirect().back()
  }

  // --- Category CRUD Methods ---

  public async storeCategory({ request, response, session }: HttpContext) {
    const payload = await request.validateUsing(catMediaValidator)

    try {
      await CatMedia.create({ name: payload.name })
      session.flash('success', 'Catégorie créée avec succès.')
    } catch (error) {
      console.error(error)
      session.flash('error', 'Erreur lors de la création de la catégorie (le nom doit être unique).')
    }

    return response.redirect().back()
  }

  public async updateCategory({ params, request, response, session }: HttpContext) {
    const category = await CatMedia.findOrFail(params.id)
    const payload = await request.validateUsing(catMediaValidator)

    try {
      category.name = payload.name
      await category.save()
      session.flash('success', 'Catégorie mise à jour avec succès.')
    } catch (error) {
      console.error(error)
      session.flash('error', 'Erreur lors de la mise à jour de la catégorie.')
    }

    return response.redirect().back()
  }

  public async destroyCategory({ params, response, session }: HttpContext) {
    const category = await CatMedia.findOrFail(params.id)

    try {
      await category.delete()
      session.flash('success', 'Catégorie supprimée avec succès.')
    } catch (error) {
      console.error(error)
      session.flash('error', 'Impossible de supprimer cette catégorie car elle contient des médias associés.')
    }

    return response.redirect().back()
  }
}
