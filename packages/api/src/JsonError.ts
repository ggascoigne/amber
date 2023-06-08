//
// export const JsonError = function (status: number, message: string) {
//     Error.prototype.constructor.call(this, status + ': ' + message);
//     this.status = status;
//     this.message = message;
//   };
//
// JsonError.prototype = Object.create(Error);
// JsonError.prototype.constructor = JsonError;
//

export class JsonError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message) // 'Error' breaks prototype chain here
    this.name = 'JsonError'
    this.status = status
    Object.setPrototypeOf(this, new.target.prototype) // restore prototype chain
  }
}
