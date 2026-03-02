import { Test, TestingModule } from '@nestjs/testing';
import { CreateIncidentUseCase } from './create-incident.use-case';
import { INCIDENT_REPOSITORY } from '../ports/incident.repository.port';
import { Incident } from '../../domain/entities/incident.entity';

describe('CreateIncidentUseCase', () => {
  let useCase: CreateIncidentUseCase;
  let mockRepository: {
    save: jest.Mock;
  };

  const mockIncident: Incident = {
    id: 'uuid-1',
    type: 'theft',
    map_type: 'danger',
    location: 'Test location',
    description: null,
    lat: null,
    lng: null,
    title: 'theft – Test location',
    vouches_count: 0,
    created_at: new Date(),
    updated_at: new Date(),
  };

  beforeEach(async () => {
    mockRepository = {
      save: jest.fn().mockResolvedValue(mockIncident),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateIncidentUseCase,
        {
          provide: INCIDENT_REPOSITORY,
          useValue: mockRepository,
        },
      ],
    }).compile();

    useCase = module.get<CreateIncidentUseCase>(CreateIncidentUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should create incident with type theft -> map_type danger', async () => {
    const result = await useCase.execute({
      type: 'theft',
      location: 'Corner of Main St',
      description: 'Mugging reported',
    });

    expect(mockRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'theft',
        map_type: 'danger',
        location: 'Corner of Main St',
        description: 'Mugging reported',
        title: 'Mugging reported',
        vouches_count: 0,
      }),
    );
    expect(result).toEqual(mockIncident);
  });

  it('should create incident with type road -> map_type danger', async () => {
    await useCase.execute({
      type: 'road',
      location: 'Highway 1',
    });

    expect(mockRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'road',
        map_type: 'danger',
      }),
    );
  });

  it('should create incident with type suspicious -> map_type warning', async () => {
    await useCase.execute({
      type: 'suspicious',
      location: 'Near school',
    });

    expect(mockRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'suspicious',
        map_type: 'warning',
      }),
    );
  });

  it('should create incident with type safe -> map_type safe', async () => {
    await useCase.execute({
      type: 'safe',
      location: 'Shoprite Manenberg',
    });

    expect(mockRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'safe',
        map_type: 'safe',
      }),
    );
  });

  it('should use description as title when provided and short', async () => {
    await useCase.execute({
      type: 'theft',
      location: 'Somewhere',
      description: 'Short desc',
    });

    expect(mockRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Short desc',
      }),
    );
  });

  it('should truncate long description with ellipsis', async () => {
    const longDesc = 'a'.repeat(100);
    await useCase.execute({
      type: 'theft',
      location: 'Somewhere',
      description: longDesc,
    });

    expect(mockRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'a'.repeat(80) + '...',
      }),
    );
  });

  it('should use type and location as title when no description', async () => {
    await useCase.execute({
      type: 'safe',
      location: 'Corner of 5th',
    });

    expect(mockRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'safe – Corner of 5th',
        description: null,
      }),
    );
  });

  it('should pass lat and lng when provided', async () => {
    await useCase.execute({
      type: 'theft',
      location: 'Here',
      lat: -34.034,
      lng: 18.555,
    });

    expect(mockRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        lat: -34.034,
        lng: 18.555,
      }),
    );
  });

  it('should pass null for lat/lng when not provided', async () => {
    await useCase.execute({
      type: 'theft',
      location: 'Here',
    });

    expect(mockRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        lat: null,
        lng: null,
      }),
    );
  });

  it('should not add ellipsis when description is exactly 80 chars', async () => {
    const exact80 = 'a'.repeat(80);
    await useCase.execute({
      type: 'theft',
      location: 'Here',
      description: exact80,
    });

    expect(mockRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        title: exact80,
      }),
    );
  });

  it('should use warning as fallback map_type when type not in mapping', async () => {
    await useCase.execute({
      type: 'unknown' as Incident['type'],
      location: 'Here',
    });

    expect(mockRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'unknown',
        map_type: 'warning',
      }),
    );
  });
});
