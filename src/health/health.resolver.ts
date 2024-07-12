import { Resolver, Query } from '@nestjs/graphql';

import { Health } from './entities/health.entity';
import { HealthService } from './health.service';

@Resolver(() => Health)
export class HealthResolver {
  constructor(private readonly healthService: HealthService) {}

  @Query(() => Health, { name: 'checkHealth' })
  checkHealth() {
    return this.healthService.checkHealth();
  }
}
