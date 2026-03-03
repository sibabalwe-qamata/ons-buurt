import { parse } from 'pg-connection-string';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { IncidentSchema } from '../incidents/infrastructure/persistence/incident.schema';
import { BuddyGroupSchema } from '../buddy/infrastructure/persistence/buddy-group.schema';
import { BuddyGroupMemberSchema } from '../buddy/infrastructure/persistence/buddy-group-member.schema';

/**
 * Parse DATABASE_URL and return TypeORM config with password explicitly as string.
 * Fixes "client password must be a string" when Doppler or env passes values
 * that get coerced (e.g. undefined, number) during URL parsing.
 * @see https://github.com/brianc/node-postgres/issues/3223
 * @see https://docs.doppler.com/docs/accessing-secrets
 */
export function getDatabaseConfig(): TypeOrmModuleOptions {
  const url = process.env.DATABASE_URL;
  const entities = [IncidentSchema, BuddyGroupSchema, BuddyGroupMemberSchema];

  if (!url || typeof url !== 'string') {
    return {
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '',
      database: 'ons_buurt',
      entities,
      synchronize: process.env.NODE_ENV !== 'production',
      ssl: false,
    };
  }

  const parsed = parse(url);

  return {
    type: 'postgres',
    host: String(parsed.host ?? 'localhost'),
    port: parseInt(String(parsed.port ?? 5432), 10),
    username: String(parsed.user ?? 'postgres'),
    password: String(parsed.password ?? ''),
    database: String(parsed.database ?? 'ons_buurt'),
    entities,
    synchronize: process.env.NODE_ENV !== 'production',
    ssl: url.includes('sslmode=require') ? { rejectUnauthorized: false } : false,
  };
}
