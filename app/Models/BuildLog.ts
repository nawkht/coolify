import { BaseModel, beforeCreate, column } from '@ioc:Adonis/Lucid/Orm'
import cuid from 'cuid'

export default class BuildLog extends BaseModel {
  public static selfAssignPrimaryKey = true

  @column({ isPrimary: true })
  public id: string

  @column()
  public line: string

  @column()
  public time: string

  @column()
  public buildId: string

  @beforeCreate()
  public static assignUuid(buildLog: BuildLog) {
    buildLog.id = cuid()
    buildLog.time = new Date().getTime().toString()
  }
}
