import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateSpotInput {
  @Field()
  location: string;

  @Field()
  name: string;
}
