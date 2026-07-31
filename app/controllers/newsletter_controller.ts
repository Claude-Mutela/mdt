import type { HttpContext } from '@adonisjs/core/http'
import { randomBytes } from 'node:crypto'
import Newsletter from '#models/newsletter'
import { RecaptchaService } from '#services/recaptcha_service'
import { BrevoService } from '#services/brevo_service'
import { DateTime } from 'luxon'
import env from '#start/env'

/**
 * Contrôleur gérant les abonnements à la Newsletter publique.
 * 
 * Processus d'inscription (Double Opt-in) :
 * 1. L'utilisateur saisit son e-mail et coche le reCAPTCHA sur la page d'accueil.
 * 2. Le contrôleur valide l'e-mail et le reCAPTCHA.
 * 3. L'abonné est créé en base de données avec le statut 'en_attente' et un jeton unique.
 * 4. Un e-mail de confirmation contenant le lien d'activation est envoyé via Brevo.
 * 5. L'utilisateur clique sur le lien, son statut passe à 'actif' et il est redirigé vers l'accueil.
 */
export default class NewsletterController {
  /**
   * POST /newsletter
   * Traite la soumission du formulaire d'inscription à la newsletter.
   */
  async store({ request, response, session }: HttpContext) {
    // Nettoyage et normalisation de l'adresse e-mail saisie
    const email = (request.input('email') as string | undefined)?.trim().toLowerCase()
    const recaptchaToken = request.input('recaptchaToken') as string | null

    // ── 1. Validation de l'adresse e-mail ─────────────────────────────────────
    if (!email || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      session.flash('error', 'Veuillez saisir une adresse e-mail valide.')
      return response.redirect().back()
    }

    // ── 2. Vérification anti-robot reCAPTCHA ──────────────────────────────────
    const isHuman = await RecaptchaService.verifyToken(recaptchaToken)
    if (!isHuman) {
      session.flash('error', 'La vérification anti-robot a échoué. Veuillez cocher la case reCAPTCHA et réessayer.')
      return response.redirect().back()
    }

    // ── 3. Vérification de l'existence de l'e-mail dans la base ───────────────
    const existing = await Newsletter.findBy('email', email)

    if (existing) {
      // Si le compte est déjà actif, informer l'utilisateur
      if (existing.status === 'actif') {
        session.flash('success', 'Vous êtes déjà abonné(e) à notre newsletter !')
        return response.redirect().back()
      }
      
      // Si le compte est en attente, renvoyer l'e-mail de confirmation
      const confirmUrl = this._buildConfirmUrl(request, existing.token!)
      await BrevoService.sendNewsletterConfirmation(email, confirmUrl)
      session.flash('success', 'Un e-mail de confirmation vous a déjà été envoyé. Veuillez consulter votre boîte e-mail pour valider votre abonnement.')
      return response.redirect().back()
    }

    // ── 4. Création du nouvel abonné avec un jeton sécurisé (32 octets hex) ────
    const token = randomBytes(32).toString('hex')

    await Newsletter.create({
      email,
      token,
      status: 'en_attente',
    })

    // ── 5. Génération du lien de validation et envoi de l'e-mail Brevo ─────────
    const confirmUrl = this._buildConfirmUrl(request, token)
    await BrevoService.sendNewsletterConfirmation(email, confirmUrl)

    // Message de succès affiché sur la page d'accueil
    session.flash('success', 'Merci ! Un e-mail de confirmation vient de vous être envoyé. Veuillez cliquer sur le lien reçu pour valider votre abonnement.')
    return response.redirect().back()
  }

  /**
   * GET /newsletter/confirmer?token=xxx
   * Valide le jeton reçu par e-mail et active l'abonnement en base de données.
   */
  async confirm({ request, response, session }: HttpContext) {
    const token = request.qs().token as string | undefined

    // Si aucun jeton n'est fourni dans l'URL
    if (!token) {
      session.flash('error', 'Lien de confirmation invalide ou expiré.')
      return response.redirect('/')
    }

    // Recherche de l'abonné correspondant au jeton
    const subscriber = await Newsletter.findBy('token', token)

    // Si le jeton n'existe pas en base
    if (!subscriber) {
      session.flash('error', 'Ce lien de confirmation est invalide ou a déjà été utilisé.')
      return response.redirect('/')
    }

    // Si l'abonné est déjà actif
    if (subscriber.status === 'actif') {
      session.flash('success', 'Votre abonnement à la newsletter est déjà confirmé. Merci !')
      return response.redirect('/')
    }

    // ── Activation de l'abonnement ────────────────────────────────────────────
    subscriber.status = 'actif'
    subscriber.confirmedAt = DateTime.now()
    subscriber.token = null // Invalidation du jeton après utilisation
    await subscriber.save()

    // ── Synchronisation automatique du contact dans les listes Brevo ─────────
    await BrevoService.syncContactToBrevo(subscriber.email)

    session.flash('success', 'Félicitations ! Votre abonnement à la newsletter Phila MDT a bien été confirmé. 🎉')
    return response.redirect('/')
  }

  /**
   * Helper pour construire l'URL de confirmation.
   * Gère dynamiquement le domaine de production (philamdt.church) ou l'hôte local.
   */
  private _buildConfirmUrl(request: HttpContext['request'], token: string): string {
    const appUrl = env.get('APP_URL')
    let baseUrl: string
    if (appUrl && !appUrl.includes('localhost') && !appUrl.includes('127.0.0.1')) {
      baseUrl = appUrl
    } else {
      const host = request.header('host') || 'philamdt.church'
      const protocol = request.secure() ? 'https' : 'http'
      baseUrl = `${protocol}://${host}`
    }
    return `${baseUrl.replace(/\/$/, '')}/newsletter/confirmer?token=${token}`
  }
}
