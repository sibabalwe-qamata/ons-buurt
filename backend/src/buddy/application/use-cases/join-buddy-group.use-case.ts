import { Inject, Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { BUDDY_GROUP_REPOSITORY, BuddyGroupRepositoryPort } from '../ports/buddy-group.repository.port';
import { JoinBuddyGroupInput } from '../types/create-buddy-group.types';
import { BuddyGroup } from '../../domain/entities/buddy-group.entity';

@Injectable()
export class JoinBuddyGroupUseCase {
  constructor(
    @Inject(BUDDY_GROUP_REPOSITORY)
    private readonly buddyGroupRepository: BuddyGroupRepositoryPort,
  ) {}

  async execute(groupId: string, input?: JoinBuddyGroupInput): Promise<BuddyGroup> {
    const group = await this.buddyGroupRepository.findById(groupId);
    if (!group) {
      throw new NotFoundException(`Buddy group ${groupId} not found`);
    }
    const memberCount = await this.buddyGroupRepository.getMemberCount(groupId);
    if (memberCount >= group.max_members) {
      throw new BadRequestException('Group is full');
    }
    return this.buddyGroupRepository.addMember(groupId, input ?? {});
  }
}
