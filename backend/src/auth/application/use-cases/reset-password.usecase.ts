import { BadRequestException } from "@nestjs/common";
import { UserRepositoryPort } from "../../domain/repositories/user.repository.port";
import { PasswordHasherPort } from "../../domain/services/password-hasher.port";

export class ResetPasswordUseCase {

  constructor(
    private readonly userRepo:UserRepositoryPort,
    private readonly hasher:PasswordHasherPort
  ){}

  async execute(token:string,newPassword:string){

    const user = await this.userRepo.findByResetToken(token)

    if(!user){
      throw new BadRequestException("Invalid token")
    }

    const hashed = await this.hasher.hash(newPassword)

    user.changePassword(hashed)

    await this.userRepo.save(user)

  }

}
س