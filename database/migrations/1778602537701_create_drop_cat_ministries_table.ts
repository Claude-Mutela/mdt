import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  async up() {
    this.schema.alterTable('ministries', (table) => {
      // Supprimer la clé étrangère d'abord
      table.dropForeign(['cat_ministry_id'])
      // Supprimer la colonne
      table.dropColumn('cat_ministry_id')
    })

    this.schema.dropTable('cat_ministries')
  }

  async down() {
    this.schema.createTable('cat_ministries', (table) => {
      table.increments('id').notNullable()
      table.string('cat_min_name', 100).notNullable()
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })

    this.schema.alterTable('ministries', (table) => {
      table
        .integer('cat_ministry_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('cat_ministries')
        .onDelete('RESTRICT')
    })
  }
}