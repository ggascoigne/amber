const maskEmail = email => {
  return email.replace(/@/g, ' at ').replace(/\./g, ' dot ')
}

export default maskEmail
