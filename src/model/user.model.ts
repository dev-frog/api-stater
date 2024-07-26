import { DocumentType, getModelForClass, index, ModelOptions, Prop, pre as preSave } from '@typegoose/typegoose'
import { v4 as uuid } from 'uuid'
import argon2 from 'argon2'
import logger from '../utils/logger'

class Location {
  @Prop({ required: true })
  lat: number | undefined

  @Prop({ required: true })
  lng: number | undefined
}

export const privateFields = [
  'password',
  'googleId',
  'facebookId',
  'location',
  'address',
  'phone',
  'verified',
  'isDeleted',
  'isBlocked',
  'passwordResetCode',
  'passwordResetCodeExpires',
  'verificationCodeExpires',
  'verificationCode',
  '__v'
]

@index({ email: 1 }, { unique: true })
@preSave<User>('save', async function preSaveUser() {
  if (!this.isModified('password')) {
    return
  }
  const hash = await argon2.hash(this.password as string)
  this.password = hash
})
@ModelOptions({ schemaOptions: { collection: 'users', timestamps: true } })
export class User {
  @Prop({ required: true, type: String, unique: true, lowercase: true })
  email: string | undefined

  @Prop({ required: true, type: String, minlength: 8 })
  password: string | undefined

  @Prop({ required: true, type: String })
  name: string | undefined

  @Prop({ required: false, type: String, default: null })
  picture: string | undefined

  @Prop({ required: false, type: String, default: null })
  googleId: string | undefined

  @Prop({ required: false, type: String, default: null })
  facebookId: string | undefined

  @Prop({ required: false, type: String, default: null })
  location: Location | undefined

  @Prop({ required: false, type: String, default: null })
  address: string | undefined

  @Prop({ required: false, type: String })
  phone: string | undefined

  @Prop({ required: true, default: false, type: Boolean })
  verified: boolean | undefined

  @Prop({ required: false, default: false, type: Boolean })
  isDeleted: boolean | undefined

  @Prop({ required: false, default: false, type: Boolean })
  isBlocked: boolean | undefined

  @Prop({ required: false, type: String, default: () => uuid() })
  verificationCode: string | undefined

  @Prop({ required: false, type: Date, default: () => new Date(Date.now() + 5 * 60000) })
  verificationCodeExpires: Date | undefined

  @Prop({ required: false, type: String, default: null })
  passwordResetCode: string | undefined

  @Prop({ required: false, type: Date, default: null })
  passwordResetCodeExpires: Date | undefined

  // some functions

  async validatePassword(this: DocumentType<User>, candidatePassword: string) {
    try {
      const isMatch = await argon2.verify(this.password as string, candidatePassword)
      return isMatch
    } catch (error: unknown) {
      logger.error('Error while validating password', error)
      return false
    }
  }
}

const UserModel = getModelForClass(User)
export default UserModel
