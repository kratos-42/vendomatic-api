import { TestingModule } from '@nestjs/testing';

import { Spot } from '@spot/entities/spot.entity';
import { SpotRepository } from '@spot/spot.repository';

export const spotFixture = async (module: TestingModule, payload?: SpotFixturePayload) => {
  const repository = module.get<SpotRepository>(SpotRepository);
  const { data } = await repository.insertAndFetch({
    location: 'waldo',
    name: 'foo',
    ...payload,
  });

  return data;
};

/**
 * Types.
 */

export type SpotFixturePayload = Omit<Spot, 'createdAt' | 'id' | 'updatedAt'>;
