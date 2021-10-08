import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import GitSource from 'App/Models/GitSource'

export default class GitSourceSeeder extends BaseSeeder {
  public static developmentOnly = true
  public async run() {
    await GitSource.fetchOrCreateMany('name', [
      {
        name: 'GitHub.com(coollabsio)',
        type: 'github',
        htmlUrl: 'https://github.com',
        apiUrl: 'https://api.github.com',
        organization: 'coollabsio',
      },
      {
        name: 'GitHub.com(user)',
        type: 'github',
        htmlUrl: 'https://github.com',
        apiUrl: 'https://api.github.com',
      },
      {
        name: 'GitLab.com',
        type: 'gitlab',
        htmlUrl: 'https://gitlab.com',
        apiUrl: 'https://gitlab.com/api',
      },
    ])
  }
}
