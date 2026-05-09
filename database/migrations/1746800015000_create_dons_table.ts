import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'dons'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.decimal('amount', 15, 2).notNullable()
      table.date('date').notNullable()
      table
        .enu('status', ['en_attente', 'confirme', 'rejete', 'rembourse'])
        .notNullable()
        .defaultTo('en_attente')
      table.string('donateur', 300).nullable()
      table
        .integer('cat_don_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('cat_don')
        .onDelete('RESTRICT')
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
