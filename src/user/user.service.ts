import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from './user.repository';
import { CreateUserArgs } from './dto/create-user.args';
import { VerifyArgs } from './dto/verify.args';
import { User } from './interface/user.interface';
import { UserPayload } from '../auth/interface/user.type';
import { JwtPayload } from '../auth/interface/jwt-payload.interface';
import { GetUserArgs } from './dto/get-user.args';
import { VerifyPaymentArgs } from './dto/vetify-payment.args';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async getUsers(): Promise<User[] | null> {
    return await this.userRepository.getUsers();
  }

  getUser(getUserArgs: GetUserArgs): Promise<User | null> {
    return this.userRepository.getUser(getUserArgs);
  }

  async verify(verifyString: VerifyArgs): Promise<User | null> {
    return await this.userRepository.verify(verifyString);
  }

  verifyPayment(verifyPaymentArgs: VerifyPaymentArgs): Promise<User | null> {
    return this.userRepository.verifyPayment(verifyPaymentArgs);
  }

  async signUp(createUserArgs: CreateUserArgs): Promise<UserPayload | null> {
    const user = await this.userRepository.signUp(createUserArgs);
    if (!user.email) {
      throw new UnauthorizedException('Invalid Credentials');
    }
    const payload: JwtPayload = { email: user.email };
    const token = await this.jwtService.sign(payload);
    return { user, token };
  }
}
