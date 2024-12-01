import { INestApplication } from '@nestjs/common';
import { TestingModule } from '@nestjs/testing';
import { head } from 'lodash';
import request from 'supertest';

import { SpotService } from '@spot/spot.service';
import { clearDatabase } from '@test/utils/database-util';
import { initializeApp } from '@test/utils/nest-testing-module';

describe('createSpot (e2e)', () => {
  let app: INestApplication;
  let service: SpotService;
  let module: TestingModule;

  beforeEach(async () => {
    ({ app, module } = await initializeApp());
    service = module.get<SpotService>(SpotService);

    await clearDatabase(app);
  });

  it('should create a `spot`', async () => {
    const name = 'foo';
    const location = 'waldo';
    const { body } = await request(app.getHttpServer())
      .post('/graphql')
      .expect(200)
      .send({
        query: `
          mutation {
            createSpot(input: { location: "${location}" name: "${name}" }) {
              createdAt
              id
              name
              location
              updatedAt
            }
          }
        `,
      });

    const spots = await service.findAll();
    const spot = head(spots);

    expect(spots.length).toEqual(1);
    expect(body.data.createSpot).toEqual({
      ...head(spots),
      createdAt: spot.createdAt.toISOString(),
      updatedAt: spot.updatedAt.toISOString(),
    });
  });
});
