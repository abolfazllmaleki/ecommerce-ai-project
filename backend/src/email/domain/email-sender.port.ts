export interface IEmailSender {
  sendPasswordResetEmail(email: string, token: string): Promise<void>;
  sendPasswordResetConfirmation(email: string): Promise<void>;
}
