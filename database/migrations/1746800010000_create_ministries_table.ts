import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'ministries'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.string('name', 200).notNullable()
      table.text('description').nullable()
      table.text('content').nullable()
      table.string('cover_img', 500).nullable()
      table.string('url_img', 500).nullable()
      table.string('badge_color', 50).nullable()
      table.string('tag', 100).nullable()
      table
        .integer('cat_ministry_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('cat_ministries')
        .onDelete('RESTRICT')
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
