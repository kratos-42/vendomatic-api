import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';

import { AuthService } from '@auth/auth.service';
import { AuthState as AuthStateType } from '@auth/auth.types';
import { AuthState } from '@auth/decorators/auth-state.decorator';
import { Roles } from '@auth/decorators/roles.decorator';
import { LoginInput } from '@auth/dto/login.input';
import { RefreshTokenInput } from '@auth/dto/refresh-token.input';
import { AuthOutput } from '@auth/entities/auth.entity';
import { Role } from '@auth/enums/role.enum';
import { GqlAuthGuard } from '@auth/guards/gql-auth.guard';

@Resolver(() => AuthOutput)
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => AuthOutput, { description: 'Login with email and password' })
  async login(@Args('input') loginInput: LoginInput): Promise<AuthOutput> {
    return this.authService.login(loginInput);
  }

  @Mutation(() => Boolean, { description: 'Logout current user' })
  @UseGuards(GqlAuthGuard)
  @Roles(Role.ADMIN, Role.TECHNICIAN)
  async logout(@AuthState() authState: AuthStateType): Promise<boolean> {
    return this.authService.logout(authState.token);
  }

  @Mutation(() => AuthOutput, { description: 'Refresh access token' })
  @UseGuards(GqlAuthGuard)
  @Roles(Role.ADMIN, Role.TECHNICIAN)
  async refreshToken(@Args('input') refreshTokenInput: RefreshTokenInput): Promise<AuthOutput> {
    return this.authService.refreshToken(refreshTokenInput);
  }
}
