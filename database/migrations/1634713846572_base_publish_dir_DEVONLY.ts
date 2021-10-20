import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class BasePublishDir extends BaseSchema {
  protected tableName = 'applications'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('base_directory')
      table.string('publish_directory')
    })
  }

  public async down () {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('base_directory')
      table.dropColumn('publish_directory')
    })
  }
}
