import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IncidentsModule } from './incidents/incidents.module';
import { BuddyModule } from './buddy/buddy.module';
import { getDatabaseConfig } from './database/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(getDatabaseConfig()),
    IncidentsModule,
    BuddyModule,
  ],
})
export class AppModule {}
