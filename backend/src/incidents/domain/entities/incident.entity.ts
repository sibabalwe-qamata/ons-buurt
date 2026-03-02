import { IncidentReportType, IncidentMapType } from '../types/incident.types';

export type { IncidentReportType, IncidentMapType };

/**
 * Domain entity - pure business object, no framework dependencies.
 * Represents an incident report in the Ons Buurt domain.
 */
export interface Incident {
  id: string;
  type: IncidentReportType;
  map_type: IncidentMapType;
  location: string;
  description: string | null;
  lat: number | null;
  lng: number | null;
  title: string;
  vouches_count: number;
  created_at: Date;
  updated_at: Date;
}
