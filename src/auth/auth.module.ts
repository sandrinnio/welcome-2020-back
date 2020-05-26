import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { AuthRepository } from './auth.repository';
import { JwtStrategy } from './jwt.strategy';
import { UserModel } from '../user/model/user.model';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserModel }]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: 'artqvaradzmurad',
      signOptions: {
        expiresIn: 36000,
      },
    }),
  ],
  providers: [
    JwtStrategy,
    AuthResolver,
    AuthService,
    AuthRepository,
  ],
  exports: [
    JwtStrategy,
    PassportModule,
    JwtModule,
  ],
})
export class AuthModule {}
