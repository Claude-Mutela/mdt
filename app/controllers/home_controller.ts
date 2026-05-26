import type { HttpContext } from '@adonisjs/core/http'
import HeroAsset from '#models/hero_asset'
import Media from '#models/media'
import Agenda from '#models/agenda'
import { DateTime } from 'luxon'

export default class HomeController {
  public async index({ inertia }: HttpContext) {
    // Récupère l'asset Hero actif
    const activeHero = await HeroAsset.query().where('status', 'active').first()

    // Récupère la dernière prédication (culte dominical)
    const lastPreach = await Media.query()
      .whereHas('catMedia', (query) => {
        query.where('name', 'CULTE DOMINICAL')
      })
      .orderBy('createdAt', 'desc')
      .first()

    // Récupère les événements de la semaine ISO en cours (lundi → dimanche)
    const startOfWeek = DateTime.now().startOf('week') // lundi
    const endOfWeek = DateTime.now().endOf('week')     // dimanche

    const weekAgendas = await Agenda.query()
      .where('day', '>=', startOfWeek.toSQLDate() as string)
      .andWhere('day', '<=', endOfWeek.toSQLDate() as string)
      .preload('catActivity')
      .orderBy('day', 'asc')
      .orderBy('hourStart', 'asc')

    return inertia.render('home', {
      activeHero: activeHero
        ? {
            id: activeHero.id,
            name: activeHero.name,
            filePath: activeHero.filePath,
            type: activeHero.type,
            status: activeHero.status,
          }
        : null,
      lastPreach: lastPreach
        ? {
            id: lastPreach.id,
            title: lastPreach.title,
            format: lastPreach.format,
            orateur: lastPreach.orateur,
            duree: lastPreach.duration,
            url: lastPreach.urlFile,
            date: lastPreach.date,
          }
        : null,
      weekAgendas: weekAgendas.map((a) => ({
        id: a.id,
        day: a.day.toISODate() as string, // "YYYY-MM-DD"
        title: a.title,
        hourStart: a.hourStart,
        hourEnd: a.hourEnd,
        place: a.place,
        category: a.catActivity ? { id: a.catActivity.id, name: a.catActivity.name } : null,
      })),
      currentWeekLabel: `Semaine du ${startOfWeek.setLocale('fr').toFormat('d MMMM')} au ${endOfWeek.setLocale('fr').toFormat('d MMMM yyyy')}`,
    } as never)
  }
}
