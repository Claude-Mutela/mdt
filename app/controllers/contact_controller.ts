import type { HttpContext } from '@adonisjs/core/http'
import { contactValidator } from '#validators/contact'
import { BrevoService } from '#services/brevo_service'

export default class ContactController {
  /**
   * GET /contact
   * Affiche la page de contact.
   */
  async index({ inertia }: HttpContext) {
    return inertia.render('contact', {})
  }

  /**
   * POST /contact
   * Traite la soumission du formulaire de contact.
   *
   * Sécurité :
   *   - Validation VineJS (longueurs, regex, liste blanche) — voir contact validator
   *   - Les données sont validées avant tout traitement
   *   - Aucune donnée brute n'est renvoyée dans la réponse
   *   - Les erreurs serveur ne révèlent pas de détails internes
   */
  async store({ request, response, session }: HttpContext) {
    // 1. Validation stricte — lève une exception 422 si invalide
    const payload = await request.validateUsing(contactValidator)

    try {
      // 2a. Notifier l'équipe Phila MDT du nouveau message
      await BrevoService.sendContactMessageToChurch(
        payload.name,
        payload.email,
        payload.subject,
        payload.message
      )

      // 2b. Envoyer un accusé de réception au visiteur
      await BrevoService.sendContactAcknowledgement(
        payload.name,
        payload.email,
        payload.subject
      )

      session.flash('success', 'Votre message a bien été envoyé. Nous vous répondrons dans les meilleurs délais.')
    } catch (error) {
      // Ne jamais exposer l'erreur interne au client
      console.error('[ContactController] Erreur lors de l\'envoi du message de contact:', error)
      session.flash('error', 'Une erreur est survenue lors de l\'envoi de votre message. Veuillez réessayer.')
    }

    return response.redirect().back()
  }
}
