import { Test, TestingModule } from '@nestjs/testing';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';
import { MailService } from '../mail/mail.service';
import { HttpException } from '@nestjs/common';
import { PaginationDto } from '../common/dto/pagination.dto';
import { CacheInterceptor } from '@nestjs/cache-manager';

const mockBookingService = {
  getAllBookings: jest.fn(),
  getOneBookingAllHistories: jest.fn(),
  getBookingDetails: jest.fn(),
  updateBooking: jest.fn(),
  removeBooking: jest.fn(),
  addFeedback: jest.fn(),
};
describe('BookingController', () => {
  let controller: BookingController;
  let bookingService: jest.Mocked<BookingService>;
  let mailService: jest.Mocked<MailService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookingController],
      providers: [
        {
          provide: BookingService,
          useValue: mockBookingService,
        },
        {
          provide: MailService,
          useValue: {
            sendMail: jest.fn(),
          },
        },
      ],
    })
      .overrideInterceptor(CacheInterceptor)
      .useValue({
        intercept: jest.fn((context, next) => next.handle()),
      })
      .compile();

    controller = module.get<BookingController>(BookingController);
    bookingService = module.get(BookingService);
    mailService = module.get(MailService);
  });

  // GET ALL BOOKINGS

  describe('getAllBookings', () => {
    const query: PaginationDto = { page: 1, limit: 10 };
    it('should return all bookings', async () => {
      const output = {
        status: true,
        type: 'something',
        year: 2025,
        data: [],
      };
      bookingService.getAllBookings.mockResolvedValue(output);

      const result = await controller.getAllBookings(query);
      expect(result).toEqual(output);
    });

    it('should throw HttpException on failure', async () => {
      bookingService.getAllBookings.mockRejectedValue({
        message: 'Error',
        status: 500,
      });

      await expect(controller.getAllBookings(query)).rejects.toBeInstanceOf(
        HttpException,
      );
    });
  });

  // // GET BOOKING HISTORIES

  describe('getOneBookingAllHistories', () => {
    const query = {
      page: 1,
      limit: 10,
    } as PaginationDto;

    it('should return booking histories', async () => {
      const output = {
        status: true,
        data: [],
        pagination: { page: 1, limit: 10, totalPages: 2 },
      };
      bookingService.getOneBookingAllHistories.mockResolvedValue(output);
      const result = await controller.getOneBookingAllHistories('1', query);
      expect(result).toEqual(output);
    });
  });

  // // GET BOOKING DETAILS

  describe('getBookingDetails', () => {
    it('should return booking details', async () => {
      const output = {
        status: true,
        data: {},
      };
      bookingService.getBookingDetails.mockResolvedValue(output);

      const result = await controller.getBookingDetails('1');

      expect(result).toEqual(output);
    });
  });

  // // UPDATE BOOKING

  describe('updateBooking', () => {
    const req = {
      user: { userId: 10 },
    };
    it('should update booking and send email', async () => {
      const output = {
        status: true,
        message: 'Booking  updated...',
      };
      bookingService.updateBooking.mockResolvedValue(output);

      const result = await controller.updateBooking(
        req,
        '5',
        {} as PaginationDto,
      );

      expect(result).toEqual(output);
    });
  });

  // DELETE BOOKING

  describe('removeBooking', () => {
    it('should delete booking', async () => {
      const output = { status: true, message: 'Booking deleted...' };
      bookingService.removeBooking.mockResolvedValue(output);
      const result = await controller.removeBooking('3');
      expect(result).toEqual(output);
    });
  });

  // // ADD FEEDBACK

  describe('addFeedback', () => {
    const req = {
      user: { userId: 20 },
    };
    it('should add feedback to booking', async () => {
      const output = { status: true, message: 'Feedback is added ...' };
      bookingService.addFeedback.mockResolvedValue(output);
      const result = await controller.addFeedback(req, '7', {
        rating: 5,
        description: 'Great car!',
      });

      expect(result).toEqual(output);
    });
  });
});
