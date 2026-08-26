import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'
import { DateTime } from 'luxon'

export default class extends BaseSeeder {
  async run() {
    const email = 'claudemutela9@gmail.com'
    const password = 'Motdepasse@98'
    const fullName = 'claude mutela'
    const firstname = 'claude'
    const lastname = 'mutela'
    const status = 'actif'
    const role = 'superadmin'

    let user = await User.findBy('email', email)

    if (user) {
      user.fullName = fullName
      user.firstname = firstname
      user.lastname = lastname
      user.password = password
      user.status = status
      user.role = role
      user.emailVerifiedAt = DateTime.now()
      await user.save()
    } else {
      user = await User.create({
        fullName,
        firstname,
        lastname,
        email,
        password,
        status,
        role,
        emailVerifiedAt: DateTime.now(),
      })
    }
  }
}