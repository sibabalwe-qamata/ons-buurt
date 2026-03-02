import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { BuddyGroupsService } from './buddy-groups.service';
import { CreateBuddyGroupDto } from './dto/create-buddy-group.dto';
import { JoinBuddyGroupDto } from './dto/join-buddy-group.dto';

@Controller('buddy-groups')
export class BuddyGroupsController {
  constructor(private readonly buddyGroupsService: BuddyGroupsService) {}

  @Get()
  findAll() {
    return this.buddyGroupsService.findAll();
  }

  @Post()
  create(@Body() dto: CreateBuddyGroupDto) {
    return this.buddyGroupsService.create(dto);
  }

  @Post(':id/join')
  join(@Param('id') id: string, @Body() dto?: JoinBuddyGroupDto) {
    return this.buddyGroupsService.join(id, dto);
  }
}
