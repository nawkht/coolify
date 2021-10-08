import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Application from 'App/Models/Application'

export default class ApplicationSeeder extends BaseSeeder {
  public static developmentOnly = true
  public async run() {
    await Application.fetchOrCreateMany('name', [
      {
        name: 'coollabs.io',
      },
      {
        name: 'coolify.io',
      },
    ])
  }
}
