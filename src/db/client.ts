import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from './schema'; 
import config from '../config/config';

const connectionString = config.databaseUrl || 'postgres://localhost:5432/mydb';

const sql = neon(connectionString);

export const db = drizzle(sql, {
  schema,      
  logger: true  
});