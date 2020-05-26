import { InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User } from '../user/interface/user.interface';
import { LoginArgs } from './dto/login.args';

export class AuthRepository {
  constructor(@InjectModel('User') private readonly userModel: Model<User, {}>) {}

  async signIn(loginArgs: LoginArgs): Promise<User | null> {
    try {
      const user = await this.userModel.findOne({ email: loginArgs.record.email });
      if (!user) { throw new NotFoundException('User not found'); }
      const isMatch = await bcrypt.compare(loginArgs.record.password, user.password);
      if (!isMatch) { throw new UnauthorizedException('Invalid Credentials'); }
      return user;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
