import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'cellules'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name').notNullable()
      table.text('description').notNullable()
      table.string('horaire').notNullable()
      table.string('adresse').notNullable()
      table.string('contact').notNullable()

      // FK vers le membre responsable
      table
        .integer('responsable_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('members')
        .onDelete('SET NULL')

      table.timestamp('created_at').nullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
