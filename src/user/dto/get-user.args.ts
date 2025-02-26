import { InputType, Field, ArgsType, ID } from '@nestjs/graphql';

@InputType()
class GetUserDTO {
  @Field(() => ID)
  id: string;
}

@ArgsType()
export class GetUserArgs {
  @Field()
  record: GetUserDTO;
}
