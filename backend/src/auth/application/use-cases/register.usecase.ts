import { ConflictException } from "@nestjs/common";
import { User, UserRole } from "../../domain/entities/user.entity";
import { UserRepositoryPort } from "../../domain/repositories/user.repository.port";
import { PasswordHasherPort } from "../../domain/services/password-hasher.port";
import { v4 as uuid } from "uuid";

export class RegisterUseCase {

  constructor(
    private readonly userRepo: UserRepositoryPort,
    private readonly hasher: PasswordHasherPort,
  ) {}

  async execute(name:string,email:string,password:string){

    const exists = await this.userRepo.findByEmail(email)

    if(exists){
      throw new ConflictException("User already exists")
    }

    const hashed = await this.hasher.hash(password)

    const user = new User(
      uuid(),
      name,
      email,
      hashed,
      UserRole.USER
    )

    return this.userRepo.save(user)

  }

}
