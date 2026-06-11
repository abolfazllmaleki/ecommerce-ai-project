import { UserRole } from '../domain/user.entity';

export class UpdateUserDto {
  readonly name?: string;
  readonly lastname?: string;
  readonly email?: string;
  readonly role?: UserRole;
}
