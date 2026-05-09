import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'media'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.string('title', 300).notNullable()
      table
        .enu('format', ['audio', 'video', 'texte', 'podcast'])
        .notNullable()
        .defaultTo('video')
      table.string('file', 500).nullable()
      table.string('url_file', 500).nullable()
      table.string('orateur', 200).nullable()
      table.integer('duration').unsigned().nullable() // en secondes
      table.date('date').nullable()
      table
        .integer('cat_media_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('cat_media')
        .onDelete('RESTRICT')
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
