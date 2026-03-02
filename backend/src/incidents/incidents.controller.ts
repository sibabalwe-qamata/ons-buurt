import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { IncidentsService } from './incidents.service';
import { CreateIncidentDto } from './dto/create-incident.dto';
import { IncidentMapType } from './entities/incident.entity';

@Controller('incidents')
export class IncidentsController {
  constructor(private readonly incidentsService: IncidentsService) {}

  @Post()
  create(@Body() dto: CreateIncidentDto) {
    return this.incidentsService.create(dto);
  }

  @Get()
  findAll(@Query('type') type?: IncidentMapType) {
    return this.incidentsService.findAll(type);
  }

  @Post(':id/vouch')
  vouch(@Param('id') id: string) {
    return this.incidentsService.vouch(id);
  }
}
