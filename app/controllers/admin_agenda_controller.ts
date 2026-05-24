import type { HttpContext } from '@adonisjs/core/http'
import Agenda from '#models/agenda'
import CatActivity from '#models/cat_activity'
import { agendaValidator, catActivityValidator } from '#validators/agenda'
import { DateTime } from 'luxon'

export default class AdminAgendaController {
  
  public async index({ request, inertia }: HttpContext) {
    // Get week from query params or default to current week
    // Expected format 'YYYY-Www' (e.g., 2026-W20) - HTML5 input[type=week]
    const weekParam = request.input('week')
    
    let startDate: DateTime
    let endDate: DateTime
    
    if (weekParam) {
      // Parse ISO week string
      startDate = DateTime.fromISO(weekParam).startOf('week')
    } else {
      startDate = DateTime.now().startOf('week')
    }
    endDate = startDate.endOf('week')

    const currentWeekStr = startDate.toFormat("kkkk-'W'WW") // Standard HTML week format

    const agendas = await Agenda.query()
      .where('day', '>=', startDate.toSQLDate() as string)
      .andWhere('day', '<=', endDate.toSQLDate() as string)
      .preload('catActivity')
      .orderBy('day', 'asc')
      .orderBy('hourStart', 'asc')

    const categories = await CatActivity.all()

    return inertia.render('admin/agenda', { 
      agendas: agendas.map(a => {
        // Format to simple object for Inertia
        return {
          id: a.id,
          day: a.day.toISODate() as string, // "YYYY-MM-DD"
          title: a.title,
          hourStart: a.hourStart,
          hourEnd: a.hourEnd,
          place: a.place,
          catActivityId: a.catActivityId,
          catActivity: a.catActivity ? { id: a.catActivity.id, name: a.catActivity.name } : null
        }
      }),
      categories: categories.map(c => ({ id: c.id, name: c.name })),
      currentWeek: currentWeekStr
    })
  }

  public async store({ request, response, session }: HttpContext) {
    const payload = await request.validateUsing(agendaValidator)
    
    // Luxon date conversion from standard HTML5 date input (YYYY-MM-DD)
    // The validator returns a native Date, we need to save it as DateTime if we use set() or just pass it to create()
    const agendaPayload = {
      ...payload,
      day: DateTime.fromJSDate(payload.day)
    }

    await Agenda.create(agendaPayload)
    session.flash('success', 'Créneau ajouté avec succès')
    return response.redirect().back()
  }

  public async update({ params, request, response, session }: HttpContext) {
    const agenda = await Agenda.findOrFail(params.id)
    const payload = await request.validateUsing(agendaValidator)
    
    agenda.merge({
      ...payload,
      day: DateTime.fromJSDate(payload.day)
    })
    await agenda.save()
    
    session.flash('success', 'Créneau modifié avec succès')
    return response.redirect().back()
  }

  public async destroy({ params, response, session }: HttpContext) {
    const agenda = await Agenda.findOrFail(params.id)
    await agenda.delete()
    session.flash('success', 'Créneau supprimé avec succès')
    return response.redirect().back()
  }

  public async storeCategory({ request, response, session }: HttpContext) {
    const payload = await request.validateUsing(catActivityValidator)
    await CatActivity.create(payload)
    session.flash('success', 'Catégorie ajoutée avec succès')
    return response.redirect().back()
  }

  public async updateCategory({ params, request, response, session }: HttpContext) {
    const category = await CatActivity.findOrFail(params.id)
    const payload = await request.validateUsing(catActivityValidator)
    category.merge(payload)
    await category.save()
    session.flash('success', 'Catégorie modifiée avec succès')
    return response.redirect().back()
  }

  public async destroyCategory({ params, response, session }: HttpContext) {
    const category = await CatActivity.findOrFail(params.id)
    // Check if it's used
    const count = await Agenda.query().where('catActivityId', category.id).count('* as total')
    if (count[0].$extras.total > 0) {
      session.flash('error', 'Impossible de supprimer cette catégorie car elle est utilisée par des créneaux.')
      return response.redirect().back()
    }
    
    await category.delete()
    session.flash('success', 'Catégorie supprimée avec succès')
    return response.redirect().back()
  }
}