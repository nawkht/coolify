import Route from '@ioc:Adonis/Core/Route'
import Application from 'App/Models/Application'
import GithubApp from 'App/Models/GithubApp'
import GitSource from 'App/Models/GitSource'
import got from 'got'

Route.group(() => {
  Route.get('/', async ({ response }) => {
    return response.redirect('/dashboard')
  })

  Route.get('/healthz', async () => {
    return 'OK'
  })

  Route.post('/applications/repository/isAvailable', async ({ request, response }) => {
    const { repository, branch } = request.body()
    const repositoryFound = await Application.findBy('repository', repository)
    if (repositoryFound?.branch === branch) {
      return response
        .status(409)
        .send(`Repository and branch is already configured on ${repositoryFound?.name}.`)
    }
    return 'OK'
  })


  Route.get('/webhooks/github/installation', async ({ request, response }) => {
    const { gitSourceId, installation_id } = request.qs()
    const gitSource = await GitSource.findOrFail(gitSourceId)
    await gitSource.load('githubApp')
    await gitSource.githubApp.merge({ installationId: installation_id }).save()
    return response.redirect('/settings/sources')
  })

  Route.get('/webhooks/github', async ({ request, response }) => {
    const { code, state } = request.qs()
    const { id, client_id, slug, client_secret, pem, webhook_secret } = await got
      .post(`https://api.github.com/app-manifests/${code}/conversions`)
      .json()
    const githubapp = await GithubApp.create({
      name: slug,
      appId: id,
      clientId: client_id,
      clientSecret: client_secret,
      webhookSecret: webhook_secret,
      privateKey: pem,
    })
    const found = await GitSource.find(state)
    if (found) {
      await githubapp.related('gitSource').save(found)
    } else {
      return `Something went wrong. Not found Git Source with id of ${state}.`
    }
    await response.redirect('/settings/sources')
  })
}).prefix('api/v1')
