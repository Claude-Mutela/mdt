import type { HttpContext } from '@adonisjs/core/http'
import Appointment from '#models/appointment'
import { appointmentValidator } from '#validators/appointment'
import { BrevoService } from '#services/brevo_service'
import { RecaptchaService } from '#services/recaptcha_service'
import { errors as vineErrors } from '@vinejs/vine'
import { DateTime } from 'luxon'

export default class AppointmentsController {
  /**
   * GET /rendez-vous
   * Affiche la page de prise de rendez-vous public.
   * Passe la clé publique reCAPTCHA au composant React via Inertia.
   */
  async index({ inertia }: HttpContext) {
    return inertia.render('rendez-vous', {
      recaptchaSiteKey: process.env.RECAPTCHA_SITE_KEY ?? '',
    })
  }

  /**
   * POST /rendez-vous
   * Enregistre une nouvelle demande de rendez-vous pastoral.
   *
   * Sécurité :
   *   - Validation VineJS en premier — le token reCAPTCHA n'est PAS consommé
   *     si la saisie est invalide : l'utilisateur peut corriger sans re-cocher.
   *   - Vérification reCAPTCHA v2 (Google) après validation — retourne une
   *     E_VALIDATION_ERROR (422) pour que le frontend gère l'échec via onError.
   */
  async store({ request, response, session }: HttpContext) {
    // 1. Validation stricte — lève une exception 422 si invalide.
    //    On valide en premier pour ne pas consommer le token reCAPTCHA
    //    lors d'une simple erreur de saisie utilisateur.
    const payload = await request.validateUsing(appointmentValidator)

    // 2. Vérification reCAPTCHA — uniquement si la saisie est valide.
    //    On renvoie une E_VALIDATION_ERROR (422) afin qu'Inertia déclenche
    //    onError (et non onSuccess), empêchant l'affichage de la modale de succès.
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
      // Formater la date souhaitée
      const appointmentDate = DateTime.fromJSDate(payload.appointmentDate)

      // Mapper le format de rendez-vous pour correspondre à l'enum de la base de données
      // Enum en base : 'presentiel', 'en ligne'
      // Valeurs du formulaire : 'presentiel', 'enligne', 'enligne_vocal'
      let mappedFormat: 'presentiel' | 'en ligne' = 'presentiel'
      if (payload.format === 'enligne' || payload.format === 'enligne_vocal') {
        mappedFormat = 'en ligne'
      }

      // Créer la demande de rendez-vous (statut par défaut : pending / en attente)
      const appointment = await Appointment.create({
        lastName: payload.lastName,
        firstName: payload.firstName,
        phone: payload.phone,
        email: payload.email || null,
        reason: payload.reason,
        format: mappedFormat,
        appointmentDate: appointmentDate,
        appointmentTime: payload.appointmentTime,
        status: 'pending',
      })

      // Envoyer un e-mail de confirmation de réception via Brevo si un e-mail a été renseigné
      if (appointment.email) {
        // Formater le format de manière lisible pour le mail
        const prettyFormat = payload.format === 'presentiel'
          ? 'Présentiel'
          : payload.format === 'enligne'
            ? 'En ligne (Appel vidéo)'
            : 'En ligne (Appel vocal)'

        const dateStr = appointmentDate.toFormat('dd/MM/yyyy')

        await BrevoService.sendReceptionConfirmation(
          appointment.email,
          appointment.firstName,
          appointment.lastName,
          appointment.reason,
          prettyFormat,
          dateStr,
          appointment.appointmentTime
        )

        session.flash('success', 'Votre demande de rendez-vous a été envoyée avec succès. Un e-mail de confirmation de réception vous a été envoyé.')
      } else {
        session.flash('success', 'Votre demande de rendez-vous a été envoyée avec succès. Notre secrétariat vous contactera très prochainement.')
      }
    } catch (error) {
      console.error('[AppointmentsController] Erreur lors de la création du rendez-vous:', error)
      session.flash('error', 'Une erreur est survenue lors de l\'enregistrement de votre demande. Veuillez réessayer.')
    }

    return response.redirect().back()
  }
}

