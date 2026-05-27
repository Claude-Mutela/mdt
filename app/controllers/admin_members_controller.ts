import type { HttpContext } from '@adonisjs/core/http'
import Member from '#models/member'
import Ministry from '#models/ministry'
import { memberValidator } from '#validators/member'
import { DateTime } from 'luxon'
import CloudinaryService from '#services/cloudinary_service'

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
   * Imprimer la liste des membres
   */
  async print({ inertia, request }: HttpContext) {
    const ministryId = request.input('ministryId')
    const typeMember = request.input('typeMember')
    
    const query = Member.query()
      .preload('ministry')
      .preload('user')
      .orderBy('firstname', 'asc')

    let filterTitle = "Liste globale des membres des Ministères"

    if (ministryId) {
      query.where('ministryId', ministryId)
      const ministry = await Ministry.find(ministryId)
      if (ministry) {
        filterTitle = `Membres du ministère : ${ministry.name}`
      }
    } else if (typeMember) {
      query.where('typeMember', typeMember)
      filterTitle = `Liste des membres - Type : ${typeMember.charAt(0).toUpperCase() + typeMember.slice(1)}`
    }

    const members = await query.exec()

    return inertia.render('admin/membres_print' as any, { 
      members,
      filterTitle,
      printDate: new Date().toLocaleDateString('fr-FR')
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

      // Handle Cloudinary Upload
      const coverImg = request.file('coverImg')
      if (coverImg && coverImg.tmpPath) {
        const url = await CloudinaryService.upload(coverImg.tmpPath, 'members/avatars')
        member.coverImg = url
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

      // Handle Cloudinary Uploads (Update only if new file provided)
      const coverImg = request.file('coverImg')
      if (coverImg && coverImg.tmpPath) {
        // Delete old image if it exists
        if (member.coverImg) {
          const oldPublicId = CloudinaryService.extractPublicId(member.coverImg)
          if (oldPublicId) {
            await CloudinaryService.delete(oldPublicId)
          }
        }

        const url = await CloudinaryService.upload(coverImg.tmpPath, 'members/avatars')
        member.coverImg = url
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

      // Delete image from Cloudinary if it exists
      if (member.coverImg) {
        const publicId = CloudinaryService.extractPublicId(member.coverImg)
        if (publicId) {
          await CloudinaryService.delete(publicId)
        }
      }

      await member.delete()
      session.flash('success', 'Membre supprimé avec succès.')
    } catch (error) {
      session.flash('error', "Erreur lors de la suppression du membre.")
    }
    return response.redirect().back()
  }

}
