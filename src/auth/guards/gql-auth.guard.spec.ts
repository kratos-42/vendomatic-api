import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Test, TestingModule } from '@nestjs/testing';

import { AuthService } from '@auth/auth.service';
import { Role } from '@auth/enums/role.enum';
import { GqlAuthGuard } from '@auth/guards/gql-auth.guard';

describe('GqlAuthGuard', () => {
  let guard: GqlAuthGuard;

  const mockAuthService = {
    getLoggedUser: jest.fn(),
  };

  const mockReflector = {
    getAllAndOverride: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GqlAuthGuard,
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
        {
          provide: Reflector,
          useValue: mockReflector,
        },
      ],
    }).compile();

    guard = module.get<GqlAuthGuard>(GqlAuthGuard);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const createMockExecutionContext = (headers: Record<string, string> = {}): ExecutionContext => {
    const contextState = {
      value: null,
    };

    const mockContext = {
      getContext: jest.fn().mockReturnValue({
        req: {
          headers,
        },
        state: contextState,
      }),
    } as unknown as GqlExecutionContext;

    // Make state property writable
    Object.defineProperty(mockContext.getContext(), 'state', {
      configurable: true,
      get: () => contextState.value,
      set: (value) => {
        contextState.value = value;
      },
    });

    const executionContext = {
      getArgByIndex: jest.fn(),
      getArgs: jest.fn(),
      getClass: jest.fn(),
      getHandler: jest.fn(),
      getType: jest.fn(),
      switchToHttp: jest.fn(),
      switchToRpc: jest.fn(),
      switchToWs: jest.fn(),
    } as unknown as ExecutionContext;

    jest.spyOn(GqlExecutionContext, 'create').mockReturnValue(mockContext);

    return executionContext;
  };

  describe('canActivate', () => {
    it('should return true when valid Bearer token is provided and user exists', async () => {
      const mockUser = {
        email: 'test@example.com',
        id: 'user-123',
        name: 'Test User',
        role: Role.ADMIN,
      };

      const context = createMockExecutionContext({
        authorization: 'Bearer valid-token',
      });

      mockAuthService.getLoggedUser.mockResolvedValue(mockUser);
      mockReflector.getAllAndOverride.mockReturnValue(undefined);

      const result = await guard.canActivate(context);

      expect(result).toBe(true);
      expect(mockAuthService.getLoggedUser).toHaveBeenCalledWith('valid-token');
      expect(mockReflector.getAllAndOverride).toHaveBeenCalled();
    });

    it('should throw UnauthorizedException when no authorization header is provided', async () => {
      const context = createMockExecutionContext({});

      await expect(guard.canActivate(context)).rejects.toThrow(UnauthorizedException);
      expect(mockAuthService.getLoggedUser).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException when authorization header is empty', async () => {
      const context = createMockExecutionContext({
        authorization: '',
      });

      await expect(guard.canActivate(context)).rejects.toThrow(UnauthorizedException);
      expect(mockAuthService.getLoggedUser).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException when authorization header has invalid format', async () => {
      const context = createMockExecutionContext({
        authorization: 'InvalidFormat token',
      });

      await expect(guard.canActivate(context)).rejects.toThrow(UnauthorizedException);
      expect(mockAuthService.getLoggedUser).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException when authorization header is missing Bearer prefix', async () => {
      const context = createMockExecutionContext({
        authorization: 'valid-token',
      });

      await expect(guard.canActivate(context)).rejects.toThrow(UnauthorizedException);
      expect(mockAuthService.getLoggedUser).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException when Bearer token is empty', async () => {
      const context = createMockExecutionContext({
        authorization: 'Bearer ',
      });

      await expect(guard.canActivate(context)).rejects.toThrow(UnauthorizedException);
      expect(mockAuthService.getLoggedUser).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException when user is not found', async () => {
      const context = createMockExecutionContext({
        authorization: 'Bearer invalid-token',
      });

      mockAuthService.getLoggedUser.mockResolvedValue(null);

      await expect(guard.canActivate(context)).rejects.toThrow(UnauthorizedException);
      expect(mockAuthService.getLoggedUser).toHaveBeenCalledWith('invalid-token');
    });

    it('should throw UnauthorizedException when Bearer has multiple spaces before token', async () => {
      const context = createMockExecutionContext({
        authorization: 'Bearer   valid-token',
      });

      await expect(guard.canActivate(context)).rejects.toThrow(UnauthorizedException);
      expect(mockAuthService.getLoggedUser).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException when bearer is lowercase', async () => {
      const context = createMockExecutionContext({
        authorization: 'bearer valid-token',
      });

      await expect(guard.canActivate(context)).rejects.toThrow(UnauthorizedException);
      expect(mockAuthService.getLoggedUser).not.toHaveBeenCalled();
    });

    it('should enforce role-based access when roles are required', async () => {
      const mockUser = {
        email: 'test@example.com',
        id: 'user-123',
        name: 'Test User',
        role: Role.TECHNICIAN,
      };

      const context = createMockExecutionContext({
        authorization: 'Bearer valid-token',
      });

      mockAuthService.getLoggedUser.mockResolvedValue(mockUser);
      mockReflector.getAllAndOverride.mockReturnValue([Role.ADMIN]);

      await expect(guard.canActivate(context)).rejects.toThrow('Access denied');
      expect(mockAuthService.getLoggedUser).toHaveBeenCalledWith('valid-token');
    });

    it('should allow access when user has required role', async () => {
      const mockUser = {
        email: 'test@example.com',
        id: 'user-123',
        name: 'Test User',
        role: Role.ADMIN,
      };

      const context = createMockExecutionContext({
        authorization: 'Bearer valid-token',
      });

      mockAuthService.getLoggedUser.mockResolvedValue(mockUser);
      mockReflector.getAllAndOverride.mockReturnValue([Role.ADMIN, Role.TECHNICIAN]);

      const result = await guard.canActivate(context);

      expect(result).toBe(true);
      expect(mockAuthService.getLoggedUser).toHaveBeenCalledWith('valid-token');
    });
  });
});
