import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { createUserValidator, updateUserValidator } from '#validators/admin_user'
import { BrevoService } from '#services/brevo_service'
import router from '@adonisjs/core/services/router'
import env from '#start/env'

export default class AdminUsersController {
  async index({ inertia, request }: HttpContext) {
    const page = request.input('page', 1)
    const users = await User.query().orderBy('id', 'desc').paginate(page, 15)
    return inertia.render('admin/users' as any, { users })
  }

  async store({ request, response, session }: HttpContext) {
    const data = await request.validateUsing(createUserValidator)
    const rawPassword = data.password

    const user = await User.create({
      ...data,
      status: 'en_attente',
    })

    // Génération du lien de validation signé (expire dans 2 heures)
    const relativeUrl = router.makeSignedUrl('auth.verify_email', { id: user.id }, { expiresIn: '2h' })

    // Prise en compte dynamique de l'URL du domaine (philamdt.church en prod ou request host en dev)
    const appUrl = env.get('APP_URL')
    let baseUrl: string
    if (appUrl && !appUrl.includes('localhost') && !appUrl.includes('127.0.0.1')) {
      baseUrl = appUrl
    } else {
      const host = request.header('host') || 'philamdt.church'
      const protocol = request.secure() ? 'https' : 'http'
      baseUrl = `${protocol}://${host}`
    }

    const verificationUrl = `${baseUrl.replace(/\/$/, '')}${relativeUrl}`

    // Envoi de l'e-mail d'activation avec identifiants via Brevo
    await BrevoService.sendUserAccountCreated(
      user.email,
      user.fullName || `${user.firstname || ''} ${user.lastname || ''}`.trim() || user.email,
      rawPassword,
      verificationUrl
    )

    session.flash('success', 'Utilisateur créé avec succès et e-mail envoyé.')
    return response.redirect().back()
  }


  async update({ params, request, response, session }: HttpContext) {
    const user = await User.findOrFail(params.id)

    const { params: _, ...payload } = await request.validateUsing(updateUserValidator, {
      meta: { userId: user.id },
    })

    if (!payload.password) {
      delete payload.password
    }

    user.merge(payload)
    await user.save()

    // Notification par e-mail de mise à jour du compte
    await BrevoService.sendUserAccountUpdated(
      user.email,
      user.fullName || `${user.firstname || ''} ${user.lastname || ''}`.trim() || user.email
    )

    session.flash('success', 'Utilisateur mis à jour avec succès et e-mail envoyé.')
    return response.redirect().back()
  }

  async destroy({ params, response, session }: HttpContext) {
    const user = await User.findOrFail(params.id)
    const userEmail = user.email
    const userName = user.fullName || `${user.firstname || ''} ${user.lastname || ''}`.trim() || user.email

    await user.delete()

    // Notification par e-mail de suppression du compte
    await BrevoService.sendUserAccountDeleted(userEmail, userName)

    session.flash('success', 'Utilisateur supprimé avec succès et e-mail envoyé.')
    return response.redirect().back()
  }
}

