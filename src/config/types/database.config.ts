export type Database = {
  connection: {
    database: string;
    host: string;
    password?: string;
    username: string;
  };
  driver: 'postgres';
};
