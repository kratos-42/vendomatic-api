import { INestApplication } from '@nestjs/common';
import { TestingModule } from '@nestjs/testing';
import request from 'supertest';

import { spotFixture } from '@test/fixtures/spot-fixture';
import { clearDatabase } from '@test/utils/database-util';
import { initializeApp } from '@test/utils/nest-testing-module';

describe('spots (e2e)', () => {
  let app: INestApplication;
  let module: TestingModule;

  beforeEach(async () => {
    ({ app, module } = await initializeApp());

    await clearDatabase(app);
  });

  it('should get a list of `spot`', async () => {
    const location = 'waldo';
    const spotFoobar = await spotFixture(module, { location, name: 'foobar' });
    const spotWaldo = await spotFixture(module, { location, name: 'waldo' });
    const { body } = await request(app.getHttpServer())
      .post('/graphql')
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
  });
});
