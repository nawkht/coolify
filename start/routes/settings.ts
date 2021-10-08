import Route from '@ioc:Adonis/Core/Route'
import DestinationDocker from 'App/Models/DestinationDocker'
import GitSource from 'App/Models/GitSource'

Route.get('/settings', async ({ view }) => {
  return view.render('pages/settings/index')
})

Route.get('/settings/sources', async ({ view }) => {
  const gitSources = await GitSource.query().preload('githubApp')
  return view.render('pages/settings/sources/index', { gitSources })
})

Route.get('/settings/sources/new', async ({ view }) => {
  return view.render('pages/settings/sources/new')
})

Route.post('/settings/sources/new', async ({ request, response, view }) => {
  const { name, type, htmlUrl, apiUrl, organization } = request.body()
  console.log({ name, type, htmlUrl, apiUrl, organization })
  try {
    await GitSource.findByOrFail('name', name)
    return view.render('pages/settings/sources/new', { error: 'Name already in use.' })
  } catch (error) {
    await GitSource.create({ name, type, htmlUrl, apiUrl, organization })
    return response.redirect('/settings/sources')
  }
})

Route.delete('/settings/sources/delete', async ({ request, response }) => {
  const { gitId } = request.body()
  try {
    const gitSource = await GitSource.findOrFail(gitId)
    await gitSource.delete()
    return response.send({ message: 'Git Source deleted successfully.' })
  } catch (error) {
    return response.status(500).send({ error: 'Cannot delete Git Source.' })
  }

})

Route.get('/settings/destinations', async ({ view }) => {
  const dockers = await DestinationDocker.all()
  return view.render('pages/settings/destinations/index', { dockers })
})

Route.post('/settings/destinations/new', async ({ view, request, response }) => {
  const { name, engine, network } = request.body()
  let { isSwarm } = request.body()
  try {
    await DestinationDocker.findByOrFail('name', name)
    return view.render('pages/settings/destinations/new', { error: 'Name already in use.' })
  } catch (error) {
    if (!isSwarm) {
      isSwarm = 0
    } else {
      isSwarm = 1
    }
    await DestinationDocker.create({ name, isSwarm, engine, network })
    return response.redirect('/settings/destinations')
  }
})

Route.get('/settings/destinations/new', async ({ view }) => {
  return view.render('pages/settings/destinations/new')
})
