import { HttpContext } from '@adonisjs/core/http'
import { NextFn } from '@adonisjs/core/types/http'

export default class RoleMiddleware {
  async handle(
    ctx: HttpContext,
    next: NextFn,
    options: { allowedRoles: string[] }
  ) {
    const user = ctx.auth.user

    // Si l'utilisateur n'est pas connecté (devrait déjà être géré par auth middleware)
    if (!user) {
      return ctx.response.unauthorized('Veuillez vous connecter pour accéder à cette ressource.')
    }

    // Le superadmin a accès à absolument tout
    if (user.role === 'superadmin') {
      return next()
    }

    // Vérifier si le rôle de l'utilisateur est dans la liste des rôles autorisés
    if (options.allowedRoles.includes(user.role)) {
      return next()
    }

    // Si non autorisé, redirection avec message d'erreur ou erreur 403
    return ctx.response.forbidden('Vous n\'avez pas les permissions nécessaires pour accéder à cette page.')
  }
}
