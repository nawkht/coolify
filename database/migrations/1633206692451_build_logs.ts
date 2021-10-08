import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class BuildLogs extends BaseSchema {
  protected tableName = 'build_logs'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id').primary()
      table.string('build_id')
      table.string('line')
      table.string('time')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
