import { InputType, Field, ArgsType } from '@nestjs/graphql';

@InputType()
class LoginDTO {
  @Field()
  readonly email: string;

  @Field()
  readonly password: string;
}

@ArgsType()
export class LoginArgs {
  @Field()
  readonly record: LoginDTO;
}
