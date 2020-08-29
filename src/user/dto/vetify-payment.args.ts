import { InputType, Field, ArgsType, ID } from '@nestjs/graphql';

@InputType()
class VerifyPaymentDTO {
  @Field(() => ID)
  id: string;

  @Field(() => Boolean)
  paid: boolean;
}

@ArgsType()
export class VerifyPaymentArgs {
  @Field()
  record: VerifyPaymentDTO;
}
