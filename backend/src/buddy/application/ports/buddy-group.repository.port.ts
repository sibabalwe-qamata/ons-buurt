import { BuddyGroup } from '../../domain/entities/buddy-group.entity';
import {
  CreateBuddyGroupInput,
  JoinBuddyGroupInput,
} from '../types/create-buddy-group.types';

export type { CreateBuddyGroupInput, JoinBuddyGroupInput };


export interface BuddyGroupRepositoryPort {
  findAll(): Promise<BuddyGroup[]>;
  findById(id: string): Promise<BuddyGroup | null>;
  create(input: CreateBuddyGroupInput): Promise<BuddyGroup>;
  addMember(groupId: string, input: JoinBuddyGroupInput): Promise<BuddyGroup>;
  getMemberCount(groupId: string): Promise<number>;
}

export const BUDDY_GROUP_REPOSITORY = Symbol('BUDDY_GROUP_REPOSITORY');
