import { Test, TestingModule } from '@nestjs/testing';
import { CreateBuddyGroupUseCase } from './create-buddy-group.use-case';
import { BUDDY_GROUP_REPOSITORY } from '../ports/buddy-group.repository.port';
import { BuddyGroup } from '../../domain/entities/buddy-group.entity';

describe('CreateBuddyGroupUseCase', () => {
  let useCase: CreateBuddyGroupUseCase;
  let mockRepository: {
    create: jest.Mock;
  };

  const mockGroup: BuddyGroup = {
    id: 'uuid-1',
    route: 'Manenberg → Station',
    time: '06:30 AM',
    max_members: 8,
    start_point: 'Shoprite',
    end_point: 'Station',
    verified: false,
    created_at: new Date(),
  };

  beforeEach(async () => {
    mockRepository = {
      create: jest.fn().mockResolvedValue(mockGroup),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateBuddyGroupUseCase,
        {
          provide: BUDDY_GROUP_REPOSITORY,
          useValue: mockRepository,
        },
      ],
    }).compile();

    useCase = module.get<CreateBuddyGroupUseCase>(CreateBuddyGroupUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should create buddy group with verified false when not provided', async () => {
    const result = await useCase.execute({
      route: 'Manenberg → Station',
      time: '06:30 AM',
      max_members: 8,
      start_point: 'Shoprite',
      end_point: 'Station',
    });

    expect(mockRepository.create).toHaveBeenCalledWith({
      route: 'Manenberg → Station',
      time: '06:30 AM',
      max_members: 8,
      start_point: 'Shoprite',
      end_point: 'Station',
      verified: false,
    });
    expect(result).toEqual(mockGroup);
  });

  it('should create buddy group with verified true when provided', async () => {
    await useCase.execute({
      route: 'Route A',
      time: '07:00 AM',
      max_members: 10,
      start_point: 'A',
      end_point: 'B',
      verified: true,
    });

    expect(mockRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        verified: true,
      }),
    );
  });

  it('should create buddy group with verified false when explicitly false', async () => {
    await useCase.execute({
      route: 'Route A',
      time: '07:00 AM',
      max_members: 10,
      start_point: 'A',
      end_point: 'B',
      verified: false,
    });

    expect(mockRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        verified: false,
      }),
    );
  });
});
