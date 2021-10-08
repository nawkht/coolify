import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import cuid from 'cuid'
import GitSource from './GitSource'
import DestinationDocker from './DestinationDocker'

export default class Application extends BaseModel {
  public static selfAssignPrimaryKey = true

  @column({ isPrimary: true })
  public id: string

  @column()
  public name: string

  @column()
  public domain: string

  @column()
  public port: number

  @column()
  public installCommand: string

  @column()
  public buildCommand: string

  @column()
  public startCommand: string
  
  @column()
  public configHash: string

  @column()
  public repository: string

  @column()
  public branch: string

  @column()
  public buildPack: string

  @column()
  public gitSourceId: string

  @column()
  public destinationDockerId: string

  @belongsTo(() => GitSource)
  public gitSource: BelongsTo<typeof GitSource>

  @belongsTo(() => DestinationDocker)
  public destinationDocker: BelongsTo<typeof DestinationDocker>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  // @beforeSave()
  // public static async encyptOne(application: Application) {
  //   if (application.secret) {
  //     application.secret = await Encryption.encrypt(application.secret)
  //   }
  // }

  // @afterFind()
  // public static async decryptOne(application: Application) {
  //   if (application.secret) {
  //     const decrypted: string | null = await Encryption.decrypt(application.secret)
  //     if (decrypted) application.secret = decrypted
  //   }
  // }

  // @afterFetch()
  // public static async decryptAll(applications: Application[]) {
  //   return applications.map(async (application) => {
  //     if (application.secret) {
  //       const decrypted: string | null = await Encryption.decrypt(application.secret)
  //       if (decrypted) application.secret = decrypted
  //     }
  //     return application
  //   })
  // }

  @beforeCreate()
  public static assignUuid(application: Application) {
    application.id = cuid()
  }
}
