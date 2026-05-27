import type { HttpContext } from '@adonisjs/core/http'
import Ministry from '#models/ministry'
import Agenda from '#models/agenda'
import { DateTime } from 'luxon'

export default class HomeController {
  public async index({ inertia }: HttpContext) {
  
    // Récupère les ministères 
    const allMinistries = await Ministry.all();
    // Récupère la dernière prédication (culte dominical)
   

    return inertia.render('ministries', {
      allMinistries: allMinistries.map((min) => ({
        id: min.id,
        name: min.name,
        slug: min.slug,
        description: min.description,
        urlImg: min.coverImg || min.urlImg,
        badgeColor: min.badgeColor,
        tag: min.tag
      })),
    } as never)
  }
}
