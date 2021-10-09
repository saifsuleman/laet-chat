export default class AuthenticationHandler {
  isCredentialsValid(username: string, password: string): boolean {
    return username === password;
  }
}
