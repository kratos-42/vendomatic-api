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

describe('spots (e2e)', () => {
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

  it('should get a list of `spot`', async () => {
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

    const location = 'waldo';
    const spotFoobar = await spotFixture(module, { location, name: 'foobar' });
    const spotWaldo = await spotFixture(module, { location, name: 'waldo' });
    const { body } = await request(app.getHttpServer())
      .post('/graphql')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200)
      .send({
        query: `
          query {
            spots {
              createdAt
              id
              name
              location
              updatedAt
            }
          }
        `,
      });

    expect(body.data.spots).toEqual([
      {
        ...spotFoobar,
        createdAt: spotFoobar.createdAt.toISOString(),
        updatedAt: spotFoobar.updatedAt.toISOString(),
      },
      {
        ...spotWaldo,
        createdAt: spotWaldo.createdAt.toISOString(),
        updatedAt: spotWaldo.updatedAt.toISOString(),
      },
    ]);

    expect(mockSupabaseClient.auth.getUser).toHaveBeenCalledWith(accessToken);
  });

  it('should require authentication to access spots query', async () => {
    const { body } = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `
          query {
            spots {
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
