import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'events'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('cover_img')
      table.date('date_fin').nullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('cover_img', 500).nullable()
      table.dropColumn('date_fin')
    })
  }
}