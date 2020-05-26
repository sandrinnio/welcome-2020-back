import { UseGuards } from '@nestjs/common';
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UserPayload } from './interface/user.type';
import { LoginArgs } from './dto/login.args';
import { AuthService } from './auth.service';
import { GqlAuthGuard } from './gql-auth.guard';
import { CurrentUser } from './current-user.decorator';
import { User } from '../user/interface/user.interface';

@Resolver('Auth')
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Query(() => User)
  @UseGuards(GqlAuthGuard)
  async getCurrentUser(@CurrentUser() currentUser: User): Promise<User | null> {
    return currentUser;
  }

  @Mutation(() => UserPayload)
  async signIn(@Args() loginArgs: LoginArgs): Promise<UserPayload | null> {
    return await this.authService.signIn(loginArgs);
  }
}
