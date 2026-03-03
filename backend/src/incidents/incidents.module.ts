import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { INCIDENT_REPOSITORY } from './application/ports/incident.repository.port';
import { CreateIncidentUseCase } from './application/use-cases/create-incident.use-case';
import { ListIncidentsUseCase } from './application/use-cases/list-incidents.use-case';
import { VouchIncidentUseCase } from './application/use-cases/vouch-incident.use-case';
import { TypeOrmIncidentRepository } from './infrastructure/adapters/typeorm-incident.repository';
import { IncidentSchema } from './infrastructure/persistence/incident.schema';
import { IncidentsController } from './presentation/incidents.controller';

@Module({
  imports: [TypeOrmModule.forFeature([IncidentSchema])],
  controllers: [IncidentsController],
  providers: [
    CreateIncidentUseCase,
    ListIncidentsUseCase,
    VouchIncidentUseCase,
    {
      provide: INCIDENT_REPOSITORY,
      useClass: TypeOrmIncidentRepository,
    },
  ],
  exports: [CreateIncidentUseCase, ListIncidentsUseCase, VouchIncidentUseCase],
})
export class IncidentsModule {}
