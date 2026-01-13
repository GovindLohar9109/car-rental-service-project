import { Test, TestingModule } from '@nestjs/testing';
import { FeedbackController } from './feedback.controller';
import { FeedbackService } from './feedback.service';
import { PaginationDto } from '../common/dto/pagination.dto';

describe('FeedbackController', () => {
  let controller: FeedbackController;
  let feedbackService: jest.Mocked<FeedbackService>;

  const mockFeedbackService = {
    getAllFeedbacks: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FeedbackController],
      providers: [
        {
          provide: FeedbackService,
          useValue: mockFeedbackService,
        },
      ],
    }).compile();

    controller = module.get<FeedbackController>(FeedbackController);
    feedbackService = module.get(FeedbackService);
  });

  // GET ALL FEEDBACKS

  describe('getAllFeedbacks', () => {
    const query: PaginationDto = { page: 1, limit: 10 };

    it('should return all feedbacks', async () => {
      const output = {
        status: true,
        data: [],
        totalBookings: 2,
        pagination: { page: 1, limit: 10, totalPages: 2 },
      };

      feedbackService.getAllFeedbacks.mockResolvedValue(output);
      const result = await controller.getAllFeedbacks(query);
      expect(result).toEqual(output);
    });
  });
});
