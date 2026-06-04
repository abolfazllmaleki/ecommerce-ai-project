export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export class User {
  constructor(
    public readonly id: string,
    public name: string,
    public email: string,
    public password: string,
    public role: UserRole,
    public resetToken?: string,
    public resetTokenExpiry?: Date,
  ) {}

  changePassword(newPassword: string) {
    this.password = newPassword;
  }

  setResetToken(token: string, expiry: Date) {
    this.resetToken = token;
    this.resetTokenExpiry = expiry;
  }
}
