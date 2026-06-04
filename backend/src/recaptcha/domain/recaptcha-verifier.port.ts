export interface IRecaptchaVerifier {
  verify(token: string): Promise<boolean>;
}
