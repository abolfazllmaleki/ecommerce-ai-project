import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'your-secure-secret-key',
    });
  }

  async validate(payload: any) {
    console.log('JWT Strategy Payload:', payload); // Debugging line to check the decoded payload

    // Ensure payload contains the required fields
    if (!payload || !payload.sub) {
      throw new UnauthorizedException('Invalid or missing token');
    }

    // You can optionally validate the user here if you want to ensure the user exists in the database
    const user = await this.authService.validateUserById(payload.sub); // Add method to validate by ID

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Return user data to attach to the request
    return { userId: payload.sub, email: payload.email, role: payload.role };
  }
}
