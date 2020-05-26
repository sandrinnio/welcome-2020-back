import { InputType, Field, ArgsType } from '@nestjs/graphql';

@InputType()
class VerifyDTO {
  @Field()
  readonly verifyString: string;
}

@ArgsType()
export class VerifyArgs {
  @Field()
  readonly record: VerifyDTO;
}
