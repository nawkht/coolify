import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import DestinationDocker from 'App/Models/DestinationDocker'

export default class DestinationDockerSeeder extends BaseSeeder {
  public static developmentOnly = true
  public async run() {
    await DestinationDocker.fetchOrCreateMany('name', [
      {
        name: 'Local Docker',
        engine: '/var/run/docker.sock',
        network: 'coollabs-dev',
        isSwarm: false,
      },
    ])
  }
}
