export default () => ({
  database: {
    connection: {
      database: 'test',
      host: 'localhost',
      port: '5432',
      username: 'postgres',
    },
    driver: 'postgres',
  },
  graphql: {
    debug: true,
  },
  supabase: {
    key: 'test',
    url: 'http://localhost:54321',
  },
});
