import {
  InternalServerErrorException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SendGridService } from '@anchan828/nest-sendgrid';
import { Model } from 'mongoose';
import * as QRCode from 'qrcode';
import * as bcrypt from 'bcrypt';
import * as AWS from 'aws-sdk';
import fs from 'fs';
import { User } from './interface/user.interface';
import { CreateUserArgs } from './dto/create-user.args';
import { VerifyArgs } from './dto/verify.args';
import { GetUserArgs } from './dto/get-user.args';
import { VerifyPaymentArgs } from './dto/vetify-payment.args';

export class UserRepository {
  constructor(
    private readonly sendGrid: SendGridService,
    @InjectModel('User') private readonly userModel: Model<User, {}>,
  ) {}

  s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  });

  async getUsers(): Promise<User[] | null> {
    try {
      return await this.userModel.find();
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async getUser(getUserArgs: GetUserArgs): Promise<User | null> {
    return await this.userModel.findOne({ _id: getUserArgs.record.id });
  }

  async verify(verifyString: VerifyArgs): Promise<User | null> {
    try {
      return await this.userModel.findOneAndUpdate(
        {
          verified: false,
          verifyString: verifyString.record.verifyString,
        },
        {
          $set: { verified: true },
          $unset: { verifyString: 1 },
        },
        {
          new: true,
        },
      );
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async verifyPayment(
    verifyPaymentArgs: VerifyPaymentArgs,
  ): Promise<User | null> {
    const user = await this.userModel.findOneAndUpdate(
      {
        _id: verifyPaymentArgs.record.id,
        paid: false,
      },
      {
        $set: { paid: true },
      },
      {
        new: true,
      },
    );
    if (user.paid) {
      const qr = await QRCode.toDataURL(user.email);
      const base64Data = qr.split(',')[1];
      const filename = [...Array(10)]
        .map(() => (~~(Math.random() * 36)).toString(36))
        .join('');
      const buf = Buffer.from(base64Data, 'base64');
      const params = {
        Body: buf,
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `Tickets/${filename}.png`,
        ContentType: 'image/png',
        ContentEncoding: 'base64',
        ACL: 'public-read',
      };
      const data = await this.s3.upload(params).promise();
      user.ticket = data.Location;
      user.save();
      this.sendGrid.send({
        to: user.email,
        from: {
          name: 'Welcome 2020',
          email: 'no-reply@welcome.com',
        },
        subject: 'Ticket',
        html: `<img src=${data.Location} alt="Ticket" />`,
      });
    }
    return user;
  }

  async signUp(createUserArgs: CreateUserArgs): Promise<User | null> {
    const link = 'http://localhost:3000/confirm';
    const salt = await bcrypt.genSalt(10);
    const user = await this.userModel({
      fullName: createUserArgs.record.fullName,
      email: createUserArgs.record.email,
      idNumber: createUserArgs.record.idNumber,
      phone: createUserArgs.record.phone,
      verifyString: [...Array(40)]
        .map(() => (~~(Math.random() * 36)).toString(36))
        .join(''),
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
  }
}
