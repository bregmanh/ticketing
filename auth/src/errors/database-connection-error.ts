import { CustomError } from "./custom-error"

export class DatabaseConnectionError extends CustomError {
  statusCode = 500
  reason = 'Error connecting to database'
  constructor() {
    //message for logging purposes
    super('Error connecting to db')

    // Only because extending a built-in class
    Object.setPrototypeOf(this, DatabaseConnectionError.prototype)
  }

  serializeErrors() {
    return [
      { message: this.reason }
    ]
  }
}