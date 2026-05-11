import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'appointments'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('last_name').notNullable()
      table.string('first_name').notNullable()
      table.string('phone').notNullable()
      table.string('email').nullable()
      table.string('reason').notNullable()
      table.enum('format', ['presentiel', 'en ligne']).notNullable()
      table.date('appointment_date').notNullable()
      table.string('appointment_time').notNullable()
      table.enum('status', ['pending', 'confirmed', 'cancelled']).defaultTo('pending')

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}