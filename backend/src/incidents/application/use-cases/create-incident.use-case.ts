import { Inject, Injectable } from '@nestjs/common';
import {
  INCIDENT_REPOSITORY,
  IncidentRepositoryPort,
} from '../ports/incident.repository.port';
import { Incident } from '../../domain/entities/incident.entity';
import { CreateIncidentInput, REPORT_TO_MAP_TYPE } from '../types/create-incident.types';

export type { CreateIncidentInput } from '../types/create-incident.types';

@Injectable()
export class CreateIncidentUseCase {
  constructor(
    @Inject(INCIDENT_REPOSITORY)
    private readonly incidentRepository: IncidentRepositoryPort,
  ) {}

  async execute(input: CreateIncidentInput): Promise<Incident> {
    const map_type = REPORT_TO_MAP_TYPE[input.type] ?? 'warning';
    const title = input.description
      ? `${input.description.slice(0, 80)}${input.description.length > 80 ? '...' : ''}`
      : `${input.type} – ${input.location}`;

    return this.incidentRepository.save({
      type: input.type,
      map_type,
      location: input.location,
      description: input.description ?? null,
      lat: input.lat ?? null,
      lng: input.lng ?? null,
      title,
      vouches_count: 0,
    });
  }
}
