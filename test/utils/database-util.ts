import { INestApplication } from '@nestjs/common';
import { DataSource } from 'typeorm';

import { Spot } from '@spot/entities/spot.entity';

export function createConnection() {
  return new DataSource({
    database: 'test',
    entities: [Spot],
    host: 'localhost',
    port: 5432,
    synchronize: true,
    type: 'postgres',
    username: 'postgres',
  });
}

export const clearDatabase = async (app: INestApplication) => {
  const dataSource = app.get(DataSource);
  const entities = dataSource.entityMetadatas;

  for (const entity of entities) {
    const repository = dataSource.getRepository(entity.name);

    await repository.clear();
  }

  await dataSource.synchronize(true);
};
