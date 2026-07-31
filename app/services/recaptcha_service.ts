import env from '#start/env'

export class RecaptchaService {
  /**
   * Vérifie la validité d'un token reCAPTCHA auprès des serveurs de Google.
   * Retourne true si valide ou si les clés ne sont pas configurées (fallback dev local).
   */
  static async verifyToken(token: string | null | undefined): Promise<boolean> {
    const secretKey = env.get('RECAPTCHA_SECRET_KEY')

    // Si la clé secrète n'est pas définie, on bypass la vérification pour ne pas bloquer le dev local
    if (!secretKey) {
      console.warn('[RecaptchaService] RECAPTCHA_SECRET_KEY non configurée dans le .env. Validation reCAPTCHA ignorée.')
      return true
    }

    if (!token) {
      console.warn('[RecaptchaService] Tentative de validation avec un token vide ou inexistant.')
      return false
    }

    try {
      const params = new URLSearchParams()
      params.append('secret', secretKey)
      params.append('response', token)

      const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString(),
      })

      if (!response.ok) {
        console.error(`[RecaptchaService] Réponse HTTP invalide de Google verify API: ${response.status}`)
        return false
      }

      const data = await response.json() as { success: boolean; 'error-codes'?: string[] }

      if (!data.success) {
        console.warn(`[RecaptchaService] Validation échouée. Erreurs renvoyées par Google:`, data['error-codes'] || [])
        return false
      }

      console.log('[RecaptchaService] Token reCAPTCHA validé avec succès par Google.')
      return true
    } catch (error) {
      console.error('[RecaptchaService] Erreur lors de la communication avec Google Verify:', error)
      return false
    }
  }
}
