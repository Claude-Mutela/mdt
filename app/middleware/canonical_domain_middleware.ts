import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import env from '#start/env'

export default class CanonicalDomainMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    const rawAppUrl = env.get('APP_URL') || 'https://philamdt.church'
    const appUrl =
      (rawAppUrl.includes('localhost') || rawAppUrl.includes('127.0.0.1')) &&
      env.get('NODE_ENV') === 'production'
        ? 'https://philamdt.church'
        : rawAppUrl.replace(/\/+$/, '')

    // Extraction de l'hôte de la requête (sans le port)
    const hostHeader = (ctx.request.header('host') || '').split(':')[0].toLowerCase()

    // Liste des hôtes autorisés
    const allowedHosts = ['philamdt.church', 'www.philamdt.church', 'localhost', '127.0.0.1']

    // En production, si la requête provient d'un domaine pirate / non autorisé, rejet immédiat
    if (env.get('NODE_ENV') === 'production' && hostHeader && !allowedHosts.includes(hostHeader)) {
      return ctx.response.status(403).send('Access denied: Unauthorized Host header')
    }

    // Calcul de l'URL canonique normalisée (sans les paramètres query de tracking comme ?fbclid, ?gclid, etc.)
    const pathname = (ctx.request.url().split('?')[0] || '/').replace(/\/+$/, '') || '/'
    const canonicalUrl = `${appUrl}${pathname === '/' ? '' : pathname}`

    // Partage dans le contexte Edge
    if (ctx.view) {
      ctx.view.share({
        canonicalUrl,
        appUrl,
      })
    }

    return next()
  }
}
