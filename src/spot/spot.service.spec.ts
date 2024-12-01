import { TestingModule } from '@nestjs/testing';

import { SpotService } from '@spot/spot.service';
import { initializeApp } from '@test/utils/nest-testing-module';

describe('SpotService', () => {
  let service: SpotService;
  let module: TestingModule;

  beforeEach(async () => {
    ({ module } = await initializeApp());

    service = module.get<SpotService>(SpotService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
