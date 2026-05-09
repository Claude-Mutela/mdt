import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'events'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.string('name', 300).notNullable()
      table.string('cover_img', 500).nullable()
      table.string('url_img', 500).nullable()
      table.text('description').nullable()
      table.text('content').nullable()
      table.string('place', 300).nullable()
      table.date('date').nullable()
      table
        .enu('status', ['a_venir', 'en_cours', 'termine', 'annule'])
        .notNullable()
        .defaultTo('a_venir')
      table
        .integer('cat_event_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('cat_event')
        .onDelete('RESTRICT')
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
