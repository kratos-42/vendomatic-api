import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Spot } from '@spot/entities/spot.entity';
import { SpotRepository } from '@spot/spot.repository';
import { SpotResolver } from '@spot/spot.resolver';
import { SpotService } from '@spot/spot.service';

@Module({
  imports: [TypeOrmModule.forFeature([Spot])],
  providers: [SpotRepository, SpotResolver, SpotService],
})
export class SpotModule {}
