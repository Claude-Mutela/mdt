import type { HttpContext } from '@adonisjs/core/http'
import Appointment from '#models/appointment'
import { appointmentValidator } from '#validators/appointment'
import { BrevoService } from '#services/brevo_service'
import { DateTime } from 'luxon'

export default class AppointmentsController {
  /**
   * GET /rendez-vous
   * Affiche la page de prise de rendez-vous public.
   */
  async index({ inertia }: HttpContext) {
    return inertia.render('rendez-vous', {})
  }

  /**
   * POST /rendez-vous
   * Enregistre une nouvelle demande de rendez-vous pastoral.
   */
  async store({ request, response, session }: HttpContext) {
    // Valider les données du formulaire
    const payload = await request.validateUsing(appointmentValidator)

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
