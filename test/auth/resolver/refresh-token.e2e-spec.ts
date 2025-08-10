import { INestApplication } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { mockDeep } from 'jest-mock-extended';
import request from 'supertest';

import { Role } from '@auth/enums/role.enum';
import {
  createRefreshTokenSuccessStub,
  createRefreshTokenErrorStub,
  createGetUserSuccessStub,
} from '@test/stubs/supabase';
import { clearDatabase } from '@test/utils/database-util';
import { initializeApp } from '@test/utils/nest-testing-module';

/**
 * Mocks.
 */

const mockSupabaseClient = mockDeep<SupabaseClient>();

jest.mock('@supabase/supabase-js', () => ({
  ...jest.requireActual('@supabase/supabase-js'),
  createClient: jest.fn(() => mockSupabaseClient),
}));

describe('refreshToken (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    ({ app } = await initializeApp());
  });

  beforeEach(async () => {
    await clearDatabase(app);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should successfully refresh token with valid refresh token', async () => {
    const accessToken = 'valid-access-token';
    const refreshToken = 'valid-refresh-token';
    const email = 'test@example.com';
    const user = {
      email,
      id: 'user-123',
      user_metadata: {
        name: 'Test User',
        role: Role.TECHNICIAN,
      },
    };

    const supabaseRefreshResponse = createRefreshTokenSuccessStub({ user });

    mockSupabaseClient.auth.getUser.mockResolvedValue(createGetUserSuccessStub(user));
    mockSupabaseClient.auth.refreshSession.mockResolvedValue(supabaseRefreshResponse);

    const { body } = await request(app.getHttpServer())
      .post('/graphql')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        query: `mutation {
          refreshToken(
            input: {
              refreshToken: "${refreshToken}"
            }
          ) {
            session {
              accessToken
              expiresIn
              refreshToken
            }
            user {
              email
              id
              name
              role
            }
          }
        }`,
      })
      .expect(200);

    expect(body.data.refreshToken).toEqual({
      session: {
        accessToken: supabaseRefreshResponse.data.session.access_token,
        expiresIn: supabaseRefreshResponse.data.session.expires_in,
        refreshToken: supabaseRefreshResponse.data.session.refresh_token,
      },
      user: {
        email,
        id: user.id,
        name: user.user_metadata.name,
        role: user.user_metadata.role,
      },
    });

    expect(mockSupabaseClient.auth.refreshSession).toHaveBeenCalledWith({
      refresh_token: refreshToken,
    });
  });

  it('should return error when refresh token is invalid', async () => {
    const accessToken = 'valid-access-token';
    const refreshToken = 'invalid-refresh-token';

    mockSupabaseClient.auth.getUser.mockResolvedValue(
      createGetUserSuccessStub({
        email: 'test@example.com',
        id: 'user-123',
        user_metadata: {
          role: Role.TECHNICIAN,
        },
      }),
    );
    mockSupabaseClient.auth.refreshSession.mockResolvedValue(
      createRefreshTokenErrorStub('Invalid refresh token'),
    );

    const { body } = await request(app.getHttpServer())
      .post('/graphql')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        query: `mutation {
          refreshToken(
            input: {
              refreshToken: "${refreshToken}"
            }
          ) {
            session {
              accessToken
            }
          }
        }`,
      })
      .expect(200);

    expect(body.errors[0].message).toBe('Invalid refresh token');
    expect(body.data).toBeNull();
  });

  it('should return error when user has no role after refresh', async () => {
    const accessToken = 'valid-access-token';
    const refreshToken = 'valid-refresh-token';
    const user = {
      email: 'test@example.com',
      id: 'user-123',
      user_metadata: {
        name: 'Test User',
        // No role defined
      },
    };

    mockSupabaseClient.auth.getUser.mockResolvedValue(createGetUserSuccessStub(user));
    mockSupabaseClient.auth.refreshSession.mockResolvedValue(
      createRefreshTokenSuccessStub({ user }),
    );

    const { body } = await request(app.getHttpServer())
      .post('/graphql')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        query: `mutation {
          refreshToken(
            input: {
              refreshToken: "${refreshToken}"
            }
          ) {
            session {
              accessToken
            }
          }
        }`,
      })
      .expect(200);

    expect(body.errors[0].message).toBe('User role not defined');
    expect(body.data).toBeNull();
  });

  it('should require authentication to access refreshToken mutation', async () => {
    const { body } = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `mutation {
          refreshToken(
            input: {
              refreshToken: "some-token"
            }
          ) {
            session {
              accessToken
            }
          }
        }`,
      })
      .expect(200);

    expect(body.errors[0].message).toBe('Authorization header missing');
    expect(body.data).toBeNull();
  });
});
