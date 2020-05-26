import { Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from './user.repository';
import { CreateUserArgs } from './dto/create-user.args';
import { VerifyArgs } from './dto/verify.args';
import { User } from './interface/user.interface';
import { UserPayload } from '../auth/interface/user.type';
import { JwtPayload } from '../auth/interface/jwt-payload.interface';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async verify(verifyString: VerifyArgs): Promise<User | null> {
    return await this.userRepository.verify(verifyString);
  }

  async signUp(createUserArgs: CreateUserArgs): Promise<UserPayload | null> {
    try {
      const user = await this.userRepository.signUp(createUserArgs);
      if (!user.email) { throw new UnauthorizedException('Invalid Credentials'); }
      const payload: JwtPayload = { email: user.email };
      const token = await this.jwtService.sign(payload);
      return { user, token };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
