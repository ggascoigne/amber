export const maskEmail = (email: string) => email.replace(/@/g, ' at ').replace(/\./g, ' dot ')
