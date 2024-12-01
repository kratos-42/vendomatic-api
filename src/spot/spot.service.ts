import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { BaseRepository } from '@database/base.repository';
import { CreateSpotInput } from '@spot/dto/create-spot.input';
import { UpdateSpotInput } from '@spot/dto/update-spot.input';
import { Spot } from '@spot/entities/spot.entity';

import { SpotRepository } from './spot.repository';

@Injectable()
export class SpotService {
  constructor(@InjectRepository(SpotRepository) private readonly spotRepository: SpotRepository) {}

  async create(createSpotInput: CreateSpotInput): Promise<Spot> {
    const { data } = await this.spotRepository.insertAndFetch(createSpotInput);

    return data;
  }

  async update(id: string, updateSpotInput: UpdateSpotInput): Promise<Spot> {
    const { data } = await this.spotRepository.patchById(id, updateSpotInput);

    return data;
  }

  async findAll(conditions?: FindAllPayload): Promise<Spot[]> {
    const { data } = await this.spotRepository.findAll(conditions);

    return data;
  }

  async findById(id: string): Promise<Spot> {
    const { data } = await this.spotRepository.findById(id);

    return data;
  }

  async remove(id: string): Promise<void> {
    await this.spotRepository.delete(id);
  }
}

/**
 * Types.
 */

type FindAllPayload = Parameters<BaseRepository<Spot>['findAll']>[0];
