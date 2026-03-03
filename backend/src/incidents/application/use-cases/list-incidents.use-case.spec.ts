import { Test, TestingModule } from '@nestjs/testing';
import { ListIncidentsUseCase } from './list-incidents.use-case';
import { INCIDENT_REPOSITORY } from '../ports/incident.repository.port';
import { Incident } from '../../domain/entities/incident.entity';

describe('ListIncidentsUseCase', () => {
  let useCase: ListIncidentsUseCase;
  let mockRepository: {
    findAll: jest.Mock;
  };

  const mockIncidents: Incident[] = [
    {
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
    },
  ];

  beforeEach(async () => {
    mockRepository = {
      findAll: jest.fn().mockResolvedValue(mockIncidents),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ListIncidentsUseCase,
        {
          provide: INCIDENT_REPOSITORY,
          useValue: mockRepository,
        },
      ],
    }).compile();

    useCase = module.get<ListIncidentsUseCase>(ListIncidentsUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should return all incidents when no mapType filter', async () => {
    const result = await useCase.execute();

    expect(mockRepository.findAll).toHaveBeenCalledWith(undefined);
    expect(result).toEqual(mockIncidents);
  });

  it('should call findAll with mapType when filter provided', async () => {
    await useCase.execute('safe');

    expect(mockRepository.findAll).toHaveBeenCalledWith('safe');
  });

  it('should return empty array when repository returns empty', async () => {
    mockRepository.findAll.mockResolvedValue([]);

    const result = await useCase.execute('danger');

    expect(result).toEqual([]);
  });
});
