import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Request } from 'express';

import { AuthService } from '@auth/auth.service';
import { Role } from '@auth/enums/role.enum';
import { AUTH_ROLES_KEY } from '@common/constants/auth.constants';

@Injectable()
export class GqlAuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const gqlContext = ctx.getContext();
    const token = this.extractTokenFromHeader(gqlContext.req);
    const user = await this.authService.getLoggedUser(token);

    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }

    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(AUTH_ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const hasRole = requiredRoles.some((role) => user.role === role);

    if (!hasRole) {
      throw new ForbiddenException('Access denied');
    }

    // Attach authenticated state to GraphQL context
    gqlContext.state = { token, user };

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('Authorization header missing');
    }

    const [type, token] = authHeader.split(' ') ?? [];

    if (type !== 'Bearer') {
      throw new UnauthorizedException('Invalid authorization header');
    }

    if (!token) {
      throw new UnauthorizedException('Token missing');
    }

    return token;
  }
}
