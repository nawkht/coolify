import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, column, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import cuid from 'cuid'
import Application from './Application'

export default class DestinationDocker extends BaseModel {
  public static selfAssignPrimaryKey = true

  @column({ isPrimary: true })
  public id: string

  @column()
  public name: string

  @column()
  public engine: string

  @column()
  public network: string

  @column()
  public isSwarm: boolean

  @hasMany(() => Application)
  public applications: HasMany<typeof Application>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeCreate()
  public static assignUuid(destinationDocker: DestinationDocker) {
    destinationDocker.id = cuid()
  }
}
