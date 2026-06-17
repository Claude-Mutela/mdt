import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'finance_categories'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name', 100).notNullable()
      table.enum('type', ['entrée', 'sortie']).notNullable()
      
      table.timestamp('created_at').nullable()
      table.timestamp('updated_at').nullable()

      // Empêche d'avoir des doublons de catégorie de même type
      table.unique(['name', 'type'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
