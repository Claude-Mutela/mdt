import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'galery'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.string('title', 300).notNullable()
      table.string('cover_img', 500).nullable()
      table.string('url_img', 500).nullable()
      table.integer('img_nber').unsigned().defaultTo(0)
      table
        .integer('cat_galery_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('cat_galery')
        .onDelete('RESTRICT')
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
