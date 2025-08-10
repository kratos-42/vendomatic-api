import { UseGuards } from '@nestjs/common';
import { Query, Resolver } from '@nestjs/graphql';

import { Roles } from '@app/auth/decorators/roles.decorator';
import { Role } from '@app/auth/enums/role.enum';
import { GqlAuthGuard } from '@app/auth/guards/gql-auth.guard';
import { AuthState as AuthStateType } from '@auth/auth.types';
import { AuthState } from '@auth/decorators/auth-state.decorator';
import { User } from '@auth/entities/auth.entity';

@Resolver(() => User)
export class UserResolver {
  @Query(() => User, { description: 'Get current authenticated user' })
  @Roles(Role.ADMIN, Role.TECHNICIAN)
  @UseGuards(GqlAuthGuard)
  me(@AuthState() authState: AuthStateType): User {
    return authState.user;
  }
}
