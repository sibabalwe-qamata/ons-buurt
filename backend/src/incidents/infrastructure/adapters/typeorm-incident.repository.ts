import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IncidentRepositoryPort } from '../../application/ports/incident.repository.port';
import { Incident } from '../../domain/entities/incident.entity';
import { IncidentMapType } from '../../domain/types/incident.types';
import { IncidentSchema } from '../persistence/incident.schema';

@Injectable()
export class TypeOrmIncidentRepository implements IncidentRepositoryPort {
  constructor(
    @InjectRepository(IncidentSchema)
    private readonly repo: Repository<IncidentSchema>,
  ) {}

  async save(
    data: Omit<Incident, 'id' | 'created_at' | 'updated_at'>,
  ): Promise<Incident> {
    const entity = this.repo.create(data);
    const saved = await this.repo.save(entity);
    return this.toDomain(saved);
  }

  async findAll(mapType?: IncidentMapType): Promise<Incident[]> {
    const qb = this.repo
      .createQueryBuilder('incident')
      .orderBy('incident.created_at', 'DESC');
    if (mapType) {
      qb.andWhere('incident.map_type = :mapType', { mapType });
    }
    const rows = await qb.getMany();
    return rows.map((r) => this.toDomain(r));
  }

  async findById(id: string): Promise<Incident | null> {
    const row = await this.repo.findOne({ where: { id } });
    return row ? this.toDomain(row) : null;
  }

  async update(
    id: string,
    data: Partial<Pick<Incident, 'vouches_count'>>,
  ): Promise<Incident> {
    await this.repo.update(id, data);
    const row = await this.repo.findOne({ where: { id } });
    if (!row) throw new Error(`Incident ${id} not found after update`);
    return this.toDomain(row);
  }

  private toDomain(row: IncidentSchema): Incident {
    return {
      id: row.id,
      type: row.type,
      map_type: row.map_type,
      location: row.location,
      description: row.description,
      lat: row.lat != null ? Number(row.lat) : null,
      lng: row.lng != null ? Number(row.lng) : null,
      title: row.title,
      vouches_count: row.vouches_count,
      created_at: row.created_at,
      updated_at: row.updated_at,
    };
  }
}
