import { Incident } from '../../domain/entities/incident.entity';
import { IncidentMapType } from '../../domain/types/incident.types';

export const REPORT_TO_MAP_TYPE: Record<string, IncidentMapType> = {
  theft: 'danger',
  road: 'danger',
  suspicious: 'warning',
  safe: 'safe',
};

export interface CreateIncidentInput {
  type: Incident['type'];
  location: string;
  description?: string;
  lat?: number;
  lng?: number;
}
