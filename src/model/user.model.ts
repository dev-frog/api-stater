import { getModelForClass, ModelOptions, Prop } from '@typegoose/typegoose'

class Location {
  @Prop({ required: true })
  lat: number | undefined

  @Prop({ required: true })
  lng: number | undefined
}

export const privateFields = ['password', 'googleId', 'facebookId', 'location', 'address', 'phone', '__v']

@ModelOptions({ schemaOptions: { collection: 'users', timestamps: true } })
export class User {
  @Prop({ required: true, unique: true, lowercase: true })
  email: string | undefined

  @Prop({ required: true })
  password: string | undefined

  @Prop({ required: true })
  name: string | undefined

  @Prop({ required: false })
  picture: string | undefined

  @Prop({ required: false })
  googleId: string | undefined

  @Prop({ required: false })
  facebookId: string | undefined

  @Prop({ required: false })
  location: Location | undefined

  @Prop({ required: false })
  address: string | undefined

  @Prop({ required: false })
  phone: string | undefined

  @Prop({ required: true, default: false })
  verified: boolean | undefined

  @Prop({ required: false, default: false })
  isDeleted: boolean | undefined

  @Prop({ required: false, default: false })
  isBlocked: boolean | undefined
}

const UserModel = getModelForClass(User)
export default UserModel
