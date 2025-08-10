import { INestApplication } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { mockDeep } from 'jest-mock-extended';
import request from 'supertest';

import { Role } from '@auth/enums/role.enum';
import { createSignInErrorStub, createSignInSuccessStub } from '@test/stubs/supabase';
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

describe('login (e2e)', () => {
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

  it('should successfully login with valid credentials', async () => {
    const email = 'test@example.com';
    const password = 'password123';

    mockSupabaseClient.auth.signInWithPassword.mockResolvedValue(
      createSignInSuccessStub({
        user: {
          email,
          id: 'user-123',
          user_metadata: {
            name: 'Test User',
            role: Role.TECHNICIAN,
          },
        },
      }),
    );

    const { body } = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `mutation {
          login(
            input: {
              email: "${email}"
              password: "${password}"
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
        }
       `,
      })
      .expect(200);

    expect(body.data.login).toEqual({
      session: {
        accessToken: 'mock-access-token',
        expiresIn: 3600,
        refreshToken: 'mock-refresh-token',
      },
      user: {
        email,
        id: 'user-123',
        name: 'Test User',
        role: Role.TECHNICIAN,
      },
    });

    expect(mockSupabaseClient.auth.signInWithPassword).toHaveBeenCalledWith({
      email,
      password,
    });
  });

  it('should return error for invalid credentials', async () => {
    const email = 'test@example.com';
    const password = 'wrong-password';

    mockSupabaseClient.auth.signInWithPassword.mockResolvedValue(
      createSignInErrorStub('Invalid login credentials'),
    );

    const { body } = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `mutation {
          login(
            input: {
              email: "${email}"
              password: "${password}"
            }
          ) {
            user {
              email
            }
          }
        }
       `,
      })
      .expect(200);

    expect(body.errors[0].message).toBe('Invalid credentials');
    expect(body.data).toBeNull();
  });

  it('should return error when user has no role', async () => {
    const email = 'test@example.com';
    const password = 'password123';

    mockSupabaseClient.auth.signInWithPassword.mockResolvedValue(
      createSignInSuccessStub({
        user: {
          email,
          id: 'user-123',
          user_metadata: {
            name: 'Test User',
          },
        },
      }),
    );

    const { body } = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `mutation {
          login(
            input: {
              email: "${email}"
              password: "${password}"
            }
          ) {
            user {
              email
            }
          }
        }
       `,
      })
      .expect(200);

    expect(body.errors[0].message).toBe('User role not defined');
    expect(body.data).toBeNull();
  });
});
