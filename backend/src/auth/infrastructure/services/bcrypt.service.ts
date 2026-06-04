import * as bcrypt from "bcrypt";
import { PasswordHasherPort } from "../../domain/services/password-hasher.port";

export class BcryptService implements PasswordHasherPort{

  hash(password: string): Promise<string> {
    return bcrypt.hash(password,12)
  }

  compare(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password,hash)
  }

}
