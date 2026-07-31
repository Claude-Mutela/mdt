import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'exchange_rates'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.date('date').notNullable()
      table.string('devise_source', 3).notNullable()
      table.string('devise_cible', 3).notNullable().defaultTo('USD')
      table.decimal('taux', 12, 4).notNullable()
      
      table.timestamp('created_at').nullable()
      table.timestamp('updated_at').nullable()

      // Contrainte d'unicité sur la date et la paire de devises
      table.unique(['date', 'devise_source', 'devise_cible'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
