import type { HttpContext } from '@adonisjs/core/http'
import Cellule from '#models/cellule'

export default class CellulesController {
  /**
   * GET /cellules
   * Affiche la liste publique des cellules de maison.
   */
  async index({ inertia }: HttpContext) {
    const cellules = await Cellule.query()
      .preload('responsable')
      .orderBy('name', 'asc')

    return inertia.render('cellules', {
      cellules: cellules.map((c) => ({
        id: c.id,
        nom: c.name,
        description: c.description ?? '',
        horaire: c.horaire ?? '',
        adresse: c.adresse ?? '',
        telephone: c.contact ?? '',
        responsable: c.responsable
          ? `${c.responsable.firstname} ${c.responsable.lastname}`
          : null,
      })),
    })
  }
}
