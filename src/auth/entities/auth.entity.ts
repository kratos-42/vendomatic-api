import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class User {
  @Field()
  email: string;

  @Field(() => ID)
  id: string;

  @Field({ nullable: true })
  name?: string;

  @Field()
  role: string;
}

@ObjectType()
export class Session {
  @Field()
  accessToken: string;

  @Field()
  expiresIn: number;

  @Field()
  refreshToken: string;
}

@ObjectType()
export class AuthOutput {
  @Field(() => Session)
  session: Session;

  @Field(() => User)
  user: User;
}
