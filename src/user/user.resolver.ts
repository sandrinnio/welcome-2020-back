import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { UserService } from './user.service';
import { CreateUserArgs } from './dto/create-user.args';
import { User } from './interface/user.interface';
import { VerifyArgs } from './dto/verify.args';
import { UserPayload } from '../auth/interface/user.type';

@Resolver('User')
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => [User], { nullable: true })
  async getUsers(): Promise<User[] | null> {
    return await this.userService.getUsers();
  }

  @Mutation(() => User, { nullable: true })
  async verify(@Args() verifyString: VerifyArgs): Promise<User | null> {
    return await this.userService.verify(verifyString);
  }

  @Mutation(() => UserPayload)
  async signUp(@Args() createUserArgs: CreateUserArgs): Promise<UserPayload | null> {
    return await this.userService.signUp(createUserArgs);
  }
}
