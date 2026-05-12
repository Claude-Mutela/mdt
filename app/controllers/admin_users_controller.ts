import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import hash from '@adonisjs/core/services/hash'
import { createUserValidator, updateUserValidator } from '#validators/admin_user'

export default class AdminUsersController {
  async index({ inertia, request }: HttpContext) {
    const page = request.input('page', 1)
    const users = await User.query().orderBy('id', 'desc').paginate(page, 15)
    return inertia.render('admin/users' as any, { users })
  }

  async store({ request, response, session }: HttpContext) {
    const data = await request.validateUsing(createUserValidator)
    
    await User.create(data)
    session.flash('success', 'Utilisateur créé avec succès')
    return response.redirect().back()
  }

  async update({ params, request, response, session }: HttpContext) {
    const user = await User.findOrFail(params.id)
    
    const { params: _, ...payload } = await request.validateUsing(updateUserValidator, {
      meta: { userId: user.id }
    })

    if (!payload.password) {
      delete payload.password
    }

    user.merge(payload)
    await user.save()

    session.flash('success', 'Utilisateur mis à jour avec succès')
    return response.redirect().back()
  }

  async destroy({ params, response, session }: HttpContext) {
    const user = await User.findOrFail(params.id)
    await user.delete()
    session.flash('success', 'Utilisateur supprimé avec succès')
    return response.redirect().back()
  }
}
