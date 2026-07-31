import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'images'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.string('title', 300).nullable()
      table.string('url', 500).notNullable()
      table.date('date').nullable()
      table
        .integer('galery_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('galery')
        .onDelete('CASCADE')
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
