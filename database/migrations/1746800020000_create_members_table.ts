import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'members'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.string('firstname', 100).notNullable()
      table.string('lastname', 100).notNullable()
      table.string('email', 255).nullable()
      table.string('cover_img', 500).nullable()
      table.string('phone', 30).nullable()
      table.enu('gender', ['M', 'F']).nullable()
      table.date('date_integration').nullable()
      table
        .enu('statut', ['actif', 'inactif'])
        .notNullable()
        .defaultTo('actif')
      table
        .enu('type_member', ['responsable', 'membre', 'visiteur'])
        .nullable()
      table
        .integer('ministry_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('ministries')
        .onDelete('SET NULL')
      table
        .integer('user_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('users')
        .onDelete('SET NULL')
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
