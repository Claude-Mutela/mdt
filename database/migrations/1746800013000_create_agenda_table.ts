import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'agenda'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.date('day').notNullable()
      table.string('title', 300).notNullable()
      table.time('hour_start').nullable()
      table.time('hour_end').nullable()
      table.string('place', 300).nullable()
      table
        .integer('cat_activity_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('cat_activity')
        .onDelete('RESTRICT')
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
