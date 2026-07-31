import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'finance_operations_history'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('operation_id').unsigned().notNullable()
      table.enum('action', ['CREATE', 'UPDATE', 'DELETE']).notNullable()
      
      // Données sérialisées en JSON
      table.json('old_values').nullable()
      table.json('new_values').nullable()

      // Auteur de la modification
      table
        .integer('changed_by')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('users')
        .onDelete('SET NULL')

      table.timestamp('changed_at').notNullable().defaultTo(this.raw('CURRENT_TIMESTAMP'))
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
