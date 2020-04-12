const maskEmail = (email: string) => email.replace(/@/g, ' at ').replace(/\./g, ' dot ')

export default maskEmail
