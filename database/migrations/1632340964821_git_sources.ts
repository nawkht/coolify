import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class GitSources extends BaseSchema {
  protected tableName = 'git_sources'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id').primary()

      table.string('name').unique()
      table.string('type')

      table.string('api_url')
      table.string('html_url')
      table.string('organization')

      table.string('github_app_id').references('github_apps.id')
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
