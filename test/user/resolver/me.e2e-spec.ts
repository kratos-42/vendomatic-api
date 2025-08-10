import { INestApplication } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { mockDeep } from 'jest-mock-extended';
import request from 'supertest';

import { Role } from '@auth/enums/role.enum';
import { createGetUserSuccessStub } from '@test/stubs/supabase';
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

describe('me (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    ({ app } = await initializeApp());
  });

  beforeEach(async () => {
    await clearDatabase(app);
  });

  afterAll(async () => {
    await app.close();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should successfully return authenticated user data', async () => {
    const accessToken = 'valid-access-token';
    const email = 'test@example.com';

    mockSupabaseClient.auth.getUser.mockResolvedValue(
      createGetUserSuccessStub({
        email,
        id: 'user-123',
        user_metadata: {
          name: 'Test User',
          role: Role.ADMIN,
        },
      }),
    );

    const { body } = await request(app.getHttpServer())
      .post('/graphql')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        query: `query {
          me {
            email
            id
            name
            role
          }
        }`,
      })
      .expect(200);

    expect(body.data.me).toEqual({
      email,
      id: 'user-123',
      name: 'Test User',
      role: Role.ADMIN,
    });

    expect(mockSupabaseClient.auth.getUser).toHaveBeenCalledWith(accessToken);
  });

  it('should require authentication to access me query', async () => {
    const { body } = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `query {
          me {
            email
            id
          }
        }`,
      })
      .expect(200);

    expect(body.errors[0].message).toBe('Authorization header missing');
    expect(body.data).toBeNull();
  });

  it('should handle user with minimal data (no name)', async () => {
    const accessToken = 'valid-access-token';
    const email = 'minimal@example.com';

    mockSupabaseClient.auth.getUser.mockResolvedValue(
      createGetUserSuccessStub({
        email,
        id: 'user-456',
        user_metadata: {
          role: Role.TECHNICIAN,
        },
      }),
    );

    const { body } = await request(app.getHttpServer())
      .post('/graphql')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        query: `query {
          me {
            email
            id
            name
            role
          }
        }`,
      })
      .expect(200);

    expect(body.data.me).toEqual({
      email,
      id: 'user-456',
      name: null,
      role: Role.TECHNICIAN,
    });
  });

  it('should return error when user has no role', async () => {
    const accessToken = 'valid-access-token';
    const email = 'norole@example.com';

    mockSupabaseClient.auth.getUser.mockResolvedValue(
      createGetUserSuccessStub({
        email,
        id: 'user-789',
        user_metadata: {
          name: 'No Role User',
        },
      }),
    );

    const { body } = await request(app.getHttpServer())
      .post('/graphql')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        query: `query {
          me {
            email
            id
            role
          }
        }`,
      })
      .expect(200);

    expect(body.errors[0].message).toBe('User role not defined');
    expect(body.data).toBeNull();
  });
});
