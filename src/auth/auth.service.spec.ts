import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpException, HttpStatus } from '@nestjs/common';

import { AuthService } from './auth.service';
import { User } from '../users/entities/user.entity';
import { UserRole } from '../users/entities/user-role.entity';
import { Role } from '../roles/entities/role.entity';
import { JwtHelper } from '../auth/helpers/jwt.helper';
import * as HashHelper from './helpers/hashing.helper';
import { LoginAuthDto } from './dto/login.dto';

describe('AuthService', () => {
  let service: AuthService;
  let userRepo: Repository<User>;
  let userRoleRepo: Repository<UserRole>;
  let roleRepo: Repository<Role>;

  const mockUserRepo = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockUserRoleRepo = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockRoleRepo = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getRepositoryToken(User), useValue: mockUserRepo },
        { provide: getRepositoryToken(UserRole), useValue: mockUserRoleRepo },
        { provide: getRepositoryToken(Role), useValue: mockRoleRepo },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepo = module.get(getRepositoryToken(User));
    userRoleRepo = module.get(getRepositoryToken(UserRole));
    roleRepo = module.get(getRepositoryToken(Role));
  });

  describe('userRegister', () => {
    const dto = {
      email: 'test@mail.com',
      password: '123456',
      roleId: 1,
    } as LoginAuthDto;

    it('should register a new user successfully', async () => {
      jest
        .spyOn(HashHelper, 'generateHashPassword')
        .mockReturnValue('hashedPassword');

      mockUserRepo.findOne.mockResolvedValue(null);
      mockUserRoleRepo.findOne.mockResolvedValue(null);

      mockUserRepo.create.mockReturnValue({ id: 1 });
      mockUserRepo.save.mockResolvedValue({ id: 1 });

      const result = await service.userRegister(dto);

      expect(result).toEqual({
        status: true,
        message: 'User Registered',
      });
    });

    it('should throw conflict if user already exists with role', async () => {
      mockUserRepo.findOne.mockResolvedValue({ id: 1 });
      mockUserRoleRepo.findOne.mockResolvedValue({ id: 1 });

      await expect(service.userRegister(dto)).rejects.toThrow(HttpException);
      await expect(service.userRegister(dto)).rejects.toMatchObject({
        status: HttpStatus.CONFLICT,
        message: 'User already exist',
      });
    });
  });

  describe('userLogin', () => {
    const dto = {
      email: 'test@mail.com',
      password: '123456',
      roleId: 1,
    };

    it('should login user ', async () => {
      mockUserRepo.findOne.mockResolvedValue({
        id: 1,
        password: 'hashedPassword',
      });

      mockUserRoleRepo.findOne.mockResolvedValue({ id: 1 });
      mockRoleRepo.findOne.mockResolvedValue({ name: 'Admin' });

      jest.spyOn(HashHelper, 'comparePassword').mockResolvedValue(true);

      jest.spyOn(JwtHelper, 'generateAccessAndRefreshToken').mockReturnValue({
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      });
      const output = {
        status: true,
        message: 'User loggedIn...',
        roleName: 'Admin',
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      };
      const result = await service.userLogin(dto);

      expect(result).toEqual(output);
    });

    it('should throw error for incorrect password', async () => {
      mockUserRepo.findOne.mockResolvedValue({
        id: 1,
        password: 'hashedPassword',
      });

      mockUserRoleRepo.findOne.mockResolvedValue({ id: 1 });

      jest.spyOn(HashHelper, 'comparePassword').mockResolvedValue(false);

      await expect(service.userLogin(dto)).rejects.toMatchObject({
        status: HttpStatus.BAD_REQUEST,
        message: 'Incorrect user or password ',
      });
    });

    it('should throw error if user or role not found', async () => {
      mockUserRepo.findOne.mockResolvedValue(null);

      await expect(service.userLogin(dto)).rejects.toMatchObject({
        status: HttpStatus.BAD_REQUEST,
        message: 'User does not exist ',
      });
    });
  });
});
