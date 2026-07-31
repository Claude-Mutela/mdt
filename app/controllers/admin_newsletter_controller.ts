import type { HttpContext } from '@adonisjs/core/http'
import Newsletter from '#models/newsletter'

/**
 * Contrôleur d'administration pour la gestion des abonnés à la Newsletter.
 * Accessible uniquement aux rôles autorisés (superadmin, admin, pasteur, mdtcom).
 */
export default class AdminNewsletterController {
  /**
   * GET /admin/newsletter
   * Affiche la liste paginée des abonnés à la newsletter avec recherche, filtrage et statistiques.
   */
  async index({ inertia, request }: HttpContext) {
    const page = request.input('page', 1)
    const search = (request.input('search', '') as string).trim()
    const statut = request.input('statut', 'Tous') as 'Tous' | 'actif' | 'en_attente'

    // Construction de la requête avec tri par date d'inscription décroissante
    const query = Newsletter.query().orderBy('created_at', 'desc')

    // Filtrage par adresse e-mail si un terme de recherche est fourni
    if (search) {
      query.where('email', 'like', `%${search}%`)
    }

    // Filtrage par statut ('actif' ou 'en_attente')
    if (statut !== 'Tous') {
      query.where('status', statut)
    }

    // Pagination de 15 éléments par page
    const subscribers = await query.paginate(page, 15)

    // Calcul des statistiques globales (sans les filtres de recherche applicables)
    const totalAll = await Newsletter.query().count('* as total').first()
    const totalActifs = await Newsletter.query()
      .where('status', 'actif')
      .count('* as total')
      .first()
    const totalAttente = await Newsletter.query()
      .where('status', 'en_attente')
      .count('* as total')
      .first()

    // Rendu de la vue Inertia d'administration
    return inertia.render('admin/newsletter', {
      subscribers,
      stats: {
        total: Number((totalAll as any).$extras.total ?? 0),
        actifs: Number((totalActifs as any).$extras.total ?? 0),
        attente: Number((totalAttente as any).$extras.total ?? 0),
      },
      filters: { search, statut },
    })
  }

  /**
   * DELETE /admin/newsletter/:id
   * Supprime un abonné de la newsletter.
   */
  async destroy({ params, response, session }: HttpContext) {
    const subscriber = await Newsletter.findOrFail(params.id)
    await subscriber.delete()

    session.flash('success', 'Abonné supprimé avec succès.')
    return response.redirect().back()
  }
}
