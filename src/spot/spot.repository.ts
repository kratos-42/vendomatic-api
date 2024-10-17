import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

import { BaseRepository } from '@database/base.repository';
import { Spot } from '@spot/entities/spot.entity';

@Injectable()
export class SpotRepository extends BaseRepository<Spot> {
  constructor(dataSource: DataSource) {
    super(Spot, dataSource);
  }
}
