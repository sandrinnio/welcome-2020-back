import { Document } from 'mongoose';
import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class User extends Document {
  @Field(() => ID)
  readonly id: string;

  @Field()
  readonly fullName: string;

  @Field()
  readonly idNumber: string;

  @Field()
  readonly phone: string;

  @Field()
  readonly email: string;

  @Field(() => Boolean)
  readonly verified: boolean;
}
