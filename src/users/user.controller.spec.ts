import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { HttpException } from '@nestjs/common';
import { PaginationDto } from '../common/dto/pagination.dto';
import { CacheInterceptor } from '@nestjs/cache-manager';

describe('UserController', () => {
  let controller: UserController;
  let userService: jest.Mocked<UserService>; // this is not real service

  const mockUserService = {
    getUser: jest.fn(),
    getAllUsers: jest.fn(),
    updateUser: jest.fn(),
    removeUser: jest.fn(),

    addUserAddress: jest.fn(),
    getUserAddress: jest.fn(),
    getUserAllAddresses: jest.fn(),
    updateUserAddress: jest.fn(),
    removeUserAddress: jest.fn(),

    addCar: jest.fn(),
    getCarDetails: jest.fn(),
    getUserAllCars: jest.fn(),
    updateCar: jest.fn(),
    removeCar: jest.fn(),
  };

  const mockRequest = {
    user: { userId: 1 },
  };

  beforeEach(async () => {
    //creating mini nest app for testing
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    })

      .overrideInterceptor(CacheInterceptor)
      .useValue({ intercept: jest.fn() })
      .compile();

    controller = module.get<UserController>(UserController);
    userService = module.get(UserService);
  });

  // ================= USER =================

  describe('getUser', () => {
    it('should return user', async () => {
      const output = {
        status: true,
        data: {},
      };
      userService.getUser.mockResolvedValue(output);
      const result = await controller.getUser(mockRequest);
      expect(result).toEqual(output);
    });

    it('should throw HttpException on error', async () => {
      userService.getUser.mockRejectedValue({
        message: 'Error',
        status: 500,
      });

      await expect(controller.getUser(mockRequest)).rejects.toBeInstanceOf(
        HttpException,
      );
    });
  });

  describe('getAllUsers', () => {
    const query: PaginationDto = { page: 1, limit: 10 };

    it('should return users list', async () => {
      const output = {
        status: true,
        data: [],
      };
      userService.getAllUsers.mockResolvedValue(output);
      const result = await controller.getAllUsers(query);
      expect(result).toEqual(output);
    });
  });

  describe('updateUser', () => {
    it('should update user', async () => {
      const output = { status: true, message: 'User updated...' };
      userService.updateUser.mockResolvedValue(output);
      const result = await controller.updateUser(mockRequest, {} as any);
      expect(result).toEqual(output);
    });
  });

  describe('removeUser', () => {
    it('should remove user', async () => {
      const output = { status: true, message: 'User deleted...' };
      userService.removeUser.mockResolvedValue(output);
      const result = await controller.removeUser(mockRequest);
      expect(result).toEqual(output);
    });
  });

  // ================= ADDRESS =================

  describe('addUserAddress', () => {
    it('should add address', async () => {
      const output = { status: true, message: 'User address added...' };
      userService.addUserAddress.mockResolvedValue(output);
      const result = await controller.addUserAddress(mockRequest, {} as any);
      expect(result).toEqual(output);
    });
  });

  describe('getUserAddress', () => {
    it('should return address', async () => {
      const output = {
        status: true,
        data: { user: {}, userAddress: {} },
      };
      userService.getUserAddress.mockResolvedValue(output);
      const result = await controller.getUserAddress(mockRequest, '1');
      expect(result).toEqual(output);
    });
  });

  describe('getUserAllAddresses', () => {
    const query: PaginationDto = { page: 1, limit: 10 };

    it('should return all addresses', async () => {
      const output = {
        status: true,
        data: { user: {}, userAddresses: [] },
        pagination: { page: 1, limit: 10, totalPages: 2 },
      };
      userService.getUserAllAddresses.mockResolvedValue(output);
      const result = await controller.getUserAllAddresses(mockRequest, query);
      expect(result).toEqual(output);
    });
  });

  describe('updateUserAddress', () => {
    it('should update address', async () => {
      const output = { status: true, message: 'User address updated...' };
      userService.updateUserAddress.mockResolvedValue(output);
      const result = await controller.updateUserAddress('1', {} as any);
      expect(result).toEqual(output);
    });
  });

  describe('removeUserAddress', () => {
    it('should remove address', async () => {
      const output = { status: true, message: 'User deleted...' };
      userService.removeUserAddress.mockResolvedValue(output);
      const result = await controller.removeUserAddress(mockRequest, '1');
      expect(result).toEqual(output);
    });
  });

  // ================= CAR =================

  describe('addCar', () => {
    it('should add car', async () => {
      const output = {
        status: true,
        data: [],
        pagination: { page: 1, limit: 10, totalPages: 2 },
      };
      userService.addCar.mockResolvedValue(output);
      const result = await controller.addCar(mockRequest, {} as any);
      expect(result).toEqual(output);
    });
  });

  describe('getCarDetails', () => {
    it('should return car details', async () => {
      const output = {
        status: true,
        data: {},
      };
      userService.getCarDetails.mockResolvedValue(output);
      const result = await controller.getCarDetails('1');
      expect(result).toEqual(output);
    });
  });

  describe('getUserAllCars', () => {
    const query: PaginationDto = { page: 1, limit: 10 };

    it('should return user cars', async () => {
      const output = {
        status: true,
        data: [],
        pagination: { page: 1, limit: 10, totalPages: 2 },
      };
      userService.getUserAllCars.mockResolvedValue(output);
      const result = await controller.getUserAllCars(mockRequest, query);
      expect(result).toEqual(output);
    });
  });

  describe('updateCar', () => {
    it('should update car', async () => {
      const output = { status: true, message: 'Car  updated...' };
      userService.updateCar.mockResolvedValue(output);
      const result = await controller.updateCar('1', {} as any);
      expect(result).toEqual(output);
    });
  });

  describe('removeCar', () => {
    it('should remove car', async () => {
      const output = { status: true, message: 'Car deleted...' };
      userService.removeCar.mockResolvedValue(output);
      const result = await controller.removeCar('1');
      expect(result).toEqual(output);
    });
  });
});
