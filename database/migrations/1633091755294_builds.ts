import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Builds extends BaseSchema {
  protected tableName = 'builds'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id').primary()
      table.string('application_id')
      table.string('destination_docker_id')
      table.string('git_source_id')
      table.string('github_app_id')
      table.string('commit')
      table.string('status').defaultTo('queued')
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
