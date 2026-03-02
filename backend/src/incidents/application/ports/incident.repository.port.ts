import { Incident } from '../../domain/entities/incident.entity';
import { IncidentMapType } from '../../domain/types/incident.types';


export interface IncidentRepositoryPort {
  save(incident: Omit<Incident, 'id' | 'created_at' | 'updated_at'>): Promise<Incident>;
  findAll(mapType?: IncidentMapType): Promise<Incident[]>;
  findById(id: string): Promise<Incident | null>;
  update(id: string, data: Partial<Pick<Incident, 'vouches_count'>>): Promise<Incident>;
}

export const INCIDENT_REPOSITORY = Symbol('INCIDENT_REPOSITORY');
