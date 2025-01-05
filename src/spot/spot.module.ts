import { Module } from '@nestjs/common';

import { SpotRepository } from '@spot/spot.repository';
import { SpotResolver } from '@spot/spot.resolver';
import { SpotService } from '@spot/spot.service';

@Module({
  providers: [SpotRepository, SpotResolver, SpotService],
})
export class SpotModule {}
