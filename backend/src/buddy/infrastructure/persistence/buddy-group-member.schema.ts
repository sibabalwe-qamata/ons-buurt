import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { BuddyGroupSchema } from './buddy-group.schema';

@Entity('buddy_group_members')
export class BuddyGroupMemberSchema {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  group_id: string;

  @ManyToOne(() => BuddyGroupSchema, (g) => g.members, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'group_id' })
  group: BuddyGroupSchema;

  @Column({ type: 'varchar', length: 255, nullable: true })
  member_name: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  session_id: string | null;

  @CreateDateColumn()
  created_at: Date;
}
