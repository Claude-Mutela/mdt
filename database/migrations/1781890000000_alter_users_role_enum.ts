import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table
        .enu('role', [
          'admin',
          'user',
          'pasteur',
          'superadmin',
          'tresorier',
          'financier',
          'mdtcom',
          'administration',
        ])
        .alter()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.enu('role', ['admin', 'user', 'pasteur', 'superadmin']).alter()
    })
  }
}
