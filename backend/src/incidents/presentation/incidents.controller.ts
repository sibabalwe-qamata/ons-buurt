import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { CreateIncidentUseCase } from '../application/use-cases/create-incident.use-case';
import { ListIncidentsUseCase } from '../application/use-cases/list-incidents.use-case';
import { VouchIncidentUseCase } from '../application/use-cases/vouch-incident.use-case';
import { CreateIncidentDto } from './dto/create-incident.dto';
import { IncidentMapType } from '../domain/types/incident.types';

@Controller('incidents')
export class IncidentsController {
  constructor(
    private readonly createIncidentUseCase: CreateIncidentUseCase,
    private readonly listIncidentsUseCase: ListIncidentsUseCase,
    private readonly vouchIncidentUseCase: VouchIncidentUseCase,
  ) {}

  @Post()
  create(@Body() dto: CreateIncidentDto) {
    return this.createIncidentUseCase.execute({
      type: dto.type,
      location: dto.location,
      description: dto.description,
      lat: dto.lat,
      lng: dto.lng,
    });
  }

  @Get()
  findAll(@Query('type') type?: IncidentMapType) {
    return this.listIncidentsUseCase.execute(type);
  }

  @Post(':id/vouch')
  vouch(@Param('id') id: string) {
    return this.vouchIncidentUseCase.execute(id);
  }
}
