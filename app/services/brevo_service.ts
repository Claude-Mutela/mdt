import env from '#start/env'

export class BrevoService {
  /**
   * Envoie un e-mail via l'API transactionnelle de Brevo.
   */
  private static async send(toEmail: string, toName: string, subject: string, htmlContent: string) {
    const apiKey = env.get('BREVO_API_KEY')
    const senderEmail = env.get('BREVO_SENDER_EMAIL')
    const senderName = env.get('BREVO_SENDER_NAME')

    if (!apiKey || !senderEmail || !senderName) {
      console.warn('[BrevoService] Configuration Brevo incomplète dans le .env (BREVO_API_KEY, BREVO_SENDER_EMAIL, BREVO_SENDER_NAME). Envoi d\'e-mail ignoré.')
      return
    }

    try {
      const response = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'api-key': apiKey,
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          sender: { name: senderName, email: senderEmail },
          to: [{ email: toEmail, name: toName }],
          subject,
          htmlContent,
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error(`[BrevoService] Échec de l'envoi de l'e-mail à ${toEmail}. Status: ${response.status}. Erreur: ${errorText}`)
      } else {
        console.log(`[BrevoService] E-mail envoyé avec succès à ${toEmail} (Sujet: "${subject}")`)
      }
    } catch (error) {
      console.error('[BrevoService] Erreur lors de l\'envoi de l\'e-mail:', error)
    }
  }

  /**
   * Envoie un e-mail de confirmation de réception de la demande au client.
   */
  static async sendReceptionConfirmation(
    email: string,
    firstName: string,
    lastName: string,
    reason: string,
    format: string,
    date: string,
    time: string
  ) {
    const subject = 'Demande de rendez-vous reçue - Phila MDT'
    const htmlContent = `
      <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #ea580c; border-bottom: 2px solid #ea580c; padding-bottom: 10px;">Demande de rendez-vous pastoral reçue</h2>
        <p>Bonjour <strong>${firstName} ${lastName}</strong>,</p>
        <p>Nous avons bien reçu votre demande de rendez-vous pastoral. Notre secrétariat l'étudie actuellement.</p>
        
        <div style="background-color: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #475569;">Détails de votre demande :</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 5px 0; font-weight: bold; width: 150px;">Motif :</td>
              <td style="padding: 5px 0;">${reason}</td>
            </tr>
            <tr>
              <td style="padding: 5px 0; font-weight: bold;">Format souhaité :</td>
              <td style="padding: 5px 0; text-transform: capitalize;">${format}</td>
            </tr>
            <tr>
              <td style="padding: 5px 0; font-weight: bold;">Jour souhaité :</td>
              <td style="padding: 5px 0;">${date}</td>
            </tr>
            <tr>
              <td style="padding: 5px 0; font-weight: bold;">Heure souhaitée :</td>
              <td style="padding: 5px 0;">${time}</td>
            </tr>
          </table>
        </div>
        
        <p>Nous vous recontacterons très prochainement pour vous confirmer la date et l'heure définitives.</p>
        <p style="margin-top: 30px; border-top: 1px solid #eee; padding-top: 15px; font-size: 0.9em; color: #666;">
          Que Dieu vous bénisse,<br>
          <strong>L'équipe Phila MDT</strong>
        </p>
      </div>
    `
    await this.send(email, `${firstName} ${lastName}`, subject, htmlContent)
  }

  /**
   * Envoie un e-mail de confirmation définitive du rendez-vous au client.
   */
  static async sendAppointmentConfirmedToClient(
    email: string,
    firstName: string,
    lastName: string,
    reason: string,
    format: string,
    date: string,
    time: string
  ) {
    const subject = 'Votre rendez-vous pastoral est confirmé - Phila MDT'
    const htmlContent = `
      <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #16a34a; border-bottom: 2px solid #16a34a; padding-bottom: 10px;">Rendez-vous pastoral confirmé !</h2>
        <p>Bonjour <strong>${firstName} ${lastName}</strong>,</p>
        <p>Nous avons le plaisir de vous informer que votre rendez-vous pastoral est <strong>confirmé</strong>.</p>
        
        <div style="background-color: #f0fdf4; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #16a34a;">
          <h3 style="margin-top: 0; color: #14532d;">Détails de la rencontre :</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 5px 0; font-weight: bold; width: 150px;">Date :</td>
              <td style="padding: 5px 0; font-size: 1.1em; color: #14532d; font-weight: bold;">${date}</td>
            </tr>
            <tr>
              <td style="padding: 5px 0; font-weight: bold;">Heure :</td>
              <td style="padding: 5px 0; font-size: 1.1em; color: #14532d; font-weight: bold;">${time}</td>
            </tr>
            <tr>
              <td style="padding: 5px 0; font-weight: bold;">Format :</td>
              <td style="padding: 5px 0; text-transform: capitalize;">${format}</td>
            </tr>
            <tr>
              <td style="padding: 5px 0; font-weight: bold;">Motif :</td>
              <td style="padding: 5px 0;">${reason}</td>
            </tr>
          </table>
        </div>
        
        <p>Si vous avez un empêchement, merci de nous contacter au plus vite pour reporter le créneau.</p>
        <p style="margin-top: 30px; border-top: 1px solid #eee; padding-top: 15px; font-size: 0.9em; color: #666;">
          Que Dieu vous bénisse,<br>
          <strong>L'équipe Phila MDT</strong>
        </p>
      </div>
    `
    await this.send(email, `${firstName} ${lastName}`, subject, htmlContent)
  }

  /**
   * Envoie un e-mail de notification au pasteur concernant un nouveau rendez-vous confirmé.
   */
  static async sendAppointmentConfirmedToPastor(
    clientFirstName: string,
    clientLastName: string,
    clientPhone: string,
    clientEmail: string | null,
    reason: string,
    format: string,
    date: string,
    time: string
  ) {
    const pastorEmail = env.get('PASTOR_EMAIL')
    if (!pastorEmail) {
      console.warn('[BrevoService] PASTOR_EMAIL non défini. Notification au pasteur ignorée.')
      return
    }

    const subject = `Nouveau rendez-vous programmé - ${clientFirstName} ${clientLastName}`
    const htmlContent = `
      <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px;">Nouveau rendez-vous pastoral confirmé</h2>
        <p>Bonjour Pasteur,</p>
        <p>Un rendez-vous pastoral a été programmé/confirmé dans votre agenda.</p>
        
        <div style="background-color: #eff6ff; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #1e3a8a;">Détails du rendez-vous :</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 5px 0; font-weight: bold; width: 150px;">Date & Heure :</td>
              <td style="padding: 5px 0; font-weight: bold; color: #1e3a8a;">Le ${date} à ${time}</td>
            </tr>
            <tr>
              <td style="padding: 5px 0; font-weight: bold;">Format :</td>
              <td style="padding: 5px 0; text-transform: capitalize;">${format}</td>
            </tr>
            <tr>
              <td style="padding: 5px 0; font-weight: bold;">Visiteur :</td>
              <td style="padding: 5px 0;">${clientFirstName} ${clientLastName}</td>
            </tr>
            <tr>
              <td style="padding: 5px 0; font-weight: bold;">Téléphone :</td>
              <td style="padding: 5px 0;"><a href="tel:${clientPhone}">${clientPhone}</a></td>
            </tr>
            <tr>
              <td style="padding: 5px 0; font-weight: bold;">E-mail :</td>
              <td style="padding: 5px 0;">${clientEmail ? `<a href="mailto:${clientEmail}">${clientEmail}</a>` : 'Non fourni'}</td>
            </tr>
            <tr>
              <td style="padding: 5px 0; font-weight: bold;">Motif :</td>
              <td style="padding: 5px 0;">${reason}</td>
            </tr>
          </table>
        </div>
        
        <p style="margin-top: 30px; border-top: 1px solid #eee; padding-top: 15px; font-size: 0.9em; color: #666;">
          Ceci est une notification automatique de votre application.<br>
          <strong>Phila MDT</strong>
        </p>
      </div>
    `
    await this.send(pastorEmail, 'Pasteur Phila', subject, htmlContent)
  }
}
