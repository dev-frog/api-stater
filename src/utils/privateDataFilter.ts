export function stripPrivateFields(userDocument: any, fieldsToStrip: string[]) {
  const userObject = userDocument.toObject()
  fieldsToStrip.forEach((field) => {
    delete userObject[field]
  })

  return userObject
}
