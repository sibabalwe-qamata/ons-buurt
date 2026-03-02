import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BuddyGroupRepositoryPort } from '../../application/ports/buddy-group.repository.port';
import {
  CreateBuddyGroupInput,
  JoinBuddyGroupInput,
} from '../../application/types/create-buddy-group.types';
import { BuddyGroup } from '../../domain/entities/buddy-group.entity';
import { BuddyGroupSchema } from '../persistence/buddy-group.schema';
import { BuddyGroupMemberSchema } from '../persistence/buddy-group-member.schema';

@Injectable()
export class TypeOrmBuddyGroupRepository implements BuddyGroupRepositoryPort {
  constructor(
    @InjectRepository(BuddyGroupSchema)
    private readonly groupRepo: Repository<BuddyGroupSchema>,
    @InjectRepository(BuddyGroupMemberSchema)
    private readonly memberRepo: Repository<BuddyGroupMemberSchema>,
  ) {}

  async findAll(): Promise<BuddyGroup[]> {
    const rows = await this.groupRepo.find({
      relations: ['members'],
      order: { created_at: 'DESC' },
    });
    return rows.map((r) => this.toDomain(r));
  }

  async findById(id: string): Promise<BuddyGroup | null> {
    const row = await this.groupRepo.findOne({
      where: { id },
      relations: ['members'],
    });
    return row ? this.toDomain(row) : null;
  }

  async create(input: CreateBuddyGroupInput): Promise<BuddyGroup> {
    const entity = this.groupRepo.create(input);
    const saved = await this.groupRepo.save(entity);
    return this.toDomain(saved);
  }

  async addMember(groupId: string, input: JoinBuddyGroupInput): Promise<BuddyGroup> {
    const member = this.memberRepo.create({
      group_id: groupId,
      member_name: input.member_name ?? null,
      session_id: input.session_id ?? null,
    });
    await this.memberRepo.save(member);
    const group = await this.findById(groupId);
    if (!group) throw new Error(`Group ${groupId} not found after add member`);
    return group;
  }

  async getMemberCount(groupId: string): Promise<number> {
    return this.memberRepo.count({ where: { group_id: groupId } });
  }

  private toDomain(row: BuddyGroupSchema): BuddyGroup {
    return {
      id: row.id,
      route: row.route,
      time: row.time,
      max_members: row.max_members,
      start_point: row.start_point,
      end_point: row.end_point,
      verified: row.verified,
      created_at: row.created_at,
      members: row.members?.map((m) => ({
        id: m.id,
        group_id: m.group_id,
        member_name: m.member_name,
        session_id: m.session_id,
        created_at: m.created_at,
      })),
    };
  }
}
