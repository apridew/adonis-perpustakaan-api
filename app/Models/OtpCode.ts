import { DateTime } from "luxon";
import { BaseModel, BelongsTo, belongsTo, column } from "@ioc:Adonis/Lucid/Orm";
import User from "./User";

export default class OTPConfirmation extends BaseModel {
  public static table = "otp_confirmations";

  @column({ isPrimary: true })
  public id: number;

  @column()
  public otp_confirmation: number;

  @column()
  public user_id: number;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;

  @belongsTo(() => User, {
    foreignKey: "user_id",
  })
  public users: BelongsTo<typeof User>;
}
