import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { VouchIncidentUseCase } from './vouch-incident.use-case';
import { INCIDENT_REPOSITORY } from '../ports/incident.repository.port';
import { Incident } from '../../domain/entities/incident.entity';

describe('VouchIncidentUseCase', () => {
  let useCase: VouchIncidentUseCase;
  let mockRepository: {
    findById: jest.Mock;
    update: jest.Mock;
  };

  const mockIncident: Incident = {
    id: 'uuid-1',
    type: 'theft',
    map_type: 'danger',
    location: 'Test',
    description: null,
    lat: null,
    lng: null,
    title: 'Test',
    vouches_count: 5,
    created_at: new Date(),
    updated_at: new Date(),
  };

  const updatedIncident: Incident = {
    ...mockIncident,
    vouches_count: 6,
  };

  beforeEach(async () => {
    mockRepository = {
      findById: jest.fn().mockResolvedValue(mockIncident),
      update: jest.fn().mockResolvedValue(updatedIncident),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VouchIncidentUseCase,
        {
          provide: INCIDENT_REPOSITORY,
          useValue: mockRepository,
        },
      ],
    }).compile();

    useCase = module.get<VouchIncidentUseCase>(VouchIncidentUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should increment vouches_count and return updated incident', async () => {
    const result = await useCase.execute('uuid-1');

    expect(mockRepository.findById).toHaveBeenCalledWith('uuid-1');
    expect(mockRepository.update).toHaveBeenCalledWith('uuid-1', {
      vouches_count: 6,
    });
    expect(result).toEqual(updatedIncident);
  });

  it('should throw NotFoundException when incident not found', async () => {
    mockRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute('non-existent')).rejects.toThrow(NotFoundException);
    await expect(useCase.execute('non-existent')).rejects.toThrow(
      'Incident non-existent not found',
    );
    expect(mockRepository.update).not.toHaveBeenCalled();
  });

  it('should handle incident with zero vouches', async () => {
    mockRepository.findById.mockResolvedValue({ ...mockIncident, vouches_count: 0 });
    mockRepository.update.mockResolvedValue({ ...mockIncident, vouches_count: 1 });

    const result = await useCase.execute('uuid-1');

    expect(mockRepository.update).toHaveBeenCalledWith('uuid-1', {
      vouches_count: 1,
    });
    expect(result.vouches_count).toBe(1);
  });
});
