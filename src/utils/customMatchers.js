export const customMatchers = {
  toHaveValidationError (actual, expected) {
    if (actual.payload.match(/validation/) != null) {
      return {
        pass: true,
        message: () => ('Expected payload without a validation exception')
      }
    } else {
      return {
        pass: false,
        message: () => ('Expected payload with a validation exception')
      }
    }
  },
  toHaveDuplicateKey (actual, expected) {
    if (actual.payload.match(/duplicate key value violates unique constraint/) != null) {
      return {
        pass: true,
        message: () => ('Expected payload without a duplicate key exception')
      }
    } else {
      return {
        pass: false,
        message: () => ('Expected payload with duplicate key exception')
      }
    }
  },
  toBeNotFound (actual) {
    return { pass: actual.message === 'NotFoundError' }
  }
}
