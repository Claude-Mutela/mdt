import type { HttpContext } from '@adonisjs/core/http'
import { contactValidator } from '#validators/contact'
import { BrevoService } from '#services/brevo_service'
import { RecaptchaService } from '#services/recaptcha_service'
import { errors as vineErrors } from '@vinejs/vine'

export default class ContactController {
  /**
   * GET /contact
   * Affiche la page de contact.
   * Passe la clé publique reCAPTCHA au composant React via Inertia.
   */
  async index({ inertia }: HttpContext) {
    return inertia.render('contact', {
      recaptchaSiteKey: process.env.RECAPTCHA_SITE_KEY ?? '',
    })
  }

  /**
   * POST /contact
   * Traite la soumission du formulaire de contact.
   *
   * Sécurité :
   *   - Validation VineJS en premier (longueurs, regex, liste blanche) — le token reCAPTCHA
   *     n'est PAS consommé si la saisie est invalide : l'utilisateur peut corriger et renvoyer
   *     sans avoir à re-cocher la case reCAPTCHA.
   *   - Vérification reCAPTCHA v2 (Google) après validation — retourne une E_VALIDATION_ERROR
   *     (422) pour que le frontend traite l'échec via onError et non onSuccess.
   *   - Aucune donnée brute n'est renvoyée dans la réponse
   *   - Les erreurs serveur ne révèlent pas de détails internes
   */
  async store({ request, response, session }: HttpContext) {
    // 1. Validation stricte — lève une exception 422 si invalide.
    //    On valide en premier pour ne pas consommer le token reCAPTCHA
    //    lors d'une simple erreur de saisie utilisateur.
    const payload = await request.validateUsing(contactValidator)

    // 2. Vérification reCAPTCHA — uniquement si la saisie est valide.
    //    On renvoie une E_VALIDATION_ERROR (422) afin qu'Inertia déclenche
    //    onError (et non onSuccess), empêchant ainsi l'affichage de la modale de succès.
    const recaptchaToken = request.input('recaptchaToken') as string | null
    const isHuman = await RecaptchaService.verifyToken(recaptchaToken)

    if (!isHuman) {
      throw new vineErrors.E_VALIDATION_ERROR([{
        field: 'recaptchaToken',
        message: 'La vérification anti-robot a échoué. Veuillez cocher la case reCAPTCHA et réessayer.',
        rule: 'recaptcha',
      }])
    }

    try {
      // 3a. Notifier l'équipe Phila MDT du nouveau message
      await BrevoService.sendContactMessageToChurch(
        payload.name,
        payload.email,
        payload.subject,
        payload.message
      )

      // 3b. Envoyer un accusé de réception au visiteur
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
