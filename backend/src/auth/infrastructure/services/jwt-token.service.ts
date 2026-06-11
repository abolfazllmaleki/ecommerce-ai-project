import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { TokenProviderPort } from "../../domain/services/token-provider.port";

@Injectable()
export class JwtTokenService implements TokenProviderPort {
  constructor(
    private readonly jwt: JwtService
  ) {}

  sign(payload: any): string {
    console.log('here at jwt.token sign');
    return this.jwt.sign(payload);
  }
}

