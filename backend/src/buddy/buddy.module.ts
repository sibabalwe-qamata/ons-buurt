import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BUDDY_GROUP_REPOSITORY } from './application/ports/buddy-group.repository.port';
import { CreateBuddyGroupUseCase } from './application/use-cases/create-buddy-group.use-case';
import { ListBuddyGroupsUseCase } from './application/use-cases/list-buddy-groups.use-case';
import { JoinBuddyGroupUseCase } from './application/use-cases/join-buddy-group.use-case';
import { TypeOrmBuddyGroupRepository } from './infrastructure/adapters/typeorm-buddy-group.repository';
import { BuddyGroupSchema } from './infrastructure/persistence/buddy-group.schema';
import { BuddyGroupMemberSchema } from './infrastructure/persistence/buddy-group-member.schema';
import { BuddyGroupsController } from './presentation/buddy-groups.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([BuddyGroupSchema, BuddyGroupMemberSchema]),
  ],
  controllers: [BuddyGroupsController],
  providers: [
    CreateBuddyGroupUseCase,
    ListBuddyGroupsUseCase,
    JoinBuddyGroupUseCase,
    {
      provide: BUDDY_GROUP_REPOSITORY,
      useClass: TypeOrmBuddyGroupRepository,
    },
  ],
  exports: [CreateBuddyGroupUseCase, ListBuddyGroupsUseCase, JoinBuddyGroupUseCase],
})
export class BuddyModule {}
