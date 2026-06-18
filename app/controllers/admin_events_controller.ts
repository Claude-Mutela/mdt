import type { HttpContext } from '@adonisjs/core/http'
import Event from '#models/event'
import CatEvent from '#models/cat_event'
import { createEventValidator, updateEventValidator, catEventValidator } from '#validators/event'
import CloudinaryService from '#services/cloudinary_service'
import { DateTime } from 'luxon'
import string from '@adonisjs/core/helpers/string'

export default class AdminEventsController {

  public async index({ request, inertia }: HttpContext) {
    const search = request.input('search', '')
    const status = request.input('status', 'all')

    // Mettre à jour les statuts des événements obsolètes par rapport à la date actuelle
    await Event.syncStatuses()

    const query = Event.query().preload('catEvent').orderBy('date', 'desc')

    if (status && status !== 'all') {
      query.where('status', status)
    }

    if (search) {
      query.where('name', 'like', `%${search}%`)
    }

    const events = await query
    const categories = await CatEvent.query().orderBy('name', 'asc')

    return inertia.render('admin/evenements', {
      events: events.map(e => ({
        id: e.id,
        name: e.name,
        description: e.description,
        content: e.content,
        place: e.place,
        date: e.date ? e.date.toISODate() : null, // "YYYY-MM-DD"
        dateFin: e.dateFin ? e.dateFin.toISODate() : null, // "YYYY-MM-DD"
        status: e.status,
        urlImg: e.urlImg,
        catEventId: e.catEventId,
        catEvent: e.catEvent ? { id: e.catEvent.id, name: e.catEvent.name } : null,
        startTime: e.startTime,
        endTime: e.endTime,
      })),
      categories: categories.map(c => ({
        id: c.id,
        name: c.name
      })),
      filters: {
        search,
        status
      }
    })
  }

  public async store({ request, response, session }: HttpContext) {
    const payload = await request.validateUsing(createEventValidator)

    try {
      const startDate = payload.date ? DateTime.fromJSDate(payload.date) : null
      const endDate = payload.dateFin ? DateTime.fromJSDate(payload.dateFin) : null

      // Automatique status based on date & dateFin
      let calculatedStatus: 'a_venir' | 'en_cours' | 'termine' | 'annule' = 'a_venir'
      if (startDate) {
        const now = DateTime.now().startOf('day')
        const start = startDate.startOf('day')
        const end = endDate ? endDate.startOf('day') : start

        if (now < start) {
          calculatedStatus = 'a_venir'
        } else if (now > end) {
          calculatedStatus = 'termine'
        } else {
          calculatedStatus = 'en_cours'
        }
      }

      const event = new Event()
      event.fill({
        name: payload.name,
        slug: string.slug(payload.name, { lower: true }),
        description: payload.description,
        content: payload.content,
        place: payload.place,
        date: startDate,
        dateFin: endDate,
        status: calculatedStatus,
        catEventId: payload.catEventId,
        startTime: payload.startTime || null,
        endTime: payload.endTime || null,
      })

      // Cloudinary Upload for urlImg
      const urlImgFile = request.file('urlImg')
      if (urlImgFile && urlImgFile.tmpPath) {
        const url = await CloudinaryService.upload(urlImgFile.tmpPath, 'events')
        event.urlImg = url
      }

      await event.save()
      session.flash('success', 'Événement ajouté avec succès.')
    } catch (error) {
      console.error(error)
      session.flash('error', "Erreur lors de l'ajout de l'événement.")
    }

    return response.redirect().back()
  }

  public async update({ params, request, response, session }: HttpContext) {
    const event = await Event.findOrFail(params.id)
    const payload = await request.validateUsing(updateEventValidator)

    try {
      const startDate = payload.date ? DateTime.fromJSDate(payload.date) : null
      const endDate = payload.dateFin ? DateTime.fromJSDate(payload.dateFin) : null

      // Recalculate status automatically or use manual override if provided in payload
      let targetStatus = payload.status
      if (!targetStatus) {
        if (startDate) {
          const now = DateTime.now().startOf('day')
          const start = startDate.startOf('day')
          const end = endDate ? endDate.startOf('day') : start

          if (now < start) {
            targetStatus = 'a_venir'
          } else if (now > end) {
            targetStatus = 'termine'
          } else {
            targetStatus = 'en_cours'
          }
        } else {
          targetStatus = 'a_venir'
        }
      }

      event.merge({
        name: payload.name,
        slug: string.slug(payload.name, { lower: true }),
        description: payload.description,
        content: payload.content,
        place: payload.place,
        date: startDate,
        dateFin: endDate,
        status: targetStatus,
        catEventId: payload.catEventId,
        startTime: payload.startTime || null,
        endTime: payload.endTime || null,
      })

      // Cloudinary Upload for urlImg (only if new file provided)
      const urlImgFile = request.file('urlImg')
      if (urlImgFile && urlImgFile.tmpPath) {
        // Delete old image from Cloudinary if it exists
        if (event.urlImg) {
          const oldPublicId = CloudinaryService.extractPublicId(event.urlImg)
          if (oldPublicId) {
            await CloudinaryService.delete(oldPublicId)
          }
        }

        const url = await CloudinaryService.upload(urlImgFile.tmpPath, 'events')
        event.urlImg = url
      }

      await event.save()
      session.flash('success', 'Événement modifié avec succès.')
    } catch (error) {
      console.error(error)
      session.flash('error', "Erreur lors de la modification de l'événement.")
    }

    return response.redirect().back()
  }

  public async destroy({ params, response, session }: HttpContext) {
    try {
      const event = await Event.findOrFail(params.id)

      // Delete image from Cloudinary if it exists
      if (event.urlImg) {
        const publicId = CloudinaryService.extractPublicId(event.urlImg)
        if (publicId) {
          await CloudinaryService.delete(publicId)
        }
      }

      await event.delete()
      session.flash('success', 'Événement supprimé avec succès.')
    } catch (error) {
      console.error(error)
      session.flash('error', "Erreur lors de la suppression de l'événement.")
    }

    return response.redirect().back()
  }

  // CatEvent CRUD
  public async storeCategory({ request, response, session }: HttpContext) {
    const payload = await request.validateUsing(catEventValidator)
    await CatEvent.create(payload)

    session.flash('success', 'Catégorie d\'événement créée avec succès.')
    return response.redirect().back()
  }

  public async updateCategory({ params, request, response, session }: HttpContext) {
    const category = await CatEvent.findOrFail(params.id)
    const payload = await request.validateUsing(catEventValidator)

    category.name = payload.name
    await category.save()

    session.flash('success', 'Catégorie d\'événement modifiée avec succès.')
    return response.redirect().back()
  }

  public async destroyCategory({ params, response, session }: HttpContext) {
    const category = await CatEvent.findOrFail(params.id)

    // Check if category has events to prevent orphaned foreign keys or show helpful message
    const eventsCount = await Event.query().where('catEventId', category.id).first()
    if (eventsCount) {
      session.flash('error', 'Impossible de supprimer cette catégorie car elle contient des événements.')
      return response.redirect().back()
    }

    await category.delete()
    session.flash('success', 'Catégorie d\'événement supprimée avec succès.')
    return response.redirect().back()
  }
}
