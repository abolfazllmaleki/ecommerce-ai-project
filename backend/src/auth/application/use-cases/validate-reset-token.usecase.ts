import { Inject } from "@nestjs/common";
import { IUserRepository } from "src/users/domain/user.repository.port";
export class ValidateResetTokenUseCase {

  constructor(
    @Inject('IUserRepository')
    private readonly userRepo: IUserRepository,
  ){}

  async execute(token:string){

    const user = await this.userRepo.findByResetToken(token)

    if(!user){
      return null
    }

    return user
  }

}
