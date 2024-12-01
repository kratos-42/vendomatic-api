import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Database } from '@config/types/database.config';
import { Spot } from '@spot/entities/spot.entity';

@Module({
  exports: [TypeOrmModule],
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const database = configService.get<Database>('database');

        return {
          database: database.connection.database,
          entities: [Spot],
          host: database.connection.host,
          password: database.connection.password,
          synchronize: true,
          type: database.driver,
          username: database.connection.username,
        };
      },
    }),
  ],
})
export class DatabaseModule {}
