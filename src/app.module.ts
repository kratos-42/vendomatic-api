import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';

import { AppService } from '@app/app.service';
import { ConfigModule } from '@config/config.module';
import { DatabaseModule } from '@database/database.module';
import { SpotModule } from '@spot/spot.module';

process.env.NODE_ENV = process.env.NODE_ENV || 'test';

@Module({
  imports: [
    ConfigModule,
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory(configService: ConfigService) {
        return {
          autoSchemaFile: 'schema.gql',
          debug: configService.get('graphql.debug'),
          playground: configService.get('graphql.debug'),
        };
      },
    }),
    DatabaseModule,
    SpotModule,
  ],
  providers: [AppService],
})
export class AppModule {}
