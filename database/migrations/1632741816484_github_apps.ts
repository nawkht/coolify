import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class GithubApps extends BaseSchema {
  protected tableName = 'github_apps'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id').primary()
      table.string('name').unique()
      table.string('git_id')

      table.integer('app_id')
      table.integer('installation_id')
      table.string('client_id')
      table.string('client_secret')
      table.string('webhook_secret')
      table.string('private_key')
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
