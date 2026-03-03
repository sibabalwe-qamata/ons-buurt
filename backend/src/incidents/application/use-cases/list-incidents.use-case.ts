import { Inject, Injectable } from '@nestjs/common';
import {
  INCIDENT_REPOSITORY,
  IncidentRepositoryPort,
} from '../ports/incident.repository.port';
import { Incident } from '../../domain/entities/incident.entity';
import { IncidentMapType } from '../../domain/types/incident.types';

@Injectable()
export class ListIncidentsUseCase {
  constructor(
    @Inject(INCIDENT_REPOSITORY)
    private readonly incidentRepository: IncidentRepositoryPort,
  ) {}

  async execute(mapType?: IncidentMapType): Promise<Incident[]> {
    return this.incidentRepository.findAll(mapType);
  }
}
