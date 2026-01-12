import { HttpException, Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpStatus } from '@nestjs/common';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) // this will only work when add entity into  typeOrmModule.forFeature([User])
    private readonly userRepogistry: Repository<User>,
  ) {}

  async getAllUsers(query: PaginationDto) {
    const { page, limit } = query;

    try {
      const skipRows = (page - 1) * limit;
      const [users, totalRecords] = await this.userRepogistry
        .createQueryBuilder('user')
        .leftJoin('user.userRoles', 'ur')
        .leftJoin('ur.role', 'role')
        .select([
          'user.id',
          'user.name',
          'user.email',
          'user.phone',
          'ur.id',
          'role.id',
          'role.name',
        ])
        .skip(skipRows)
        .take(limit)
        .getManyAndCount();

      // in which find() always use left join to perfome other joins we need to use QueryBuilder
      // typeorm automatically do join
      const totalPages = Math.ceil(totalRecords / limit);
      return {
        status: true,
        data: users,
        pagination: { page, limit, totalPages },
      };
    } catch (error) {
      throw new HttpException(
        error?.message || 'Internal Server Error',
        error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getUser(userId: number) {
    try {
      const userData = await this.userRepogistry.findOne({
        where: { id: userId },
        relations: {
          userRoles: { role: true },
        },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          userRoles: { role: { id: true, name: true } },
        },
      });

      return {
        status: true,
        data: userData,
      };
    } catch (error) {
      throw new HttpException(
        error?.message || 'Internal Server Error',
        error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async updateUser(userId: number, updateUserDto: UpdateUserDto) {
    try {
      const userData = await this.userRepogistry.findOneBy({
        id: userId,
      });
      if (!userData) {
        throw new HttpException(
          'User does not exist...',
          HttpStatus.BAD_REQUEST,
        );
      }
      await this.userRepogistry.update({ id: userId }, { ...updateUserDto });
      return { status: true, message: 'User updated...' };
    } catch (error) {
      throw new HttpException(
        error?.message || 'Internal Server Error',
        error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async removeUser(userId: number) {
    try {
      await this.userRepogistry.softDelete(userId);
    } catch (error) {
      throw new HttpException(
        error?.message || 'Internal Server Error',
        error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
