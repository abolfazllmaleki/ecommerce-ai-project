import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { PasswordHasherPort } from "../../domain/services/password-hasher.port";
import { TokenProviderPort } from "../../domain/services/token-provider.port";
import { IUserRepository } from "src/users/domain/user.repository.port";

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepo: IUserRepository,

    @Inject('PasswordHasherPort')
    private readonly hasher: PasswordHasherPort,

    @Inject('TokenProviderPort')
    private readonly tokenProvider: TokenProviderPort,
  ) {}

  async execute(email: string, password: string) {
    const user = await this.userRepo.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException("Invalid credentials");
    }


    const valid = await this.hasher.compare(password, user.password);

    if (!valid) {
      throw new UnauthorizedException("Invalid credentials");
    }


    const token = this.tokenProvider.sign({
      sub: user.id!,
      role: user.role,
      email: user.email,
    });


    return {
      access_token: token,
      user: {
        id: user.id!,
        email: user.email,
        role: user.role,
      },
    };
  }
}
