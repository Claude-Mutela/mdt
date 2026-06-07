import type { HttpContext } from '@adonisjs/core/http'
import Appointment from '#models/appointment'
import { appointmentStatusValidator, appointmentRescheduleValidator } from '#validators/appointment'
import { BrevoService } from '#services/brevo_service'
import { DateTime } from 'luxon'

export default class AdminAppointmentsController {
  /**
   * GET /admin/rendez-vous
   * Affiche la liste complète des rendez-vous.
   */
  async index({ inertia }: HttpContext) {
    const appointments = await Appointment.query().orderBy('appointment_date', 'desc')

    return inertia.render('admin/rendez-vous' as any, {
      appointments: appointments.map((a) => ({
        id: a.id,
        clientName: `${a.firstName} ${a.lastName}`,
        firstName: a.firstName,
        lastName: a.lastName,
        email: a.email || '',
        phone: a.phone,
        date: a.appointmentDate.toISODate() as string, // "YYYY-MM-DD"
        time: a.appointmentTime,
        subject: a.reason,
        status: a.status as 'pending' | 'confirmed' | 'cancelled',
      })),
    })
  }

  /**
   * PUT /admin/rendez-vous/:id
   * Met à jour le statut d'un rendez-vous.
   */
  async update({ params, request, response, session }: HttpContext) {
    const payload = await request.validateUsing(appointmentStatusValidator)

    try {
      const appointment = await Appointment.findOrFail(params.id)
      const oldStatus = appointment.status

      appointment.status = payload.status
      await appointment.save()

      // Déclencher les notifications par e-mail si le rendez-vous passe au statut "confirmed"
      if (payload.status === 'confirmed' && oldStatus !== 'confirmed') {
        const dateStr = appointment.appointmentDate.toFormat('dd/MM/yyyy')

        // 1. Envoyer un e-mail au demandeur si son e-mail est renseigné
        if (appointment.email) {
          await BrevoService.sendAppointmentConfirmedToClient(
            appointment.email,
            appointment.firstName,
            appointment.lastName,
            appointment.reason,
            appointment.format === 'presentiel' ? 'Présentiel' : 'En ligne',
            dateStr,
            appointment.appointmentTime
          )
        }

        // 2. Envoyer un e-mail de confirmation au pasteur
        await BrevoService.sendAppointmentConfirmedToPastor(
          appointment.firstName,
          appointment.lastName,
          appointment.phone,
          appointment.email,
          appointment.reason,
          appointment.format === 'presentiel' ? 'Présentiel' : 'En ligne',
          dateStr,
          appointment.appointmentTime
        )

        session.flash('success', 'Rendez-vous confirmé. Les e-mails de notification ont été envoyés au client et au pasteur.')
      } else if (payload.status === 'cancelled') {
        session.flash('success', 'Le rendez-vous a été marqué comme annulé.')
      } else {
        session.flash('success', 'Statut du rendez-vous mis à jour avec succès.')
      }
    } catch (error) {
      console.error('[AdminAppointmentsController] Erreur lors de la modification du statut:', error)
      session.flash('error', 'Erreur lors de la mise à jour du rendez-vous.')
    }

    return response.redirect().back()
  }

  /**
   * PATCH /admin/rendez-vous/:id/reschedule
   * Modifie la date et/ou l'heure du rendez-vous.
   */
  async reschedule({ params, request, response, session }: HttpContext) {
    const payload = await request.validateUsing(appointmentRescheduleValidator)

    try {
      const appointment = await Appointment.findOrFail(params.id)
      appointment.appointmentDate = DateTime.fromJSDate(payload.appointmentDate)
      appointment.appointmentTime = payload.appointmentTime
      await appointment.save()
      session.flash('success', 'Date et heure du rendez-vous mises à jour avec succès.')
    } catch (error) {
      console.error('[AdminAppointmentsController] Erreur lors du reschedule:', error)
      session.flash('error', 'Erreur lors de la modification du rendez-vous.')
    }

    return response.redirect().back()
  }

  /**
   * DELETE /admin/rendez-vous/:id
   * Supprime un rendez-vous.
   */
  async destroy({ params, response, session }: HttpContext) {
    try {
      const appointment = await Appointment.findOrFail(params.id)
      await appointment.delete()
      session.flash('success', 'Le rendez-vous a été supprimé avec succès.')
    } catch (error) {
      console.error('[AdminAppointmentsController] Erreur lors de la suppression du rendez-vous:', error)
      session.flash('error', 'Erreur lors de la suppression du rendez-vous.')
    }

    return response.redirect().back()
  }
}
