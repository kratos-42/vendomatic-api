import { TestingModule } from '@nestjs/testing';

import { SpotResolver } from '@spot/spot.resolver';
import { initializeApp } from '@test/utils/nest-testing-module';

describe('SpotResolver', () => {
  let resolver: SpotResolver;
  let module: TestingModule;

  beforeEach(async () => {
    ({ module } = await initializeApp());

    resolver = module.get<SpotResolver>(SpotResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
