export type Database = {
  connection: {
    database: string;
    host: string;
    port?: number;
    password?: string;
    username: string;
  };
  driver: 'postgres';
};
