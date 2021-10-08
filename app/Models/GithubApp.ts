import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, column, HasOne, hasOne } from '@ioc:Adonis/Lucid/Orm'
import cuid from 'cuid'
import GitSource from './GitSource'

export default class GithubApp extends BaseModel {
  public static selfAssignPrimaryKey = true
  @column({ isPrimary: true })
  public id: string

  @column()
  public name: string

  @column()
  public appId: number

  @column()
  public installationId: number

  @hasOne(() => GitSource)
  public gitSource: HasOne<typeof GitSource>

  @column()
  public clientId: string

  @column({ serializeAs: null })
  public clientSecret: string

  @column({ serializeAs: null })
  public webhookSecret: string

  @column({ serializeAs: null })
  public privateKey: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeCreate()
  public static assignUuid(githubApp: GithubApp) {
    githubApp.id = cuid()
  }
  // @beforeSave()
  // public static async encrypt(githubApp: GithubApp) {
  // if (githubApp.privateKey) {
  //   console.log(githubApp.privateKey)
  //   githubApp.privateKey = Encryption.encrypt(githubApp.privateKey)
  // }
  // if (githubApp.webhookSecret) {
  //   githubApp.webhookSecret = Encryption.encrypt(githubApp.webhookSecret)
  // }
  // if (githubApp.clientSecret) {
  //   githubApp.clientSecret = Encryption.encrypt(githubApp.clientSecret)
  // }
  // }
  // @afterFind()
  // public static async decrypt(githubApp: GithubApp) {
  // console.log(githubApp.privateKey)
  // if (githubApp.privateKey) {
  //   // console.log(Encryption.decrypt(githubApp.privateKey))
  //   githubApp.privateKey = Encryption.decrypt(githubApp.privateKey)
  // }
  // if (githubApp.webhookSecret) {
  //   githubApp.webhookSecret = Encryption.decrypt(githubApp.webhookSecret)
  // }
  // if (githubApp.clientSecret) {
  //   githubApp.clientSecret = Encryption.decrypt(githubApp.clientSecret)
  // }
  // }
}
