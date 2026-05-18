import type { HttpContext } from '@adonisjs/core/http'
import Event from '#models/event'
import CatEvent from '#models/cat_event'
import { eventValidator, catEventValidator } from '#validators/event'
import { DateTime } from 'luxon'

export default class AdminEventsController {

  public async index({ request, inertia }: HttpContext) {
    const search = request.input('search', '')
    const status = request.input('status', 'all')

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
        status: e.status,
        catEventId: e.catEventId,
        catEvent: e.catEvent ? { id: e.catEvent.id, name: e.catEvent.name } : null
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
    const payload = await request.validateUsing(eventValidator)

    await Event.create({
      name: payload.name,
      description: payload.description,
      content: payload.content,
      place: payload.place,
      date: payload.date ? DateTime.fromJSDate(payload.date) : null,
      status: payload.status,
      catEventId: payload.catEventId,
    })

    session.flash('success', 'Événement ajouté avec succès.')
    return response.redirect().back()
  }

  public async update({ params, request, response, session }: HttpContext) {
    const event = await Event.findOrFail(params.id)
    const payload = await request.validateUsing(eventValidator)

    event.merge({
      name: payload.name,
      description: payload.description,
      content: payload.content,
      place: payload.place,
      date: payload.date ? DateTime.fromJSDate(payload.date) : null,
      status: payload.status,
      catEventId: payload.catEventId,
    })
    await event.save()

    session.flash('success', 'Événement modifié avec succès.')
    return response.redirect().back()
  }

  public async destroy({ params, response, session }: HttpContext) {
    const event = await Event.findOrFail(params.id)
    await event.delete()

    session.flash('success', 'Événement supprimé avec succès.')
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
