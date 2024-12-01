export default () => ({
  database: {
    connection: {
      database: 'test',
      host: 'localhost',
      username: 'postgres',
    },
    driver: 'postgres',
  },
  graphql: {
    debug: true,
  },
});
