class UserCreationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'UserCreationError'
  }
}

export default UserCreationError
