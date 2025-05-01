import { Pool } from 'pg';

export const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'siteBuilder',
  password: 'postgres',
  port: 5438,
});