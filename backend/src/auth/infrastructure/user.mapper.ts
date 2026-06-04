import { User } from "../../domain/entities/user.entity";

export class UserMapper {

  static toDomain(raw:any):User{

    return new User(
      raw._id,
      raw.name,
      raw.email,
      raw.password,
      raw.role,
      raw.resetToken,
      raw.resetTokenExpiry
    )

  }

}
