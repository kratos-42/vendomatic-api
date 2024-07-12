import { Test, TestingModule } from '@nestjs/testing';

import { HealthResolver } from './health.resolver';
import { HealthService } from './health.service';

describe('HealthResolver', () => {
  let resolver: HealthResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HealthResolver, HealthService],
    }).compile();

    resolver = module.get<HealthResolver>(HealthResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  it('should be defined', () => {
    const result = resolver.checkHealth();

    expect(result).toEqual({ value: 'All good' });
  });
});
