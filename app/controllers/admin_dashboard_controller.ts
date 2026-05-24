import type { HttpContext } from '@adonisjs/core/http'
import Member from '#models/member'
import Event from '#models/event'
import Ministry from '#models/ministry'
import Media from '#models/media'
import Image from '#models/image'
import Agenda from '#models/agenda'
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
    const membersPercent = totalActiveBeforeThisMonth > 0 ? Math.round((newMembersCount / totalActiveBeforeThisMonth) * 100) : 0
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
        q.where('title', 'like', '%culte%')
          .orWhereHas('catActivity', (builder) => {
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
        q.where('title', 'like', '%culte%')
          .orWhereHas('catActivity', (builder) => {
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
    const cultesDelta = cultesDiff > 0 ? `+${cultesDiff}` : (cultesDiff < 0 ? `${cultesDiff}` : 'stable')

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

    // 9. Monthly Member registrations for the growth chart
    const monthlyBars = Array(12).fill(0)
    const membersThisYear = await Member.query()
      .where('createdAt', '>=', startOfYear.toSQL()!)
      .andWhere('createdAt', '<=', endOfYear.toSQL()!)

    for (const member of membersThisYear) {
      const monthIdx = member.createdAt.month - 1
      if (monthIdx >= 0 && monthIdx < 12) {
        monthlyBars[monthIdx]++
      }
    }

    // 10. Annual Growth Percentage
    const totalCountResult = await Member.query().count('* as total')
    const totalCount = Number(totalCountResult[0].$extras.total || 0)

    const lastYearEnd = now.minus({ years: 1 }).endOf('year').toSQL()!
    const totalCountLastYearResult = await Member.query()
      .where('createdAt', '<=', lastYearEnd)
      .count('* as total')
    const totalCountLastYear = Number(totalCountLastYearResult[0].$extras.total || 0)

    let annualGrowth = 0
    if (totalCountLastYear > 0) {
      const newMembersThisYear = totalCount - totalCountLastYear
      annualGrowth = Math.round((newMembersThisYear / totalCountLastYear) * 100)
    }
    const annualGrowthStr = annualGrowth > 0 ? `+${annualGrowth}% annuel` : 'stable annuel'

    const stats = [
      { label: 'Membres actifs', value: activeMembersCount.toLocaleString('fr-FR'), delta: membersDelta },
      { label: 'Événements à venir', value: upcomingEventsCount.toString(), delta: eventsDelta },
      { label: 'Ministères actifs', value: ministriesCount.toString(), delta: ministriesDelta },
      { label: 'Médias publiés', value: mediaCount.toString(), delta: mediaDelta },
      { label: 'Photos galerie', value: photosCount.toString(), delta: photosDelta },
      { label: 'Cultes ce mois', value: cultesVal.toString(), delta: cultesDelta },
    ]

    return inertia.render('admin/dashboard' as any, {
      stats,
      recentMembers,
      upcomingEvents,
      monthlyBars,
      annualGrowthStr,
      currentYear: now.year,
    })
  }
}
