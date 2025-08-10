import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

import { AuthContext, AuthState as AuthStateType } from '@auth/auth.types';

export const AuthState = createParamDecorator(
  (_data: unknown, context: ExecutionContext): AuthStateType => {
    const ctx = GqlExecutionContext.create(context);
    const gqlContext = ctx.getContext<AuthContext>();

    return gqlContext.state;
  },
);
