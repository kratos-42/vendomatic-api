import { InputType, PartialType } from '@nestjs/graphql';

import { CreateSpotInput } from '@spot/dto/create-spot.input';

@InputType()
export class UpdateSpotInput extends PartialType(CreateSpotInput) {}
