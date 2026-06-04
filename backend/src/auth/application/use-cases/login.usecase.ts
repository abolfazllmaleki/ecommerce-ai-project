import { UnauthorizedException } from "@nestjs/common";
import { UserRepositoryPort } from "../../domain/repositories/user.repository.port";
import { PasswordHasherPort } from "../../domain/services/password-hasher.port";
import { TokenProviderPort } from "../../domain/services/token-provider.port";

export class LoginUseCase {

  constructor(
    private readonly userRepo:UserRepositoryPort,
    private readonly hasher:PasswordHasherPort,
    private readonly tokenProvider:TokenProviderPort
  ){}

  async execute(email:string,password:string){

    const user = await this.userRepo.findByEmail(email)

    if(!user){
      throw new UnauthorizedException("Invalid credentials")
    }

    const valid = await this.hasher.compare(password,user.password)

    if(!valid){
      throw new UnauthorizedException("Invalid credentials")
    }

    const token = this.tokenProvider.sign({
      sub:user.id,
      role:user.role,
      email:user.email
    })

    return {
      access_token:token,
      user:{
        id:user.id,
        email:user.email,
        role:user.role
      }
    }

  }

}
