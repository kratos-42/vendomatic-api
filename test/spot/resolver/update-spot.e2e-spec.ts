import { INestApplication } from '@nestjs/common';
import { TestingModule } from '@nestjs/testing';
import request from 'supertest';

import { SpotService } from '@spot/spot.service';
import { spotFixture } from '@test/fixtures/spot-fixture';
import { clearDatabase } from '@test/utils/database-util';
import { initializeApp } from '@test/utils/nest-testing-module';

describe('updateSpot (e2e)', () => {
  let app: INestApplication;
  let service: SpotService;
  let module: TestingModule;

  beforeEach(async () => {
    ({ app, module } = await initializeApp());
    service = module.get<SpotService>(SpotService);

    await clearDatabase(app);
  });

  it('should update a `spot`', async () => {
    const name = 'waldo';
    const location = 'fred';
    const spot = await spotFixture(module, { location, name });
    const { body } = await request(app.getHttpServer())
      .post('/graphql')
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
  });
});
