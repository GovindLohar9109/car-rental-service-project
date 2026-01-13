import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MailService } from '../mail/mail.service';
import { HttpException } from '@nestjs/common';
import { RegisterAuthDto } from './dto/register.dto';
import { LoginAuthDto } from './dto/login.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: jest.Mocked<AuthService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            userRegister: jest.fn(),
            userLogin: jest.fn(),
          },
        },
        {
          provide: MailService,
          useValue: {
            sendMail: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get(AuthService);
  });

  describe('userRegister()', () => {
    it('should register user and send welcome mail', async () => {
      const dto: RegisterAuthDto = {
        email: 'test@example.com',
        password: 'Password@123',
        roleId: 1,
      } as RegisterAuthDto;

      const output = {
        message: 'User Registered',
        status: true,
      };
      authService.userRegister.mockResolvedValue(output);
      const result = await controller.userRegister(dto);
      expect(result).toEqual({
        message: 'User Registeredand check your mail',
        status: true,
      });
    });

    it('should throw HttpException if registration fails', async () => {
      authService.userRegister.mockRejectedValue({
        message: 'User already exists',
        status: 409,
      });

      await expect(
        controller.userRegister({} as RegisterAuthDto),
      ).rejects.toBeInstanceOf(HttpException);
    });
  });

  describe('userLogin()', () => {
    const dto: LoginAuthDto = {
      email: 'test@example.com',
      password: 'Password@123',
    };
    it('should login user successfully', async () => {
      const output = {
        status: true,
        message: 'User loggedIn...',
        roleName: 'User',
        accessToken: 'access-token',
        refreshToken: 'access-token',
      };
      authService.userLogin.mockResolvedValue(output);
      const response = await controller.userLogin(dto);
      expect(response).toEqual(output);
    });

    it('should throw HttpException if login fails', async () => {
      authService.userLogin.mockRejectedValue({
        message: 'Invalid credentials',
        status: 401,
      });

      await expect(controller.userLogin(dto)).rejects.toBeInstanceOf(
        HttpException,
      );
    });
  });
});
