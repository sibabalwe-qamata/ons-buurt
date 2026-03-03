import { Inject, Injectable } from '@nestjs/common';
import {
  BUDDY_GROUP_REPOSITORY,
  BuddyGroupRepositoryPort,
} from '../ports/buddy-group.repository.port';
import { BuddyGroup } from '../../domain/entities/buddy-group.entity';

@Injectable()
export class ListBuddyGroupsUseCase {
  constructor(
    @Inject(BUDDY_GROUP_REPOSITORY)
    private readonly buddyGroupRepository: BuddyGroupRepositoryPort,
  ) {}

  async execute(): Promise<BuddyGroup[]> {
    return this.buddyGroupRepository.findAll();
  }
}
