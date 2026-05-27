import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  async up() {
    this.schema.alterTable('ministries', (table) => {
      table.string('slug').nullable()
    })
    this.schema.alterTable('events', (table) => {
      table.string('slug').nullable()
    })
  }

  async down() {
    this.schema.alterTable('ministries', (table) => {
      table.dropColumn('slug')
    })
    this.schema.alterTable('events', (table) => {
      table.dropColumn('slug')
    })
  }
}