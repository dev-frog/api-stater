function stripPrivateFields(userDocument: unknown, fieldsToStrip: string[]) {
  const userObject = userDocument as Record<string, unknown>
  fieldsToStrip.forEach((field) => {
    delete userObject[field]
  })

  return userObject
}

export default stripPrivateFields
