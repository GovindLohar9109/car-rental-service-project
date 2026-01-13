import { Test, TestingModule } from '@nestjs/testing';
import { CarController } from './car.controller';
import { CarService } from './car.service';
import { MailService } from '../mail/mail.service';
import { PaginationDto } from '../common/dto/pagination.dto';
import { CacheInterceptor } from '@nestjs/cache-manager';

describe('CarController', () => {
  let controller: CarController;
  let carService: jest.Mocked<CarService>;

  const mockCarService = {
    getAllCar: jest.fn(),
    addBooking: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CarController],
      providers: [
        {
          provide: CarService,
          useValue: mockCarService,
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

    controller = module.get<CarController>(CarController);
    carService = module.get(CarService);
    mailService = module.get(MailService);
  });

  // GET ALL CARS

  describe('getAllCar', () => {
    const query: PaginationDto = { page: 1, limit: 10 };

    it('should return all cars', async () => {
      const output = {
        status: true,
        data: [],
        pagination: { page: 1, limit: 10, totalPages: 2 },
      };
      carService.getAllCar.mockResolvedValue(output);
      const result = await controller.getAllCar(query);
      expect(result).toEqual(output);
    });
  });

  // ADD BOOKING

  describe('addBooking', () => {
    const req = {
      user: { userId: 1 },
    };

    const dto = {
      startDate: '2025-01-01',
      endDate: '2025-01-05',
    };

    it('should create booking and send emails', async () => {
      const output = {
        status: true,
        message: 'Car is booked ...',
      };
      carService.addBooking.mockResolvedValue(output);
      const result = await controller.addBooking(req, '10', dto);
      expect(result).toEqual(output);
    });
  });
});
