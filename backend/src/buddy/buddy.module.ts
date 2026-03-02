import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BuddyGroup } from './entities/buddy-group.entity';
import { BuddyGroupMember } from './entities/buddy-group-member.entity';
import { BuddyGroupsController } from './buddy-groups.controller';
import { BuddyGroupsService } from './buddy-groups.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([BuddyGroup, BuddyGroupMember]),
  ],
  controllers: [BuddyGroupsController],
  providers: [BuddyGroupsService],
  exports: [BuddyGroupsService],
})
export class BuddyModule {}
