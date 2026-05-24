import User from '#models/user'
import { HttpContext } from '@adonisjs/core/http'

export default class AuthController {
  /**
   * Afficher la page de connexion
   */
  async showLogin({ inertia }: HttpContext) {
    return inertia.render('auth/login', {})
  }

  /**
   * Gérer la soumission du formulaire de connexion
   */
  async login({ request, auth, response, session }: HttpContext) {
    const { email, password, remember } = request.only(['email', 'password', 'remember'])

    try {
      // 1. Vérifier les identifiants
      const user = await User.verifyCredentials(email, password)

      // 2. Vérifier si l'utilisateur est actif
      if (user.status !== 'actif') {
        session.flash('inputErrorsBag', {
          auth: 'Votre compte est inactif ou suspendu. Veuillez contacter un administrateur.',
        })
        return response.redirect().back()
      }

      // 3. Connecter l'utilisateur
      await auth.use('web').login(user, !!remember)

      // 4. Rediriger vers le dashboard
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