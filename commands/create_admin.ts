import { BaseCommand, flags } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import User from '#models/user'
import { DateTime } from 'luxon'

export default class CreateAdmin extends BaseCommand {
  static commandName = 'create:admin'
  static description = 'Inject or update a superadmin user in the database'

  static options: CommandOptions = {
    startApp: true,
  }

  @flags.string({ description: 'User full name', default: 'claude mutela' })
  declare name: string

  @flags.string({ description: 'User email', default: 'claudemutela9@gmail.com' })
  declare email: string

  @flags.string({ description: 'User password', default: 'Motdepasse@98' })
  declare password: string

  @flags.string({ description: 'User role', default: 'superadmin' })
  declare role: string

  @flags.string({ description: 'User status', default: 'actif' })
  declare status: string

  async run() {
    this.logger.info(`Injecting user ${this.email}...`)

    const [firstname = '', ...rest] = this.name.split(' ')
    const lastname = rest.join(' ')

    let user = await User.findBy('email', this.email)

    if (user) {
      user.fullName = this.name
      user.firstname = firstname
      user.lastname = lastname
      user.password = this.password
      user.status = this.status
      user.role = this.role
      user.emailVerifiedAt = DateTime.now()
      await user.save()
      this.logger.success(
        `User ${this.email} already existed and was updated successfully! (Role: ${this.role}, Status: ${this.status})`
      )
    } else {
      user = await User.create({
        fullName: this.name,
        firstname,
        lastname,
        email: this.email,
        password: this.password,
        status: this.status,
        role: this.role,
        emailVerifiedAt: DateTime.now(),
      })
      this.logger.success(
        `User ${this.email} created successfully! (Role: ${this.role}, Status: ${this.status})`
      )
    }
  }
}
