import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class Health {
  @Field({ description: 'Example field (placeholder)' })
  value: string;
}
