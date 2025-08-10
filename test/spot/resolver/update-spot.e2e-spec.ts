import { INestApplication } from '@nestjs/common';
import { TestingModule } from '@nestjs/testing';
import { SupabaseClient } from '@supabase/supabase-js';
import { mockDeep } from 'jest-mock-extended';
import request from 'supertest';

import { Role } from '@auth/enums/role.enum';
import { SpotService } from '@spot/spot.service';
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

describe('updateSpot (e2e)', () => {
  let app: INestApplication;
  let service: SpotService;
  let module: TestingModule;

  beforeAll(async () => {
    ({ app, module } = await initializeApp());
    service = module.get<SpotService>(SpotService);
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

  it('should update a `spot` with admin role', async () => {
    const accessToken = 'valid-access-token';
    const email = 'admin@example.com';

    mockSupabaseClient.auth.getUser.mockResolvedValue(
      createGetUserSuccessStub({
        email,
        id: 'admin-123',
        user_metadata: {
          name: 'Admin User',
          role: Role.ADMIN,
        },
      }),
    );

    const name = 'waldo';
    const location = 'fred';
    const spot = await spotFixture(module, { location, name });
    const { body } = await request(app.getHttpServer())
      .post('/graphql')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200)
      .send({
        query: `
          mutation {
            updateSpot(
              id: "${spot.id}"
              input: { location: "${location}" name: "${name}" }
            ) {
              createdAt
              id
              location
              name
              updatedAt
            }
          }
        `,
      });

    const updatedSpot = await service.findById(spot.id);

    expect(body.data.updateSpot).toEqual({
      createdAt: spot.createdAt.toISOString(),
      id: spot.id,
      location,
      name,
      updatedAt: updatedSpot.updatedAt.toISOString(),
    });

    expect(mockSupabaseClient.auth.getUser).toHaveBeenCalledWith(accessToken);
  });

  it('should require authentication to update spot', async () => {
    const name = 'waldo';
    const location = 'fred';
    const spot = await spotFixture(module, { location, name });
    const { body } = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `
          mutation {
            updateSpot(
              id: "${spot.id}"
              input: { location: "${location}" name: "${name}" }
            ) {
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

  it('should reject update with non-admin role', async () => {
    const accessToken = 'valid-access-token';
    const email = 'technician@example.com';

    mockSupabaseClient.auth.getUser.mockResolvedValue(
      createGetUserSuccessStub({
        email,
        id: 'tech-123',
        user_metadata: {
          name: 'Tech User',
          role: Role.TECHNICIAN,
        },
      }),
    );

    const name = 'waldo';
    const location = 'fred';
    const spot = await spotFixture(module, { location, name });
    const { body } = await request(app.getHttpServer())
      .post('/graphql')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        query: `
          mutation {
            updateSpot(
              id: "${spot.id}"
              input: { location: "${location}" name: "${name}" }
            ) {
              id
              name
            }
          }
        `,
      })
      .expect(200);

    expect(body.errors[0].message).toBe('Access denied');
    expect(body.data).toBeNull();
  });
});
