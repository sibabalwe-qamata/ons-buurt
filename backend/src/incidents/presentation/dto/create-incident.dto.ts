import { IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { IncidentReportType } from '../../domain/types/incident.types';

export class CreateIncidentDto {
  @IsEnum(['theft', 'suspicious', 'road', 'safe'])
  type: IncidentReportType;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  location: string;

  @IsString()
  @IsOptional()
  @MaxLength(2000)
  description?: string;

  @IsOptional()
  lat?: number;

  @IsOptional()
  lng?: number;
}
