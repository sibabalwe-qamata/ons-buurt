import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  INCIDENT_REPOSITORY,
  IncidentRepositoryPort,
} from '../ports/incident.repository.port';
import { Incident } from '../../domain/entities/incident.entity';

@Injectable()
export class VouchIncidentUseCase {
  constructor(
    @Inject(INCIDENT_REPOSITORY)
    private readonly incidentRepository: IncidentRepositoryPort,
  ) {}

  async execute(id: string): Promise<Incident> {
    const incident = await this.incidentRepository.findById(id);
    if (!incident) {
      throw new NotFoundException(`Incident ${id} not found`);
    }
    return this.incidentRepository.update(id, {
      vouches_count: incident.vouches_count + 1,
    });
  }
}
