import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UsersController {
  public async store({ response, session }: HttpContextContract) {
    console.log(session.get('username'))
    console.log('posting data')
    response.redirect().back()
  }
  public async index() {
    return [
      {
        id: 1,
        title: 'Hello world',
      },
      {
        id: 2,
        title: 'Hello universe',
      },
    ]
  }
}
