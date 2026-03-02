import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BuddyGroup } from './entities/buddy-group.entity';
import { BuddyGroupMember } from './entities/buddy-group-member.entity';
import { CreateBuddyGroupDto } from './dto/create-buddy-group.dto';
import { JoinBuddyGroupDto } from './dto/join-buddy-group.dto';

@Injectable()
export class BuddyGroupsService {
  constructor(
    @InjectRepository(BuddyGroup)
    private readonly groupRepo: Repository<BuddyGroup>,
    @InjectRepository(BuddyGroupMember)
    private readonly memberRepo: Repository<BuddyGroupMember>,
  ) {}

  async findAll(): Promise<BuddyGroup[]> {
    return this.groupRepo.find({
      relations: ['members'],
      order: { created_at: 'DESC' },
    });
  }

  async create(dto: CreateBuddyGroupDto): Promise<BuddyGroup> {
    const group = this.groupRepo.create({
      route: dto.route,
      time: dto.time,
      max_members: dto.maxMembers,
      start_point: dto.startPoint,
      end_point: dto.endPoint,
      verified: dto.verified ?? false,
    });
    return this.groupRepo.save(group);
  }

  async findOne(id: string): Promise<BuddyGroup> {
    const group = await this.groupRepo.findOne({
      where: { id },
      relations: ['members'],
    });
    if (!group) throw new NotFoundException(`Buddy group ${id} not found`);
    return group;
  }

  async join(id: string, dto?: JoinBuddyGroupDto): Promise<BuddyGroup> {
    const group = await this.findOne(id);
    const memberCount = group.members?.length ?? 0;
    if (memberCount >= group.max_members) {
      throw new BadRequestException('Group is full');
    }
    const member = this.memberRepo.create({
      group_id: id,
      member_name: dto?.memberName ?? null,
      session_id: dto?.sessionId ?? null,
    });
    await this.memberRepo.save(member);
    return this.findOne(id);
  }
}
