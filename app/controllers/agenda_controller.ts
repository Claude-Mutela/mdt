import type { HttpContext } from '@adonisjs/core/http'
import Agenda from '#models/agenda'
import { DateTime } from 'luxon'

export default class AgendaController {
  /**
   * GET /agenda
   * Affiche l'agenda complet de la semaine en cours (ou d'une semaine donnée).
   * Paramètre optionnel: ?week=YYYY-Www (format HTML5 input[type=week])
   */
  async index({ request, inertia }: HttpContext) {
    const weekParam = request.input('week')

    let startDate: DateTime
    if (weekParam) {
      startDate = DateTime.fromISO(weekParam).startOf('week')
    } else {
      startDate = DateTime.now().startOf('week')
    }
    const endDate = startDate.endOf('week')

    const currentWeekStr = startDate.toFormat("kkkk-'W'WW")

    const agendas = await Agenda.query()
      .where('day', '>=', startDate.toSQLDate() as string)
      .andWhere('day', '<=', endDate.toSQLDate() as string)
      .preload('catActivity')
      .orderBy('day', 'asc')
      .orderBy('hourStart', 'asc')

    return inertia.render('agenda', {
      agendas: agendas.map((a) => ({
        id: a.id,
        day: a.day.toISODate() as string, // "YYYY-MM-DD"
        title: a.title,
        hourStart: a.hourStart,
        hourEnd: a.hourEnd,
        place: a.place,
        catActivity: a.catActivity ? { id: a.catActivity.id, name: a.catActivity.name } : null,
      })),
      currentWeek: currentWeekStr,
    })
  }
}
