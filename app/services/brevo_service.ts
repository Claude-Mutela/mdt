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
   * Envoie un e-mail via la configuration Brevo dédiée au formulaire de contact
   * (CONTACT_BREVO_API_KEY / CONTACT_SENDER_EMAIL / CONTACT_SENDER_NAME).
   * Complètement séparé du circuit rendez-vous.
   */
  private static async sendContact(
    toEmail: string,
    toName: string,
    subject: string,
    htmlContent: string
  ) {
    const apiKey = env.get('CONTACT_BREVO_API_KEY')
    const senderEmail = env.get('CONTACT_SENDER_EMAIL')
    const senderName = env.get('CONTACT_SENDER_NAME')

    if (!apiKey || !senderEmail || !senderName) {
      console.warn('[BrevoService/Contact] Configuration Brevo contact incomplète (CONTACT_BREVO_API_KEY, CONTACT_SENDER_EMAIL, CONTACT_SENDER_NAME). Envoi ignoré.')
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
        console.error(`[BrevoService/Contact] Échec envoi à ${toEmail}. Status: ${response.status}. Erreur: ${errorText}`)
      } else {
        console.log(`[BrevoService/Contact] E-mail envoyé avec succès à ${toEmail} (Sujet: "${subject}")`)
      }
    } catch (error) {
      console.error('[BrevoService/Contact] Erreur lors de l\'envoi:', error)
    }
  }

  /**
   * Notifie le secrétariat (SECRETARIAT_EMAIL) d'un nouveau message de contact.
   * Utilise la clé Brevo Contact (CONTACT_BREVO_API_KEY).
   */
  static async sendContactMessageToChurch(
    senderName: string,
    senderEmail: string,
    subject: string,
    message: string
  ) {
    const recipientEmail = env.get('SECRETARIAT_EMAIL')
    if (!recipientEmail) {
      console.warn('[BrevoService/Contact] SECRETARIAT_EMAIL non défini. Notification ignorée.')
      return
    }

    const emailSubject = `[Contact MDT] ${subject} — ${senderName}`
    const htmlContent = `
      <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #ea580c; border-bottom: 2px solid #ea580c; padding-bottom: 10px;">Nouveau message depuis le formulaire de contact</h2>
        <p>Bonjour,</p>
        <p>Un visiteur a envoyé un message via le formulaire de contact du site Phila MDT.</p>

        <div style="background-color: #fff7ed; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ea580c;">
          <h3 style="margin-top: 0; color: #9a3412;">Détails du message :</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 6px 0; font-weight: bold; width: 120px; color: #57534e;">Nom :</td>
              <td style="padding: 6px 0;">${senderName}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; font-weight: bold; color: #57534e;">Email :</td>
              <td style="padding: 6px 0;"><a href="mailto:${senderEmail}" style="color: #ea580c;">${senderEmail}</a></td>
            </tr>
            <tr>
              <td style="padding: 6px 0; font-weight: bold; color: #57534e;">Sujet :</td>
              <td style="padding: 6px 0;">${subject}</td>
            </tr>
          </table>
          <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid #fed7aa;">
            <p style="font-weight: bold; color: #57534e; margin-bottom: 6px;">Message :</p>
            <p style="background: #fff; padding: 12px; border-radius: 6px; line-height: 1.6; white-space: pre-wrap;">${message}</p>
          </div>
        </div>

        <p style="margin-top: 30px; border-top: 1px solid #eee; padding-top: 15px; font-size: 0.9em; color: #666;">
          Ceci est une notification automatique de votre site web.<br>
          <strong>Phila MDT</strong>
        </p>
      </div>
    `
    await this.sendContact(recipientEmail, 'Équipe Phila MDT', emailSubject, htmlContent)
  }

  /**
   * Envoie un accusé de réception au visiteur via la clé Brevo Contact.
   */
  static async sendContactAcknowledgement(
    senderName: string,
    senderEmail: string,
    subject: string
  ) {
    const emailSubject = 'Votre message a bien été reçu — Phila MDT'
    const htmlContent = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Message reçu — Phila MDT</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f4f5;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">

  <!-- Wrapper -->
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f4f4f5;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

          <!-- ── HEADER ── -->
          <tr>
            <td style="background:linear-gradient(135deg,#1C1613 0%,#3b1f0e 60%,#ea580c 100%);padding:40px 40px 36px;text-align:center;">
              <!-- Logo text -->
              <div style="display:inline-block;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.15);border-radius:100px;padding:6px 20px;margin-bottom:20px;">
                <span style="color:#f97316;font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase;">Phila MDT</span>
              </div>
              <h1 style="margin:0;color:#ffffff;font-size:26px;font-weight:800;letter-spacing:-0.5px;line-height:1.2;">Phila Maison de Témoignages</h1>
              <p style="margin:8px 0 0;color:rgba(255,255,255,0.6);font-size:13px;font-style:italic;">Votre message a bien été reçu ✓</p>
            </td>
          </tr>

          <!-- ── BODY ── -->
          <tr>
            <td style="padding:40px 40px 32px;">

              <p style="margin:0 0 8px;color:#64748b;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:1px;">Bonjour,</p>
              <h2 style="margin:0 0 24px;color:#0f172a;font-size:22px;font-weight:800;">${senderName} 👋</h2>

              <p style="margin:0 0 16px;color:#374151;font-size:15px;line-height:1.7;">
                Nous avons bien reçu votre message et nous vous en remercions. Notre équipe en prendra connaissance très prochainement et vous répondra dans les meilleurs délais.
              </p>

              <!-- Recap card -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#fff7ed;border-left:4px solid #ea580c;border-radius:0 8px 8px 0;margin:24px 0;">
                <tr>
                  <td style="padding:16px 20px;">
                    <p style="margin:0 0 6px;color:#9a3412;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">Votre demande</p>
                    <p style="margin:0;color:#1c1613;font-size:15px;font-weight:700;">${subject}</p>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 16px;color:#374151;font-size:15px;line-height:1.7;">
                En attendant notre réponse, nous vous invitons à consulter notre site pour découvrir nos activités, nos cultes hebdomadaires et nos événements à venir.
              </p>

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:28px 0;">
                <tr>
                  <td align="center">
                    <a href="https://www.philamdt.church"
                       style="display:inline-block;background:linear-gradient(135deg,#ea580c,#c2410c);color:#ffffff;font-size:15px;font-weight:700;text-decoration:none;padding:14px 36px;border-radius:100px;letter-spacing:0.3px;box-shadow:0 4px 14px rgba(234,88,12,0.35);">
                      Visiter notre site ↗
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:0;color:#374151;font-size:15px;line-height:1.7;">
                Que Dieu vous bénisse abondamment,<br />
                <strong style="color:#0f172a;">L'équipe Phila MDT</strong>
              </p>

            </td>
          </tr>

          <!-- ── DIVIDER ── -->
          <tr>
            <td style="padding:0 40px;">
              <hr style="border:none;border-top:1px solid #e2e8f0;margin:0;" />
            </td>
          </tr>

          <!-- ── FOOTER ── -->
          <tr>
            <td style="padding:28px 40px 36px;text-align:center;background-color:#fafafa;">

              <!-- Church name -->
              <p style="margin:0 0 4px;color:#0f172a;font-size:15px;font-weight:800;letter-spacing:-0.3px;">Phila Maison de Témoignages</p>
              <p style="margin:0 0 16px;color:#64748b;font-size:12px;">Église chrétienne évangélique — Kinshasa, R.D. Congo</p>

              <!-- Address -->
              <p style="margin:0 0 20px;color:#94a3b8;font-size:12px;line-height:1.7;">
                Zoao N°25, Q/ Matonge 1, Blvd Sendwe<br />
                Entrée hôtel Sendwe — BP: 6270, Kinshasa
              </p>

              <!-- Social links -->
              <table cellpadding="0" cellspacing="0" border="0" style="margin:0 auto 20px;">
                <tr>
                  <!-- Facebook -->
                  <td style="padding:0 6px;">
                    <a href="https://www.facebook.com/philamdt" style="display:inline-block;width:36px;height:36px;background-color:#1877f2;border-radius:50%;text-decoration:none;line-height:36px;text-align:center;font-size:16px;color:#ffffff;font-weight:700;">f</a>
                  </td>
                  <!-- YouTube -->
                  <td style="padding:0 6px;">
                    <a href="https://www.youtube.com/@philamdt" style="display:inline-block;width:36px;height:36px;background-color:#ff0000;border-radius:50%;text-decoration:none;line-height:36px;text-align:center;font-size:16px;color:#ffffff;font-weight:700;">▶</a>
                  </td>
                  <!-- Instagram -->
                  <td style="padding:0 6px;">
                    <a href="https://www.instagram.com/philamdt" style="display:inline-block;width:36px;height:36px;background:linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888);border-radius:50%;text-decoration:none;line-height:36px;text-align:center;font-size:14px;color:#ffffff;font-weight:700;">✿</a>
                  </td>
                </tr>
              </table>

              <!-- Legal notice -->
              <p style="margin:0;color:#cbd5e1;font-size:11px;line-height:1.6;">
                Vous recevez cet e-mail car vous avez rempli le formulaire de contact sur notre site.<br />
                © ${new Date().getFullYear()} Phila Maison de Témoignages. Tous droits réservés.
              </p>

            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>
    `
    await this.sendContact(senderEmail, senderName, emailSubject, htmlContent)
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
