import { Field, ObjectType } from '@nestjs/graphql';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class Spot {
  @CreateDateColumn({ type: 'timestamp with time zone' })
  @Field()
  createdAt: Date;

  @PrimaryGeneratedColumn('uuid')
  @Field()
  id: string;

  @Column()
  @Field()
  name: string;

  @Column()
  @Field()
  location: string;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  @Field()
  updatedAt: Date;
}
