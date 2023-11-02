enum Code {
  REQUIRED_LOGIN = "auth_required_login"
}
export class AuthError extends Error {
  static Code = Code

  name = "AuthError"
  // eslint-disable-next-line no-useless-constructor
  constructor(code: Code) {
    super(code)
  }
}
