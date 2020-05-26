import { ObjectType, Field } from '@nestjs/graphql';
import { User } from '../../user/interface/user.interface';

@ObjectType()
export class UserPayload {
  @Field()
  readonly token: string;

  @Field(() => User, { nullable: true })
  readonly user: User;
}
