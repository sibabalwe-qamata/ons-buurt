import 'dotenv/config';
import { DataSource } from 'typeorm';
import { parse } from 'pg-connection-string';
import { IncidentSchema } from '../incidents/infrastructure/persistence/incident.schema';
import { BuddyGroupSchema } from '../buddy/infrastructure/persistence/buddy-group.schema';
import { BuddyGroupMemberSchema } from '../buddy/infrastructure/persistence/buddy-group-member.schema';

const url = process.env.DATABASE_URL;
const entities = [IncidentSchema, BuddyGroupSchema, BuddyGroupMemberSchema];

let config: {
  type: 'postgres';
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  ssl?: boolean | object;
};

if (url && typeof url === 'string') {
  const parsed = parse(url);
  config = {
    type: 'postgres',
    host: String(parsed.host ?? 'localhost'),
    port: parseInt(String(parsed.port ?? 5432), 10),
    username: String(parsed.user ?? 'postgres'),
    password: String(parsed.password ?? ''),
    database: String(parsed.database ?? 'ons_buurt'),
    ssl: url.includes('sslmode=require') ? { rejectUnauthorized: false } : false,
  };
} else {
  config = {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: '',
    database: 'ons_buurt',
    ssl: false,
  };
}

export default new DataSource({
  ...config,
  entities,
  migrations: ['src/database/migrations/*.ts'],
  migrationsTableName: 'migrations',
});
