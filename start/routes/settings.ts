import Route from '@ioc:Adonis/Core/Route'

Route.get('/settings', async ({ view }) => {
  return view.render('pages/settings/index')
})
