import { merge } from 'lodash';

import devConfig from './dev.env';
import prdConfig from './prd.env';
import testConfig from './test.env';

const configuration = () => {
  const env = process.env.NODE_ENV;
  const mapping = {
    dev: devConfig,
    prd: prdConfig,
    test: testConfig,
  };

  return mapping[env]();
};

export default () => {
  const customConfig = {
    database: {
      connection: {
        database: process.env.DATABASE_CONNECTION_DATABASE,
        host: process.env.DATABASE_CONNECTION_HOST,
        password: process.env.DATABASE_CONNECTION_PASSWORD,
        username: process.env.DATABASE_CONNECTION_USERNAME,
      },
      driver: process.env.DATABASE_DRIVER,
    },
    graphql: {
      debug: process.env.GRAPHQL_DEBUG,
    },
    server: {
      port: process.env.SERVER_PORT ?? 3000,
    },
  };

  return merge(configuration(), customConfig);
};
