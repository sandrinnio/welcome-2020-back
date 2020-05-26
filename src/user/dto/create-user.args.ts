import { InputType, Field, ArgsType } from '@nestjs/graphql';

@InputType()
class CreateUserDTO {
  @Field()
  readonly fullName: string;

  @Field()
  readonly email: string;

  @Field()
  readonly idNumber: string;

  @Field()
  readonly phone: string;

  @Field()
  readonly password: string;
}

@ArgsType()
export class CreateUserArgs {
  @Field()
  readonly record: CreateUserDTO;
}
