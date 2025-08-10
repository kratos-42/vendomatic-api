import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';

import { AppModule } from 'src/app.module';

export const initializeApp = async (): Promise<InitializeAppResponse> => {
  const module = await Test.createTestingModule({ imports: [AppModule] }).compile();
  const app = module.createNestApplication({ logger: false });
  const dataSource = app.get(DataSource);

  await app.init();

  return { app, dataSource, module };
};

/**
 * Types.
 */

type InitializeAppResponse = {
  app: INestApplication;
  dataSource: DataSource;
  module: TestingModule;
};
