import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import {
  IncidentReportType,
  IncidentMapType,
} from '../../domain/types/incident.types';

/**
 * TypeORM persistence schema - infrastructure concern.
 * Maps to the incidents table.
 */
@Entity('incidents')
export class IncidentSchema {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50 })
  type: IncidentReportType;

  @Column({ type: 'varchar', length: 50 })
  map_type: IncidentMapType;

  @Column({ type: 'varchar', length: 255 })
  location: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  lat: number | null;

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  lng: number | null;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'int', default: 0 })
  vouches_count: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
