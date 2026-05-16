import type { HttpContext } from '@adonisjs/core/http'
import Member from '#models/member'
import Ministry from '#models/ministry'
import { memberValidator } from '#validators/member'
import { DateTime } from 'luxon'

export default class AdminMembersController {
  /**
   * Afficher la liste des membres
   */
  async index({ inertia }: HttpContext) {
    const members = await Member.query()
      .preload('ministry')
      .preload('user')
      .orderBy('createdAt', 'desc')
    
    const ministries = await Ministry.all()
    
    return inertia.render('admin/membres' as any, { 
      members,
      ministries 
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
