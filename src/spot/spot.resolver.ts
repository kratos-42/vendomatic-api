import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';

import { CreateSpotInput } from '@spot/dto/create-spot.input';
import { UpdateSpotInput } from '@spot/dto/update-spot.input';
import { Spot } from '@spot/entities/spot.entity';
import { SpotService } from '@spot/spot.service';

@Resolver(() => Spot)
export class SpotResolver {
  constructor(private readonly spotService: SpotService) {}

  @Mutation(() => Spot)
  createSpot(@Args('input') createSpotInput: CreateSpotInput) {
    return this.spotService.create(createSpotInput);
  }

  @Query(() => [Spot], { name: 'spots' })
  spots() {
    return this.spotService.findAll();
  }

  @Query(() => Spot, { name: 'spot' })
  spot(@Args('id') id: string) {
    return this.spotService.findById(id);
  }

  @Mutation(() => Spot)
  updateSpot(@Args('id') id: string, @Args('input') updateSpotInput: UpdateSpotInput) {
    return this.spotService.update(id, updateSpotInput);
  }

  @Mutation(() => Spot)
  removeSpot(@Args('id') id: string) {
    return this.spotService.remove(id);
  }
}
