import { InputType, Field, ArgsType } from '@nestjs/graphql';

@InputType()
class GetUserDTO {
  @Field()
  id: string;
}

@ArgsType()
export class GetUserArgs {
  @Field()
  record: GetUserDTO;
}
