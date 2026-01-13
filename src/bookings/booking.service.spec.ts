import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { BookingService } from './booking.service';
import { Booking } from '../bookings/entities/booking.entity';
import { BookingHistory } from '../bookings/entities/booking-history';
import { Car } from '../cars/entities/car.entity';
import { Feedback } from '../feedbacks/entities/feedback.entity';
import { User } from '../users/entities/user.entity';
import { BookingStatus } from './enums/booking.enum';
import { PaginationDto } from 'src/common/dto/pagination.dto';

describe('BookingService', () => {
  let service: BookingService;

  let bookingRepo: Repository<Booking>;
  let bookingHistoryRepo: Repository<BookingHistory>;
  let carRepo: Repository<Car>;
  let feedbackRepo: Repository<Feedback>;
  let userRepo: Repository<User>;

  const mockRepo = {
    find: jest.fn(),
    findOne: jest.fn(),
    findAndCount: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    softDelete: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingService,
        { provide: getRepositoryToken(Booking), useValue: mockRepo },
        { provide: getRepositoryToken(BookingHistory), useValue: mockRepo },
        { provide: getRepositoryToken(Car), useValue: mockRepo },
        { provide: getRepositoryToken(Feedback), useValue: mockRepo },
        { provide: getRepositoryToken(User), useValue: mockRepo },
      ],
    }).compile();

    service = module.get<BookingService>(BookingService);

    bookingRepo = module.get(getRepositoryToken(Booking));
    bookingHistoryRepo = module.get(getRepositoryToken(BookingHistory));
    carRepo = module.get(getRepositoryToken(Car));
    feedbackRepo = module.get(getRepositoryToken(Feedback));
    userRepo = module.get(getRepositoryToken(User));
  });

  describe('getAllBookings', () => {
    const query = {
      page: 1,
      limit: 10,
    } as PaginationDto;

    const output = {
      status: true,
      type: 'ALL_BOOKINGS',
      totalBookings: 1,
      pagination: { page: 1, limit: 10, totalPages: 1 },
      data: [{ id: 1 }],
    };
    it('should return bookings', async () => {
      const qb: any = {
        innerJoinAndSelect: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([[{ id: 1 }], 1]),
      };

      mockRepo.createQueryBuilder.mockReturnValue(qb);
      const result = await service.getAllBookings(query);
      expect(result).toEqual(output);
    });
  });

  describe('getOneBookingAllHistories', () => {
    const query = {
      page: 1,
      limit: 10,
    } as PaginationDto;

    const output = {
      status: true,
      data: [{ id: 1 }],
      pagination: { page: 1, limit: 10, totalPages: 1 },
    };
    it('should return booking histories ', async () => {
      mockRepo.findAndCount.mockResolvedValue([[{ id: 1 }], 1]);
      const result = await service.getOneBookingAllHistories(1, query);

      expect(result).toEqual(output);
    });
  });

  describe('getBookingDetails', () => {
    const output = { status: true, data: { id: 1 } };
    it('should return booking details', async () => {
      const qb: any = {
        innerJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue({ id: 1 }),
      };

      mockRepo.createQueryBuilder.mockReturnValue(qb);

      const result = await service.getBookingDetails(1);

      expect(result).toEqual(output);
    });
  });

  describe('updateBooking', () => {
    const output = {
      message: 'Booking  updated...',
      status: true,
      userEmail: 'test@mail.com',
    };
    it('should update booking', async () => {
      mockRepo.update.mockResolvedValue(null);

      mockRepo.findOne.mockResolvedValue({
        id: 1,
        totalAmount: 500,
        status: BookingStatus.ONGOING,
        startDate: new Date(),
        endDate: new Date(),
        user: { id: 1, email: 'test@mail.com' },
        car: { id: 1 },
      });

      mockRepo.create.mockReturnValue({});
      mockRepo.save.mockResolvedValue({});

      const result = await service.updateBooking(1, 1, {
        status: BookingStatus.ONGOING,
      });

      expect(result).toEqual(output);
    });
  });

  describe('removeBooking', () => {
    const output = { status: true, message: 'Booking deleted...' };
    it('should  delete booking', async () => {
      mockRepo.softDelete.mockResolvedValue(null);
      const result = await service.removeBooking(1);
      expect(result).toEqual(output);
    });
  });

  describe('addFeedback', () => {
    const output = { status: true, message: 'Feedback is added ...' };
    it('should add feedback ', async () => {
      mockRepo.create.mockReturnValue({});
      mockRepo.save.mockResolvedValue({});

      const result = await service.addFeedback(1, 1, {
        rating: 5,
        description: 'something',
      });

      expect(result).toEqual(output);
    });
  });
});
