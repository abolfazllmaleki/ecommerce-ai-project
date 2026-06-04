import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginUseCase } from '../../application/use-cases/login.usecase';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly loginUseCase: LoginUseCase,
  ) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  async validate(email: string, password: string) {
    const result = await this.loginUseCase.execute(email, password);

    if (!result) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Passport attaches this to request.user
    return result.user;
  }
}
