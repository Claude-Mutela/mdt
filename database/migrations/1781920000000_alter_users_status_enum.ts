import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table
        .enu('status', ['en_attente', 'actif', 'inactif', 'suspendu'])
        .notNullable()
        .defaultTo('en_attente')
        .alter()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.enu('status', ['actif', 'inactif', 'suspendu']).notNullable().defaultTo('actif').alter()
    })
  }
}
