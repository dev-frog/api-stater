import { User, UserModel } from '../model'

export function findUserByEmail(email: string) {
  return UserModel.findOne({ email })
}

export function findUserById(id: string) {
  return UserModel.findById(id).exec()
}

export function updateUserById(id: string, data: Partial<User>) {
  return UserModel.findByIdAndUpdate(id, data, { new: true }).exec()
}

export function deleteUserById(id: string) {
  return UserModel.findByIdAndDelete(id).exec()
}

export function findUserByGoogleId(googleId: string) {
  return UserModel.findOne({ googleId }).exec()
}
