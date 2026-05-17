import type { HttpContext } from '@adonisjs/core/http'
import Member from '#models/member'
import Ministry from '#models/ministry'
import { memberValidator } from '#validators/member'
import { DateTime } from 'luxon'

export default class AdminMembersController {
  /**
   * Afficher la liste des membres
   */
  async index({ inertia, request }: HttpContext) {
    const page = request.input('page', 1)
    const ministryId = request.input('ministryId')
    const search = request.input('search')

    const query = Member.query()
      .preload('ministry')
      .preload('user')
      .orderBy('createdAt', 'desc')

    if (ministryId) {
      query.where('ministryId', ministryId)
    }

    if (search) {
      query.where((q) => {
        q.where('firstname', 'like', `%${search}%`)
          .orWhere('lastname', 'like', `%${search}%`)
          .orWhere('email', 'like', `%${search}%`)
          .orWhere('phone', 'like', `%${search}%`)
      })
    }

    const members = await query.paginate(page, 15)
    const ministries = await Ministry.all()

    return inertia.render('admin/membres' as any, { 
      members,
      ministries,
      filters: { ministryId, search }
    })
  }

  /**
   * Créer un nouveau membre
   */
  async store({ request, response, session }: HttpContext) {
    const data = await request.validateUsing(memberValidator)
    
    try {
      
      const member = new Member()
      member.fill({
        firstname: data.firstname,
        lastname: data.lastname,
        email: data.email,
        phone: data.phone,
        gender: data.gender,
        statut: data.statut,
        typeMember: data.typeMember,
        ministryId: data.ministryId,
        userId: data.userId,
      })

      if (data.dateIntegration) {
        member.dateIntegration = DateTime.fromISO(data.dateIntegration)
      }

      await member.save()
      session.flash('success', 'Membre ajouté avec succès.')
    } catch (error) {
      console.error(error)
      session.flash('error', "Erreur lors de l'ajout du membre.")
    }
    return response.redirect().back()
  }

  /**
   * Mettre à jour un membre
   */
  async update({ params, request, response, session }: HttpContext) {
    const data = await request.validateUsing(memberValidator)
    
    try {
      const member = await Member.findOrFail(params.id)
      
      member.merge({
        firstname: data.firstname,
        lastname: data.lastname,
        email: data.email,
        phone: data.phone,
        gender: data.gender,
        statut: data.statut,
        typeMember: data.typeMember,
        ministryId: data.ministryId,
        userId: data.userId,
      })

      if (data.dateIntegration) {
        member.dateIntegration = DateTime.fromISO(data.dateIntegration)
      } else {
        member.dateIntegration = null
      }

      await member.save()
      session.flash('success', 'Membre mis à jour avec succès.')
    } catch (error) {
      console.error(error)
      session.flash('error', "Erreur lors de la mise à jour du membre.")
    }
    return response.redirect().back()
  }

  /**
   * Supprimer un membre
   */
  async destroy({ params, response, session }: HttpContext) {
    try {
      const member = await Member.findOrFail(params.id)
      await member.delete()
      session.flash('success', 'Membre supprimé avec succès.')
    } catch (error) {
      session.flash('error', "Erreur lors de la suppression du membre.")
    }
    return response.redirect().back()
  }
}
