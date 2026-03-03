import { Test, TestingModule } from '@nestjs/testing';
import { ListBuddyGroupsUseCase } from './list-buddy-groups.use-case';
import { BUDDY_GROUP_REPOSITORY } from '../ports/buddy-group.repository.port';
import { BuddyGroup } from '../../domain/entities/buddy-group.entity';

describe('ListBuddyGroupsUseCase', () => {
  let useCase: ListBuddyGroupsUseCase;
  let mockRepository: {
    findAll: jest.Mock;
  };

  const mockGroups: BuddyGroup[] = [
    {
      id: 'uuid-1',
      route: 'Manenberg → Station',
      time: '06:30 AM',
      max_members: 8,
      start_point: 'Shoprite',
      end_point: 'Station',
      verified: true,
      created_at: new Date(),
    },
  ];

  beforeEach(async () => {
    mockRepository = {
      findAll: jest.fn().mockResolvedValue(mockGroups),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ListBuddyGroupsUseCase,
        {
          provide: BUDDY_GROUP_REPOSITORY,
          useValue: mockRepository,
        },
      ],
    }).compile();

    useCase = module.get<ListBuddyGroupsUseCase>(ListBuddyGroupsUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should return all buddy groups', async () => {
    const result = await useCase.execute();

    expect(mockRepository.findAll).toHaveBeenCalled();
    expect(result).toEqual(mockGroups);
  });

  it('should return empty array when no groups exist', async () => {
    mockRepository.findAll.mockResolvedValue([]);

    const result = await useCase.execute();

    expect(result).toEqual([]);
  });
});
