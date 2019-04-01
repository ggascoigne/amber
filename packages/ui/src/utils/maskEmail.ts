const maskEmail = (email: string) => {
  return email.replace(/@/g, ' at ').replace(/\./g, ' dot ')
}

export default maskEmail
