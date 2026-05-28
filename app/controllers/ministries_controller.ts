import type { HttpContext } from '@adonisjs/core/http'
import Ministry from '#models/ministry'
import Member from '#models/member'

export default class MinistriesController {
  public async index({ inertia }: HttpContext) {
    const allMinistries = await Ministry.all()
    const leadMembers = await Member.query()
      .where('typeMember', 'responsable')
      .preload('ministry')
      .orderBy('firstname', 'asc')

    return inertia.render('ministries', {
      ministries: allMinistries.map((min) => ({
        id: min.id,
        name: min.name,
        slug: min.slug,
        desc: min.description,
        img: min.coverImg || min.urlImg,
        color: min.badgeColor,
        tag: min.tag,
        content: min.content,
      })),
      responsibles: leadMembers.map((m) => ({
        id: m.id,
        firstname: m.firstname,
        lastname: m.lastname,
        email: m.email,
        phone: m.phone,
        gender: m.gender,
        coverImg: m.coverImg,
        typeMember: m.typeMember,
        ministry: m.ministry ? { id: m.ministry.id, name: m.ministry.name } : null,
      })),
    } as never)
  }

  public async show({ inertia, params, response }: HttpContext) {
    const ministry = await Ministry.query().where('slug', params.slug).first()

    if (!ministry) {
      return response.status(404).send('Ministère introuvable')
    }

    return inertia.render('detail-activite', {
      activity: {
        name: ministry.name,
        slug: ministry.slug,
        desc: ministry.description,
        img: ministry.coverImg || ministry.urlImg,
        color: ministry.badgeColor || 'bg-slate-500',
        tag: ministry.tag,
        content: ministry.content,
      },
    } as never)
  }
}
