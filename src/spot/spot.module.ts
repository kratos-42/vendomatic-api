import { Module } from '@nestjs/common';

import { AuthModule } from '@auth/auth.module';
import { SpotRepository } from '@spot/spot.repository';
import { SpotResolver } from '@spot/spot.resolver';
import { SpotService } from '@spot/spot.service';

@Module({
  imports: [AuthModule],
  providers: [SpotRepository, SpotResolver, SpotService],
})
export class SpotModule {}
