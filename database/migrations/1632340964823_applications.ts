import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Applications extends BaseSchema {
  protected tableName = 'applications'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id').primary()
      table.string('name').unique()
      table.string('domain').unique()

      table.string('repository')
      table.string('branch')
      table.string('build_pack')

      table.integer('port')
      table.string('install_command')
      table.string('build_command')
      table.string('start_command')
      table.string('config_hash')

      table.string('destination_docker_id').references('destination_dockers.id')

      table.string('git_source_id').references('git_sources.id')
      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
