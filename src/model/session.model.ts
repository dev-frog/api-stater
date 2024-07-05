import { getModelForClass, ModelOptions, Prop, Ref } from '@typegoose/typegoose'
import { User } from './user.model'

@ModelOptions({ schemaOptions: { collection: 'sessions', expireAfterSeconds: 3 } })
export class Session {
  @Prop({ ref: () => User })
  user: Ref<User> | undefined

  @Prop({ required: true, type: Boolean, default: true })
  validUntil: boolean | undefined
}

const SessionModel = getModelForClass(Session)
export default SessionModel
