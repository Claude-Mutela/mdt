import type { HttpContext } from '@adonisjs/core/http'
import Member from '#models/member'
import Event from '#models/event'
import Ministry from '#models/ministry'
import Media from '#models/media'
import Image from '#models/image'
import Agenda from '#models/agenda'
import Newcomer from '#models/newcomer'
import FinanceOperation from '#models/finance_operation'
import { DateTime } from 'luxon'

export default class AdminDashboardController {
  async index({ inertia }: HttpContext) {
    const now = DateTime.now()
    const startOfMonth = now.startOf('month')
    const endOfMonth = now.endOf('month')
    const startOfYear = now.startOf('year')
    const endOfYear = now.endOf('year')

    // 1. Membres actifs
    const activeMembersCountResult = await Member.query()
      .where('statut', 'actif')
      .count('* as total')
    const activeMembersCount = Number(activeMembersCountResult[0].$extras.total || 0)

    const newMembersThisMonthCountResult = await Member.query()
      .where('statut', 'actif')
      .where('createdAt', '>=', startOfMonth.toSQL()!)
      .count('* as total')
    const newMembersCount = Number(newMembersThisMonthCountResult[0].$extras.total || 0)

    const totalActiveBeforeThisMonth = activeMembersCount - newMembersCount
    const membersPercent =
      totalActiveBeforeThisMonth > 0
        ? Math.round((newMembersCount / totalActiveBeforeThisMonth) * 100)
        : 0
    const membersDelta = membersPercent > 0 ? `+${membersPercent}%` : 'stable'

    // 2. Événements à venir
    const upcomingEventsCountResult = await Event.query()
      .where('status', 'a_venir')
      .count('* as total')
    const upcomingEventsCount = Number(upcomingEventsCountResult[0].$extras.total || 0)

    const newEventsThisMonthResult = await Event.query()
      .where('status', 'a_venir')
      .where('createdAt', '>=', startOfMonth.toSQL()!)
      .count('* as total')
    const newEventsCount = Number(newEventsThisMonthResult[0].$extras.total || 0)
    const eventsDelta = newEventsCount > 0 ? `+${newEventsCount}` : 'stable'

    // 3. Ministères actifs
    const ministriesCountResult = await Ministry.query().count('* as total')
    const ministriesCount = Number(ministriesCountResult[0].$extras.total || 0)

    const newMinistriesThisMonthResult = await Ministry.query()
      .where('createdAt', '>=', startOfMonth.toSQL()!)
      .count('* as total')
    const newMinistriesCount = Number(newMinistriesThisMonthResult[0].$extras.total || 0)
    const ministriesDelta = newMinistriesCount > 0 ? `+${newMinistriesCount}` : 'stable'

    // 4. Médias publiés
    const mediaCountResult = await Media.query().count('* as total')
    const mediaCount = Number(mediaCountResult[0].$extras.total || 0)

    const newMediaThisMonthResult = await Media.query()
      .where('createdAt', '>=', startOfMonth.toSQL()!)
      .count('* as total')
    const newMediaCount = Number(newMediaThisMonthResult[0].$extras.total || 0)
    const mediaDelta = newMediaCount > 0 ? `+${newMediaCount}` : 'stable'

    // 5. Photos galerie
    const photosCountResult = await Image.query().count('* as total')
    const photosCount = Number(photosCountResult[0].$extras.total || 0)

    const newPhotosThisMonthResult = await Image.query()
      .where('createdAt', '>=', startOfMonth.toSQL()!)
      .count('* as total')
    const newPhotosCount = Number(newPhotosThisMonthResult[0].$extras.total || 0)
    const photosDelta = newPhotosCount > 0 ? `+${newPhotosCount}` : 'stable'

    // 6. Cultes ce mois
    let cultesCountResult = await Agenda.query()
      .whereBetween('day', [startOfMonth.toSQLDate()!, endOfMonth.toSQLDate()!])
      .where((q) => {
        q.where('title', 'like', '%culte%').orWhereHas('catActivity', (builder) => {
          builder.where('name', 'like', '%culte%')
        })
      })
      .count('* as total')
    let cultesVal = Number(cultesCountResult[0].$extras.total || 0)
    if (cultesVal === 0) {
      const allAgendaCountResult = await Agenda.query()
        .whereBetween('day', [startOfMonth.toSQLDate()!, endOfMonth.toSQLDate()!])
        .count('* as total')
      cultesVal = Number(allAgendaCountResult[0].$extras.total || 0)
    }

    // Delta comparing this month vs last month
    const lastMonthStart = now.minus({ months: 1 }).startOf('month').toSQLDate()!
    const lastMonthEnd = now.minus({ months: 1 }).endOf('month').toSQLDate()!
    let lastMonthCultesCountResult = await Agenda.query()
      .whereBetween('day', [lastMonthStart, lastMonthEnd])
      .where((q) => {
        q.where('title', 'like', '%culte%').orWhereHas('catActivity', (builder) => {
          builder.where('name', 'like', '%culte%')
        })
      })
      .count('* as total')
    let lastMonthCultesVal = Number(lastMonthCultesCountResult[0].$extras.total || 0)
    if (lastMonthCultesVal === 0) {
      const allAgendaCountLastMonthResult = await Agenda.query()
        .whereBetween('day', [lastMonthStart, lastMonthEnd])
        .count('* as total')
      lastMonthCultesVal = Number(allAgendaCountLastMonthResult[0].$extras.total || 0)
    }

    const cultesDiff = cultesVal - lastMonthCultesVal
    const cultesDelta =
      cultesDiff > 0 ? `+${cultesDiff}` : cultesDiff < 0 ? `${cultesDiff}` : 'stable'

    // 7. Recent Members
    const recentMembersDb = await Member.query()
      .preload('ministry')
      .orderBy('createdAt', 'desc')
      .limit(5)

    const recentMembers = recentMembersDb.map((m) => ({
      nom: `${m.firstname} ${m.lastname}`,
      ministere: m.ministry ? m.ministry.name : 'Aucun',
      date: m.createdAt.setLocale('fr').toFormat('dd LLL yyyy'),
      statut: m.statut === 'actif' ? 'Actif' : 'Inactif',
      coverImg: m.coverImg,
    }))

    // 8. Upcoming Events
    const upcomingEventsDb = await Event.query()
      .where('status', 'a_venir')
      .orderBy('date', 'asc')
      .limit(3)

    const upcomingEvents = upcomingEventsDb.map((e) => ({
      titre: e.name,
      date: e.date ? e.date.setLocale('fr').toFormat('dd LLL') : 'Non planifié',
      statut: e.status,
    }))

    // 9. Calcul du solde net des finances et des statistiques des nouveaux venus
    const { netUsd, netCdf } = await this.getNetFinanceBalances()
    const { newNewcomersCount, newcomersDelta, monthlyBars, annualGrowthStr, allYearsData, availableYears } =
      await this.getNewcomersStats(now, startOfYear, endOfYear)

    const stats = [
      { label: 'Membres actifs', value: activeMembersCount.toLocaleString('fr-FR'), delta: membersDelta },
      { label: 'Événements à venir', value: upcomingEventsCount.toString(), delta: eventsDelta },
      { label: 'Ministères actifs', value: ministriesCount.toString(), delta: ministriesDelta },
      { label: 'Cultes ce mois', value: cultesVal.toString(), delta: cultesDelta },
      { label: 'Solde Net (USD)', value: `${netUsd.toLocaleString('fr-FR')} $`, delta: 'stable' },
      { label: 'Solde Net (CDF)', value: `${netCdf.toLocaleString('fr-FR')} FC`, delta: 'stable' },
      { label: 'Nouveaux venus', value: newNewcomersCount.toString(), delta: newcomersDelta },
      // Laissés pour la compatibilité mais exclus côté front
      { label: 'Médias publiés', value: mediaCount.toString(), delta: mediaDelta },
      { label: 'Photos galerie', value: photosCount.toString(), delta: photosDelta },
    ]

    return inertia.render('admin/dashboard' as any, {
      stats,
      recentMembers,
      upcomingEvents,
      monthlyBars,
      annualGrowthStr,
      currentYear: now.year,
      allYearsData,
      availableYears,
    })
  }

  /**
   * Calcule le solde net des finances pour les devises USD et CDF.
   */
  private async getNetFinanceBalances() {
    const entries = await FinanceOperation.query().where('type', 'entrée')
    const exits = await FinanceOperation.query().where('type', 'sortie')

    let netUsd = 0
    let netCdf = 0

    entries.forEach((op) => {
      if (op.devise === 'USD') netUsd += Number(op.montant)
      else if (op.devise === 'CDF') netCdf += Number(op.montant)
    })

    exits.forEach((op) => {
      if (op.devise === 'USD') netUsd -= Number(op.montant)
      else if (op.devise === 'CDF') netCdf -= Number(op.montant)
    })

    return { netUsd, netCdf }
  }

  /**
   * Récupère le nombre total de nouveaux venus pour le mois en cours,
   * calcule la croissance des nouveaux venus pour le graphique mensuel pour TOUTES les années,
   * ainsi que le pourcentage de croissance annuelle.
   */
  private async getNewcomersStats(now: DateTime, startOfYear: DateTime, endOfYear: DateTime) {
    const startOfMonth = now.startOf('month')
    const endOfMonth = now.endOf('month')
    const startOfPreviousMonth = now.minus({ months: 1 }).startOf('month')
    const endOfPreviousMonth = now.minus({ months: 1 }).endOf('month')
    const lastYearEnd = now.minus({ years: 1 }).endOf('year').toSQLDate()!

    // Nouveaux venus ce mois
    const newcomersThisMonthCountResult = await Newcomer.query()
      .where('date', '>=', startOfMonth.toSQLDate()!)
      .andWhere('date', '<=', endOfMonth.toSQLDate()!)
      .count('* as total')
    const newNewcomersCount = Number(newcomersThisMonthCountResult[0].$extras.total || 0)

    // Nouveaux venus le mois dernier (pour le delta)
    const newcomersLastMonthCountResult = await Newcomer.query()
      .where('date', '>=', startOfPreviousMonth.toSQLDate()!)
      .andWhere('date', '<=', endOfPreviousMonth.toSQLDate()!)
      .count('* as total')
    const lastMonthNewcomersCount = Number(newcomersLastMonthCountResult[0].$extras.total || 0)

    const newcomersDiff = newNewcomersCount - lastMonthNewcomersCount
    const newcomersDelta =
      newcomersDiff > 0 ? `+${newcomersDiff}` : newcomersDiff < 0 ? `${newcomersDiff}` : 'stable'

    // ── Construction des données mensuelles pour TOUTES les années en un seul passage ──
    const allNewcomers = await Newcomer.query().orderBy('date', 'asc').select('date')
    const yearDataMap: Record<number, number[]> = {}

    for (const newcomer of allNewcomers) {
      const year = newcomer.date.year
      const monthIdx = newcomer.date.month - 1
      if (!yearDataMap[year]) yearDataMap[year] = Array(12).fill(0)
      if (monthIdx >= 0 && monthIdx < 12) yearDataMap[year][monthIdx]++
    }

    // Toujours garantir que l'année courante existe dans la map
    if (!yearDataMap[now.year]) yearDataMap[now.year] = Array(12).fill(0)

    const availableYears = Object.keys(yearDataMap)
      .map(Number)
      .sort((a, b) => a - b)

    const monthlyBars = yearDataMap[now.year]

    // Pourcentage de croissance annuelle des nouveaux venus
    const totalNewcomersCountResult = await Newcomer.query().count('* as total')
    const totalNewcomersCount = Number(totalNewcomersCountResult[0].$extras.total || 0)

    const totalCountLastYearNewcomersResult = await Newcomer.query()
      .where('date', '<=', lastYearEnd)
      .count('* as total')
    const totalCountLastYearNewcomers = Number(
      totalCountLastYearNewcomersResult[0].$extras.total || 0
    )

    let annualGrowth = 0
    if (totalCountLastYearNewcomers > 0) {
      const newNewcomersThisYear = totalNewcomersCount - totalCountLastYearNewcomers
      annualGrowth = Math.round((newNewcomersThisYear / totalCountLastYearNewcomers) * 100)
    }
    const annualGrowthStr = annualGrowth > 0 ? `+${annualGrowth}% annuel` : 'stable annuel'

    return {
      newNewcomersCount,
      newcomersDelta,
      monthlyBars,
      annualGrowthStr,
      allYearsData: yearDataMap,
      availableYears,
    }
  }
}
