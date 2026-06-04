import { UserRepositoryPort } from "../../domain/repositories/user.repository.port";

export class ValidateResetTokenUseCase {

  constructor(
    private readonly userRepo:UserRepositoryPort
  ){}

  async execute(token:string){

    const user = await this.userRepo.findByResetToken(token)

    if(!user){
      return null
    }

    return user
  }

}
