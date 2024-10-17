import { INestApplication } from '@nestjs/common';
import { TestingModule } from '@nestjs/testing';
import request from 'supertest';

import { spotFixture } from '@test/fixtures/spot-fixture';
import { clearDatabase } from '@test/utils/database-util';
import { initializeApp } from '@test/utils/nest-testing-module';

describe('spot (e2e)', () => {
  let app: INestApplication;
  let module: TestingModule;

  beforeEach(async () => {
    ({ app, module } = await initializeApp());

    await clearDatabase(app);
  });

  it('should get the `spot` with given `id`', async () => {
    const name = 'foo';
    const location = 'waldo';
    const spot = await spotFixture(module, { location, name });
    const { body } = await request(app.getHttpServer())
      .post('/graphql')
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
  });
});
