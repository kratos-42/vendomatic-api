import { INestApplication } from '@nestjs/common';
import { DataSource } from 'typeorm';

export const clearDatabase = async (app: INestApplication) => {
  const dataSource = app.get(DataSource);
  const entities = dataSource.entityMetadatas;

  for (const entity of entities) {
    const repository = dataSource.getRepository(entity.name);

    await repository.clear();
  }
};
