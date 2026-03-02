import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { BuddyGroup } from './buddy-group.entity';

@Entity('buddy_group_members')
export class BuddyGroupMember {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  group_id: string;

  @ManyToOne(() => BuddyGroup, (g) => g.members, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'group_id' })
  group: BuddyGroup;

  @Column({ type: 'varchar', length: 255, nullable: true })
  member_name: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  session_id: string | null;

  @CreateDateColumn()
  created_at: Date;
}
