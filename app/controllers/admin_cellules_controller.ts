import type { HttpContext } from '@adonisjs/core/http'
import Cellule from '#models/cellule'
import Member from '#models/member'
import { celluleValidator } from '#validators/cellule'

/**
 * Retourne uniquement les membres actifs de type 'responsable' ou 'conseiller',
 * triés par nom — utilisé pour le select du formulaire cellule.
 */
async function fetchResponsables() {
  return Member.query()
    .where('statut', 'actif')
    .whereIn('typeMember', ['responsable', 'conseiller'])
    .orderBy('lastname', 'asc')
    .select('id', 'firstname', 'lastname', 'typeMember')
}

export default class AdminCellulesController {
  /**
   * GET /admin/cellules
   * Affiche la liste des cellules + les responsables disponibles pour le formulaire.
   */
  async index({ inertia }: HttpContext) {
    const [cellules, responsables] = await Promise.all([
      Cellule.query().preload('responsable').orderBy('name', 'asc'),
      fetchResponsables(),
    ])

    return inertia.render('admin/cellules' as any, { cellules, responsables })
  }

  /**
   * GET /admin/cellules/responsables
   * Retourne en JSON les membres éligibles comme responsable de cellule
   * (typeMember = 'responsable' | 'conseiller', statut = 'actif').
   * Utilisé pour alimenter le <select> du formulaire via fetch ou Inertia shared data.
   */
  async responsables({ response }: HttpContext) {
    const data = await fetchResponsables()

    return response.json(
      data.map((m) => ({
        id: m.id,
        firstname: m.firstname,
        lastname: m.lastname,
        typeMember: m.typeMember,
        label: `${m.lastname.toUpperCase()} ${m.firstname}${m.typeMember ? ` (${m.typeMember})` : ''}`,
      }))
    )
  }

  /**
   * POST /admin/cellules
   * Crée une nouvelle cellule. Le responsable doit être un membre
   * de type 'responsable' ou 'conseiller' s'il est fourni.
   */
  async store({ request, response, session }: HttpContext) {
    // Pas de meta : la règle unique vérifie sur toute la table
    const data = await request.validateUsing(celluleValidator)

    try {
      // Vérification que le responsable choisi est bien éligible
      if (data.responsableId) {
        const isEligible = await Member.query()
          .where('id', data.responsableId)
          .whereIn('typeMember', ['responsable', 'conseiller'])
          .first()

        if (!isEligible) {
          session.flash('error', 'Le membre sélectionné n\'est pas éligible comme responsable.')
          return response.redirect().back()
        }
      }

      await Cellule.create({
        name: data.name,
        description: data.description ?? null,
        horaire: data.horaire ?? null,
        adresse: data.adresse ?? null,
        contact: data.contact ?? null,
        responsableId: data.responsableId ?? null,
      })

      session.flash('success', 'Cellule créée avec succès.')
    } catch (error) {
      console.error(error)
      session.flash('error', 'Erreur lors de la création de la cellule.')
    }

    return response.redirect().back()
  }

  /**
   * PUT /admin/cellules/:id
   * Met à jour une cellule existante.
   */
  async update({ params, request, response, session }: HttpContext) {
    // On passe l'id courant pour que la règle unique ignore cet enregistrement
    const data = await request.validateUsing(celluleValidator, {
      meta: { celluleId: Number(params.id) },
    })

    try {
      // Vérification que le responsable choisi est bien éligible
      if (data.responsableId) {
        const isEligible = await Member.query()
          .where('id', data.responsableId)
          .whereIn('typeMember', ['responsable', 'conseiller'])
          .first()

        if (!isEligible) {
          session.flash('error', 'Le membre sélectionné n\'est pas éligible comme responsable.')
          return response.redirect().back()
        }
      }

      const cellule = await Cellule.findOrFail(params.id)
      cellule.merge({
        name: data.name,
        description: data.description ?? null,
        horaire: data.horaire ?? null,
        adresse: data.adresse ?? null,
        contact: data.contact ?? null,
        responsableId: data.responsableId ?? null,
      })
      await cellule.save()

      session.flash('success', 'Cellule mise à jour avec succès.')
    } catch (error) {
      console.error(error)
      session.flash('error', 'Erreur lors de la mise à jour de la cellule.')
    }

    return response.redirect().back()
  }

  /**
   * DELETE /admin/cellules/:id
   * Supprime une cellule.
   */
  async destroy({ params, response, session }: HttpContext) {
    try {
      const cellule = await Cellule.findOrFail(params.id)
      await cellule.delete()
      session.flash('success', 'Cellule supprimée avec succès.')
    } catch (error) {
      session.flash('error', 'Erreur lors de la suppression de la cellule.')
    }

    return response.redirect().back()
  }
}
