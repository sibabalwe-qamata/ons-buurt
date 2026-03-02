import { Inject, Injectable } from '@nestjs/common';
import { BUDDY_GROUP_REPOSITORY, BuddyGroupRepositoryPort } from '../ports/buddy-group.repository.port';
import { CreateBuddyGroupInput } from '../types/create-buddy-group.types';
import { BuddyGroup } from '../../domain/entities/buddy-group.entity';

@Injectable()
export class CreateBuddyGroupUseCase {
  constructor(
    @Inject(BUDDY_GROUP_REPOSITORY)
    private readonly buddyGroupRepository: BuddyGroupRepositoryPort,
  ) {}

  async execute(input: CreateBuddyGroupInput): Promise<BuddyGroup> {
    return this.buddyGroupRepository.create({
      route: input.route,
      time: input.time,
      max_members: input.max_members,
      start_point: input.start_point,
      end_point: input.end_point,
      verified: input.verified ?? false,
    });
  }
}
