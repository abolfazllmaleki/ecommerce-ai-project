import { JwtService } from "@nestjs/jwt";
import { TokenProviderPort } from "../../domain/services/token-provider.port";

export class JwtTokenService implements TokenProviderPort{

  constructor(
    private readonly jwt:JwtService
  ){}

  sign(payload: any): string {
    return this.jwt.sign(payload)
  }

}
