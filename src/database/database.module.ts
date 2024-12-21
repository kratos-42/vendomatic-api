import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

import datasource, { datasourceConfig } from '@database/datasource.config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: () => {
        return datasourceConfig;
      },
    }),
  ],
  providers: [
    {
      provide: DataSource,
      useFactory: () => {
        return datasource.initialize();
      },
    },
  ],
})
export class DatabaseModule {}
