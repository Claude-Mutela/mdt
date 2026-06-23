import User from '#models/user'
import { HttpContext } from '@adonisjs/core/http'
import { RecaptchaService } from '#services/recaptcha_service'
import env from '#start/env'
import { errors as vineErrors } from '@vinejs/vine'

export default class AuthController {
  /**
   * Afficher la page de connexion
   */
  async showLogin({ inertia }: HttpContext) {
    const siteKey = env.get('RECAPTCHA_SITE_KEY') || ''
    return inertia.render('auth/login', {
      recaptchaSiteKey: siteKey,
    })
  }

  /**
   * Gérer la soumission du formulaire de connexion
   */
  async login({ request, auth, response, session }: HttpContext) {
    const { email, password, remember } = request.only(['email', 'password', 'remember'])

    // 1. Vérification reCAPTCHA
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
      // 2. Vérifier les identifiants
      const user = await User.verifyCredentials(email, password)

      // 3. Vérifier si l'utilisateur est actif
      if (user.status !== 'actif') {
        session.flash('inputErrorsBag', {
          auth: 'Votre compte est inactif ou suspendu. Veuillez contacter un administrateur.',
        })
        return response.redirect().back()
      }

      // 4. Connecter l'utilisateur
      await auth.use('web').login(user, !!remember)

      // 5. Rediriger vers la page appropriée selon le rôle
      if (user.role === 'tresorier' || user.role === 'financier') {
        return response.redirect().toPath('/admin/finances')
      } else if (user.role === 'mdtcom') {
        return response.redirect().toPath('/admin/agenda')
      } else if (user.role === 'administration' || user.role === 'user') {
        return response.redirect().toPath('/admin/membres')
      } else if (user.role === 'porte_integration') {
        return response.redirect().toPath('/admin/nouveaux-venus')
      }

      return response.redirect().toPath('/admin')
    } catch (error) {
      session.flash('inputErrorsBag', {
        auth: 'Identifiants invalides.',
      })
      return response.redirect().back()
    }
  }

  /**
   * Déconnexion
   */
  async logout({ auth, response }: HttpContext) {
    await auth.use('web').logout()
    return response.redirect().toPath('/login')
  }
}