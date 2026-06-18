import type { HttpContext } from '@adonisjs/core/http'
import Event from '#models/event'
import CatEvent from '#models/cat_event'

const mapStatus = (status: string) => {
  switch (status) {
    case 'a_venir':  return 'upcoming'
    case 'en_cours': return 'ongoing'
    case 'termine':  return 'past'
    case 'annule':   return 'past'
    default:         return 'past'
  }
}

const formatDate = (event: Event) => {
  if (!event.date) return ''
  const start = event.date.setLocale('fr').toFormat('dd MMMM yyyy')
  
  if (event.dateFin && event.dateFin.toISODate() !== event.date.toISODate()) {
    const end = event.dateFin.setLocale('fr').toFormat('dd MMMM yyyy')
    let timeStr = ''
    if (event.startTime) {
      timeStr += ` à ${event.startTime}`
      if (event.endTime) {
        timeStr += ` - ${event.endTime}`
      }
    }
    return `Du ${start} au ${end}${timeStr}`
  }
  
  let timeStr = ''
  if (event.startTime) {
    timeStr += ` à ${event.startTime}`
    if (event.endTime) {
      timeStr += ` - ${event.endTime}`
    }
  }
  return `${start}${timeStr}`
}

export default class EventsController {
  public async index({ inertia }: HttpContext) {
    // Mettre à jour les statuts des événements obsolètes par rapport à la date actuelle
    await Event.syncStatuses()

    const [events, categories] = await Promise.all([
      Event.query().orderBy('date', 'desc').preload('catEvent'),
      CatEvent.query().orderBy('name', 'asc'),
    ])

    return inertia.render('evenements', {
      events: events.map((e) => ({
        title: e.name,
        slug: e.slug || '',
        status: mapStatus(e.status),
        date: formatDate(e),
        location: e.place || '',
        description: e.description || '',
        content: e.content || '',
        tag: e.catEvent?.name || 'Événement',
        image: e.urlImg || '',
      })),
      categories: categories.map((c) => ({ id: c.id, name: c.name })),
    } as never)
  }

  public async show({ params, inertia, response }: HttpContext) {
    const event = await Event.query()
      .where('slug', params.slug)
      .preload('catEvent')
      .first()

    if (!event) return response.redirect('/evenements')

    return inertia.render('detail-evenement', {
      event: {
        title: event.name,
        slug: event.slug,
        status: mapStatus(event.status),
        date: formatDate(event),
        location: event.place || '',
        description: event.description || '',
        content: event.content || '',
        tag: event.catEvent?.name || 'Événement',
        image: event.urlImg || '',
      },
    } as never)
  }
}