import { HttpException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  generateHashPassword,
  comparePassword,
} from './helpers/hashing.helper';
import { HttpStatus } from '@nestjs/common';
import { UserRole } from '../users/entities/user-role.entity';
import { Role } from '../roles/entities/role.entity';
import { JwtHelper } from '../auth/helpers/jwt.helper';
import { User } from '../users/entities/user.entity';
import { LoginAuthDto } from './dto/login.dto';
import { RegisterAuthDto } from './dto/register.dto';
import { RegisterResponseDto } from './dto/registerResponse.dto';
import { LoginResponseDto } from './dto/loginResponse.dto';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) // this will only work when add entity into  typeOrmModule.forFeature([User])
    private readonly userRepogistry: Repository<User>,
    @InjectRepository(UserRole)
    private readonly userRoleRepogistry: Repository<UserRole>,
    @InjectRepository(Role)
    private readonly roleRepogistry: Repository<Role>,
  ) {}

  async userRegister(
    registerAuthDto: RegisterAuthDto,
  ): Promise<RegisterResponseDto> {
    const { email, password, roleId } = registerAuthDto;
    try {
      // checking for email
      let userData = await this.userRepogistry.findOne({
        where: { email: email, deletedAt: null },
      });

      //cheking for role
      const userRole = await this.userRoleRepogistry.findOne({
        where: { user: { id: userData?.id }, role: { id: roleId } },
      });

      if (!userData || !userRole) {
        const hashPassword = generateHashPassword(password);
        registerAuthDto.password = hashPassword;
        const newUser = this.userRepogistry.create(registerAuthDto);
        if (!userData) userData = await this.userRepogistry.save(newUser);

        await this.userRoleRepogistry.save(
          this.userRoleRepogistry.create({
            user: { id: userData.id },
            role: { id: roleId },
          }),
        );

        return { status: true, message: 'User Registered ' };
      } else {
        throw new HttpException('User already exist', HttpStatus.CONFLICT); //409
      }
    } catch (error) {
      throw new HttpException(
        error?.message || 'Internal Server Error',
        error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async userLogin(loginAuthDto: LoginAuthDto): Promise<LoginResponseDto> {
    const { email, password, roleId } = loginAuthDto;
    try {
      // cheking user exist or not
      const userData = await this.userRepogistry.findOne({
        where: { email: email },
      });

      //cheking for role
      const userRole = await this.userRoleRepogistry.findOne({
        where: { user: { id: userData?.id }, role: { id: roleId } },
      });

      if (userData && userRole) {
        const isPasswordMatch: boolean = await comparePassword(
          password,
          userData.password,
        );

        if (!isPasswordMatch)
          throw new HttpException(
            'Incorrect user or password ',
            HttpStatus.BAD_REQUEST,
          ); //400
        // succefully login
        const role = await this.roleRepogistry.findOne({
          select: { name: true },
          where: { id: roleId },
        });

        // generating access and refresh token
        const payload = { userId: userData.id, roleName: role?.name };
        const { accessToken, refreshToken } =
          JwtHelper.generateAccessAndRefreshToken(payload);

        return {
          status: true,
          message: 'User loggedIn...',
          roleName: role?.name,
          accessToken,
          refreshToken,
        };
      } else {
        throw new HttpException('User does not exist ', HttpStatus.BAD_REQUEST); //400
      }
    } catch (error) {
      throw new HttpException(
        error?.message || 'Internal Server Error',
        error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
