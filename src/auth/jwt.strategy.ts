import { UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { JwtPayload } from './interface/jwt-payload.interface';
import { User } from '../user/interface/user.interface';

export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(@InjectModel('User') private readonly userModel: Model<User, {}>) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'artqvaradzmurad',
    });
  }

  async validate(payload: JwtPayload): Promise<User | null> {
    try {
      const { email } = payload;
      const user = await this.userModel.findOne({ email }).select('-password');
      if (!user) { throw new UnauthorizedException(); }
      return user;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
