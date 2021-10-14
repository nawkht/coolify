import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Forcessls extends BaseSchema {
  protected tableName = 'applications'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.boolean('force_ssl').defaultTo(false)
    })
  }

  public async down () {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('force_ssl')
    })
  }
}
