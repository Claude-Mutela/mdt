import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'newcomers'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.date('date').notNullable()
      table.string('lastname', 100).notNullable()
      table.string('firstname', 100).notNullable()
      table.string('gender', 5).notNullable() // 'M' or 'F'
      table.string('phone', 50).nullable()
      table.string('email', 150).nullable()
      table.string('profession', 150).nullable()
      table.string('marital_status', 50).nullable() // célibataire, marié, etc.
      table.string('city', 100).nullable()
      table.text('address').nullable()
      table.string('heard_about', 100).notNullable() // invitation, evangelisation, reseaux_sociaux, famille_philadelphie, etc.
      table.boolean('come_back').notNullable().defaultTo(false)
      table.boolean('baptized').notNullable().defaultTo(false)
      table.boolean('spiritual_followup').notNullable().defaultTo(false)
      table.boolean('receive_jesus').notNullable().defaultTo(false)
      table.boolean('join_cell').notNullable().defaultTo(false)
      table.boolean('serve').notNullable().defaultTo(false)
      table.text('suggestions').nullable()

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}