import { INestApplication } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { mockDeep } from 'jest-mock-extended';
import request from 'supertest';

import {
  createSignOutSuccessStub,
  createSignOutErrorStub,
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

describe('logout (e2e)', () => {
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

  it('should successfully logout with valid access token', async () => {
    const accessToken = 'valid-access-token';

    mockSupabaseClient.auth.getUser.mockResolvedValue(createGetUserSuccessStub());
    mockSupabaseClient.auth.admin.signOut.mockResolvedValue(createSignOutSuccessStub());

    const { body } = await request(app.getHttpServer())
      .post('/graphql')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        query: `mutation {
          logout
        }`,
      })
      .expect(200);

    expect(body.data.logout).toBe(true);
    expect(mockSupabaseClient.auth.admin.signOut).toHaveBeenCalledWith(accessToken);
  });

  it('should require authentication to access logout mutation', async () => {
    const { body } = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `mutation {
          logout
        }`,
      })
      .expect(200);

    expect(body.errors[0].message).toBe('Authorization header missing');
    expect(body.data).toBeNull();
  });

  it('should return error when logout fails on Supabase', async () => {
    const accessToken = 'valid-access-token';

    mockSupabaseClient.auth.admin.signOut.mockResolvedValue(
      createSignOutErrorStub('Session not found'),
    );

    const { body } = await request(app.getHttpServer())
      .post('/graphql')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        query: `mutation {
          logout
        }`,
      })
      .expect(200);

    expect(body.errors[0].message).toBe('Failed to logout');
    expect(body.data).toBeNull();
    expect(mockSupabaseClient.auth.admin.signOut).toHaveBeenCalledWith(accessToken);
  });
});
