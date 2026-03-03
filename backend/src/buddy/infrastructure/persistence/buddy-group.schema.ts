import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { BuddyGroupMemberSchema } from './buddy-group-member.schema';

@Entity('buddy_groups')
export class BuddyGroupSchema {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  route: string;

  @Column({ type: 'varchar', length: 50 })
  time: string;

  @Column({ type: 'int', default: 8 })
  max_members: number;

  @Column({ type: 'varchar', length: 255 })
  start_point: string;

  @Column({ type: 'varchar', length: 255 })
  end_point: string;

  @Column({ type: 'boolean', default: false })
  verified: boolean;

  @CreateDateColumn()
  created_at: Date;

  @OneToMany(() => BuddyGroupMemberSchema, (m) => m.group)
  members: BuddyGroupMemberSchema[];
}
