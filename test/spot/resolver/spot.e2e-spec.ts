import { INestApplication } from '@nestjs/common';
import { TestingModule } from '@nestjs/testing';
import { SupabaseClient } from '@supabase/supabase-js';
import { mockDeep } from 'jest-mock-extended';
import request from 'supertest';

import { Role } from '@auth/enums/role.enum';
import { spotFixture } from '@test/fixtures/spot';
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

describe('spot (e2e)', () => {
  let app: INestApplication;
  let module: TestingModule;

  beforeAll(async () => {
    ({ app, module } = await initializeApp());
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

  it('should get the `spot` with given `id`', async () => {
    const accessToken = 'valid-access-token';
    const email = 'test@example.com';

    mockSupabaseClient.auth.getUser.mockResolvedValue(
      createGetUserSuccessStub({
        email,
        id: 'user-123',
        user_metadata: {
          name: 'Test User',
          role: Role.TECHNICIAN,
        },
      }),
    );

    const name = 'foo';
    const location = 'waldo';
    const spot = await spotFixture(module, { location, name });
    const { body } = await request(app.getHttpServer())
      .post('/graphql')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200)
      .send({
        query: `
          query {
            spot(id: "${spot.id}") {
              createdAt
              id
              name
              location
              updatedAt
            }
          }
        `,
      });

    expect(body.data.spot).toEqual({
      ...spot,
      createdAt: spot.createdAt.toISOString(),
      updatedAt: spot.updatedAt.toISOString(),
    });

    expect(mockSupabaseClient.auth.getUser).toHaveBeenCalledWith(accessToken);
  });

  it('should require authentication to access spot query', async () => {
    const name = 'foo';
    const location = 'waldo';
    const spot = await spotFixture(module, { location, name });
    const { body } = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `
          query {
            spot(id: "${spot.id}") {
              id
              name
            }
          }
        `,
      })
      .expect(200);

    expect(body.errors[0].message).toBe('Authorization header missing');
    expect(body.data).toBeNull();
  });
});
