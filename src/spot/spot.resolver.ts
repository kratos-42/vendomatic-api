import { UseGuards } from '@nestjs/common';
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';

import { Roles } from '@app/auth/decorators/roles.decorator';
import { Role } from '@app/auth/enums/role.enum';
import { GqlAuthGuard } from '@app/auth/guards/gql-auth.guard';
import { CreateSpotInput } from '@spot/dto/create-spot.input';
import { UpdateSpotInput } from '@spot/dto/update-spot.input';
import { Spot } from '@spot/entities/spot.entity';
import { SpotService } from '@spot/spot.service';

@Resolver(() => Spot)
export class SpotResolver {
  constructor(private readonly spotService: SpotService) {}

  @Mutation(() => Spot)
  @UseGuards(GqlAuthGuard)
  @Roles(Role.ADMIN)
  createSpot(@Args('input') createSpotInput: CreateSpotInput) {
    return this.spotService.create(createSpotInput);
  }

  @Query(() => [Spot], { name: 'spots' })
  @UseGuards(GqlAuthGuard)
  @Roles(Role.ADMIN, Role.TECHNICIAN)
  spots() {
    return this.spotService.findAll();
  }

  @Query(() => Spot, { name: 'spot' })
  @UseGuards(GqlAuthGuard)
  @Roles(Role.ADMIN, Role.TECHNICIAN)
  spot(@Args('id') id: string) {
    return this.spotService.findById(id);
  }

  @Mutation(() => Spot)
  @UseGuards(GqlAuthGuard)
  @Roles(Role.ADMIN)
  updateSpot(@Args('id') id: string, @Args('input') updateSpotInput: UpdateSpotInput) {
    return this.spotService.update(id, updateSpotInput);
  }

  @Mutation(() => Spot)
  @UseGuards(GqlAuthGuard)
  @Roles(Role.ADMIN)
  removeSpot(@Args('id') id: string) {
    return this.spotService.remove(id);
  }
}
