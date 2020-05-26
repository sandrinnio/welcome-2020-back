import { InternalServerErrorException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SendGridService } from '@anchan828/nest-sendgrid';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User } from './interface/user.interface';
import { CreateUserArgs } from './dto/create-user.args';
import { VerifyArgs } from './dto/verify.args';

export class UserRepository {
  constructor(
    private readonly sendGrid: SendGridService,
    @InjectModel('User') private readonly userModel: Model<User, {}>,
  ) {}

  async verify(verifyString: VerifyArgs): Promise<User | null> {
    try {
      return await this.userModel.findOneAndUpdate({
        verified: false,
        verifyString: verifyString.record.verifyString,
      }, {
        $set: { verified: true },
        $unset: { verifyString: 1 },
      }, {
        new: true,
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async signUp(createUserArgs: CreateUserArgs): Promise<User | null> {
    try {
      const link = 'http://localhost:3000/confirm';
      const salt = await bcrypt.genSalt(10);
      const user = await this.userModel({
        fullName: createUserArgs.record.fullName,
        email: createUserArgs.record.email,
        idNumber: createUserArgs.record.idNumber,
        phone: createUserArgs.record.phone,
        verifyString: [...Array(40)].map(() => (~~(Math.random() * 36)).toString(36)).join(''),
        password: await bcrypt.hash(createUserArgs.record.password, salt),
      }).save();
      this.sendGrid.send({
        to: user.email,
        from: {
          name: 'Welcome 2020',
          email: 'no-reply@welcome.com',
        },
        subject: 'Confirm Email',
        html: `<a href=${link}/${user.verifyString}>Click this</a> to confirm your email`,
      });
      return user;
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Email already exists');
      }
      throw new InternalServerErrorException(error.message);
    }
  }
}
