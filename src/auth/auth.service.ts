import { Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthRepository } from './auth.repository';
import { LoginArgs } from './dto/login.args';
import { UserPayload } from './interface/user.type';
import { JwtPayload } from './interface/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(loginArgs: LoginArgs): Promise<UserPayload | null> {
    try {
      const user = await this.authRepository.signIn(loginArgs);
      if (!user.email) { throw new UnauthorizedException('Invalid Credentials'); }
      const payload: JwtPayload = { email: user.email };
      const token = await this.jwtService.sign(payload);
      return { user, token };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
