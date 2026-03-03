import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { JoinBuddyGroupUseCase } from './join-buddy-group.use-case';
import { BUDDY_GROUP_REPOSITORY } from '../ports/buddy-group.repository.port';
import { BuddyGroup } from '../../domain/entities/buddy-group.entity';

describe('JoinBuddyGroupUseCase', () => {
  let useCase: JoinBuddyGroupUseCase;
  let mockRepository: {
    findById: jest.Mock;
    getMemberCount: jest.Mock;
    addMember: jest.Mock;
  };

  const mockGroup: BuddyGroup = {
    id: 'uuid-1',
    route: 'Manenberg → Station',
    time: '06:30 AM',
    max_members: 8,
    start_point: 'Shoprite',
    end_point: 'Station',
    verified: true,
    created_at: new Date(),
  };

  const groupWithNewMember: BuddyGroup = {
    ...mockGroup,
    members: [{ id: 'm1', group_id: 'uuid-1', member_name: 'John', session_id: null, created_at: new Date() }],
  };

  beforeEach(async () => {
    mockRepository = {
      findById: jest.fn().mockResolvedValue(mockGroup),
      getMemberCount: jest.fn().mockResolvedValue(3),
      addMember: jest.fn().mockResolvedValue(groupWithNewMember),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JoinBuddyGroupUseCase,
        {
          provide: BUDDY_GROUP_REPOSITORY,
          useValue: mockRepository,
        },
      ],
    }).compile();

    useCase = module.get<JoinBuddyGroupUseCase>(JoinBuddyGroupUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should add member and return updated group when group has capacity', async () => {
    const result = await useCase.execute('uuid-1');

    expect(mockRepository.findById).toHaveBeenCalledWith('uuid-1');
    expect(mockRepository.getMemberCount).toHaveBeenCalledWith('uuid-1');
    expect(mockRepository.addMember).toHaveBeenCalledWith('uuid-1', {});
    expect(result).toEqual(groupWithNewMember);
  });

  it('should pass member name and session id when provided', async () => {
    await useCase.execute('uuid-1', {
      member_name: 'John',
      session_id: 'sess-123',
    });

    expect(mockRepository.addMember).toHaveBeenCalledWith('uuid-1', {
      member_name: 'John',
      session_id: 'sess-123',
    });
  });

  it('should throw NotFoundException when group not found', async () => {
    mockRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute('non-existent')).rejects.toThrow(NotFoundException);
    await expect(useCase.execute('non-existent')).rejects.toThrow(
      'Buddy group non-existent not found',
    );
    expect(mockRepository.addMember).not.toHaveBeenCalled();
  });

  it('should throw BadRequestException when group is full', async () => {
    mockRepository.getMemberCount.mockResolvedValue(8);

    await expect(useCase.execute('uuid-1')).rejects.toThrow(BadRequestException);
    await expect(useCase.execute('uuid-1')).rejects.toThrow('Group is full');
    expect(mockRepository.addMember).not.toHaveBeenCalled();
  });

  it('should throw BadRequestException when member count equals max_members', async () => {
    mockRepository.findById.mockResolvedValue({ ...mockGroup, max_members: 8 });
    mockRepository.getMemberCount.mockResolvedValue(8);

    await expect(useCase.execute('uuid-1')).rejects.toThrow(BadRequestException);
  });

  it('should call addMember with empty object when input not provided', async () => {
    await useCase.execute('uuid-1');

    expect(mockRepository.addMember).toHaveBeenCalledWith('uuid-1', {});
  });
});
