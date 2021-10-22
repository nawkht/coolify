import View from '@ioc:Adonis/Core/View'
import Application from '@ioc:Adonis/Core/Application'

View.global('version', Application.version!.toString())