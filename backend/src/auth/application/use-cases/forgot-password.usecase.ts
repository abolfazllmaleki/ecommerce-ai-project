import { UserRepositoryPort } from "../../domain/repositories/user.repository.port";
import { v4 as uuid } from "uuid";

export class ForgotPasswordUseCase {

  constructor(
    private readonly userRepo:UserRepositoryPort
  ){}

  async execute(email:string){

    const user = await this.userRepo.findByEmail(email)

    if(!user){
      return
    }

    const token = uuid()

    user.setResetToken(
      token,
      new Date(Date.now()+3600000)
    )

    await this.userRepo.save(user)

    return token
  }

}
