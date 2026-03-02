import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { CreateBuddyGroupUseCase } from '../application/use-cases/create-buddy-group.use-case';
import { ListBuddyGroupsUseCase } from '../application/use-cases/list-buddy-groups.use-case';
import { JoinBuddyGroupUseCase } from '../application/use-cases/join-buddy-group.use-case';
import { CreateBuddyGroupDto } from './dto/create-buddy-group.dto';
import { JoinBuddyGroupDto } from './dto/join-buddy-group.dto';

@Controller('buddy-groups')
export class BuddyGroupsController {
  constructor(
    private readonly createBuddyGroupUseCase: CreateBuddyGroupUseCase,
    private readonly listBuddyGroupsUseCase: ListBuddyGroupsUseCase,
    private readonly joinBuddyGroupUseCase: JoinBuddyGroupUseCase,
  ) {}

  @Get()
  findAll() {
    return this.listBuddyGroupsUseCase.execute();
  }

  @Post()
  create(@Body() dto: CreateBuddyGroupDto) {
    return this.createBuddyGroupUseCase.execute({
      route: dto.route,
      time: dto.time,
      max_members: dto.maxMembers,
      start_point: dto.startPoint,
      end_point: dto.endPoint,
      verified: dto.verified,
    });
  }

  @Post(':id/join')
  join(@Param('id') id: string, @Body() dto?: JoinBuddyGroupDto) {
    return this.joinBuddyGroupUseCase.execute(id, {
      member_name: dto?.memberName,
      session_id: dto?.sessionId,
    });
  }
}
