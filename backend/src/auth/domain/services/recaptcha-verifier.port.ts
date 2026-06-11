export interface RecaptchaVerifierPort {
  verify(token: string): Promise<boolean>
}
