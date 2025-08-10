import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';

import { AppService } from '@app/app.service';
import { AuthModule } from '@auth/auth.module';
import { LoggingInterceptor } from '@common/interceptors/logging.interceptor';
import { ConfigModule } from '@config/config.module';
import { DatabaseModule } from '@database/database.module';
import { SpotModule } from '@spot/spot.module';
import { UserModule } from '@user/user.module';

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
    AuthModule,
    UserModule,
  ],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {}
