import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { FeedbackService } from './feedback.service';
import { Feedback } from './entities/feedback.entity';

describe('FeedbackService ', () => {
  let service: FeedbackService;
  let feedbackRepo: Repository<Feedback>;

  const mockFeedbackRepo = {
    createQueryBuilder: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FeedbackService,
        {
          provide: getRepositoryToken(Feedback),
          useValue: mockFeedbackRepo,
        },
      ],
    }).compile();

    service = module.get<FeedbackService>(FeedbackService);
    feedbackRepo = module.get(getRepositoryToken(Feedback));
  });

  describe('getAllFeedbacks', () => {
    it('should return feedbacks ', async () => {
      const qb: any = {
        innerJoinAndSelect: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        getManyAndCount: jest
          .fn()
          .mockResolvedValue([[{ id: 1, rating: 5 }], 1]),
      };

      mockFeedbackRepo.createQueryBuilder.mockReturnValue(qb);

      const result = await service.getAllFeedbacks({
        page: 1,
        limit: 10,
      });

      expect(result.status).toBe(true);
      expect(result.data.length).toBe(1);
      expect(result.totalBookings).toBe(1);
      expect(result.pagination.totalPages).toBe(1);
    });
  });
});
