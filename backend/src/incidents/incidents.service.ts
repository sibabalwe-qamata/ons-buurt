import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Incident, IncidentMapType } from './entities/incident.entity';
import { CreateIncidentDto } from './dto/create-incident.dto';

const REPORT_TO_MAP_TYPE: Record<string, IncidentMapType> = {
  theft: 'danger',
  road: 'danger',
  suspicious: 'warning',
  safe: 'safe',
};

@Injectable()
export class IncidentsService {
  constructor(
    @InjectRepository(Incident)
    private readonly incidentRepo: Repository<Incident>,
  ) {}

  async create(dto: CreateIncidentDto): Promise<Incident> {
    const map_type = REPORT_TO_MAP_TYPE[dto.type] ?? 'warning';
    const title = dto.description
      ? `${dto.description.slice(0, 80)}${dto.description.length > 80 ? '...' : ''}`
      : `${dto.type} – ${dto.location}`;

    const incident = this.incidentRepo.create({
      type: dto.type,
      map_type,
      location: dto.location,
      description: dto.description ?? null,
      lat: dto.lat ?? null,
      lng: dto.lng ?? null,
      title,
    });
    return this.incidentRepo.save(incident);
  }

  async findAll(mapType?: IncidentMapType): Promise<Incident[]> {
    const qb = this.incidentRepo.createQueryBuilder('incident').orderBy('incident.created_at', 'DESC');
    if (mapType) {
      qb.andWhere('incident.map_type = :mapType', { mapType });
    }
    return qb.getMany();
  }

  async findOne(id: string): Promise<Incident> {
    const incident = await this.incidentRepo.findOne({ where: { id } });
    if (!incident) throw new NotFoundException(`Incident ${id} not found`);
    return incident;
  }

  async vouch(id: string): Promise<Incident> {
    const incident = await this.findOne(id);
    incident.vouches_count += 1;
    return this.incidentRepo.save(incident);
  }
}
