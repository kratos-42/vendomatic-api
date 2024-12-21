import { get } from 'lodash';
import { DataSource, DataSourceOptions } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

import { Database } from '@app/config/types/database.config';
import { Spot } from '@spot/entities/spot.entity';

import config from '../../env/custom.env';

const databaseConfig: Database = get(config(), 'database');
const {
  connection: { database, host, password, port, username },
} = databaseConfig;

export const datasourceConfig: DataSourceOptions = {
  entities: [Spot],
  migrations: [__dirname + '/migrations/*.js'],
  migrationsRun: false,
  namingStrategy: new SnakeNamingStrategy(),
  synchronize: false,
  type: databaseConfig.driver,
  url: `postgresql://${username}:${password}@${host}:${port}/${database}`,
};

export default new DataSource(datasourceConfig);
