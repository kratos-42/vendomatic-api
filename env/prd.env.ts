export default () => ({
  database: {
    connection: {
      database: 'postgres',
      host: 'aws-0-eu-west-3.pooler.supabase.com',
      port: 5432,
    },
    driver: 'postgres',
  },
  graphql: {
    debug: false,
  },
});
