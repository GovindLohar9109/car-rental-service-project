import { HttpException, Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpStatus } from '@nestjs/common';
import { PaginationDto } from '../common/dto/pagination.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { plainToInstance } from 'class-transformer';
import { generateHashPassword } from '../auth/helpers/hashing.helper';
import { UpdateUserAddressDto } from './dto/update-user-address.dto';
import { CreateUserAddressDto } from './dto/user-address.dto';
import { Address } from './entities/address.entity';
import { UserAddress } from './entities/user-address.entity';
import { UpdateCarDto } from '../cars/dto/update-car.dto';
import { Car } from '../cars/entities/car.entity';
import { CreateCarDto } from '../cars/dto/create-car.dto';

@Injectable()
export class UserService {
  userRepository: any;
  constructor(
    @InjectRepository(User) // this will only work when add entity into  typeOrmModule.forFeature([User])
    private readonly userRepogistry: Repository<User>,
    @InjectRepository(UserAddress)
    private readonly userAddressRepository: Repository<UserAddress>,
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
    @InjectRepository(Car)
    private readonly carRepository: Repository<Car>,
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

      // doing serialization
      const data = users.map((user) => {
        const role = user.userRoles?.[0]?.role;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          roleName: role?.name,
        };
      });

      // in which find() always use left join to perfome other joins we need to use QueryBuilder
      // typeorm automatically do join
      const totalPages = Math.ceil(totalRecords / limit);
      return {
        status: true,
        data,
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

      // serilizing data here
      const data = plainToInstance(UserResponseDto, userData, {
        excludeExtraneousValues: true,
      });

      return {
        status: true,
        data,
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
      if (updateUserDto?.password) {
        updateUserDto.password = generateHashPassword(updateUserDto.password);
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
      return { status: true, message: 'User deleted...' };
    } catch (error) {
      throw new HttpException(
        error?.message || 'Internal Server Error',
        error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async addUserAddress(
    userId: number,
    createUserAddressDto: CreateUserAddressDto,
  ) {
    try {
      const addressData: object = {
        addressLine: createUserAddressDto.addressLine,
        country: { id: createUserAddressDto.countryId },
        state: { id: createUserAddressDto.stateId },
        city: { id: createUserAddressDto.cityId },
        zip: createUserAddressDto.zip,
      };

      //adding inside addresses table
      const newUserAddress = this.addressRepository.create(addressData);
      const newAddress = await this.addressRepository.save(newUserAddress);

      // adding inside user_address table

      await this.userAddressRepository.save(
        this.userAddressRepository.create({
          address: { id: newAddress.id },
          user: { id: userId },
          tag: createUserAddressDto.tag,
        }),
      );

      return { status: true, message: 'User address added...' };
    } catch (error) {
      throw new HttpException(
        error?.message || 'Internal Server Error',
        error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getUserAllAddresses(userId: number, query: PaginationDto) {
    const { page, limit } = query;

    try {
      const skipRows = (page - 1) * limit;

      let sqlQuery = `
        select a.address_line,c."name" as country_name ,
        s."name" as state_name,city."name" as city_name from users u
        inner join user_address ua 
        on ua.user_id =u.id 
        inner join addresses a 
        on a.id=ua.address_id 
        inner join countries c 
        on a.country_id =c.id 
        inner join states s 
        on a.state_id =s.id
        inner join cities city 
        on a.city_id =city.id
        where u.id=$1 AND ua.deleted_at is null
        limit $2 offset $3;`;

      const userAddresses = await this.userRepository.query(sqlQuery, [
        userId,
        limit,
        skipRows,
      ]);

      sqlQuery = `
        select count(a.id) 
        from users u
        inner join user_address ua 
        on ua.user_id =u.id 
        inner join addresses a 
        on a.id=ua.address_id 
        inner join countries c 
        on a.country_id =c.id 
        inner join states s 
        on a.state_id =s.id
        inner join cities city 
        on a.city_id =city.id
        where u.id=$1 AND ua.deleted_at is null ;`;

      const userData = await this.userRepository.findOne({
        where: { id: userId },
        select: { id: true, email: true, name: true, phone: true },
      });

      const totalRecords = await this.userRepository.query(sqlQuery, [userId]);

      const totalPages = Math.ceil(totalRecords[0]?.count / limit);
      return {
        status: true,
        data: { user: userData, userAddresses: userAddresses },
        pagination: { page, limit, totalPages },
      };
    } catch (error) {
      throw new HttpException(
        error?.message || 'Internal Server Error',
        error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async getUserAddress(userId: number, addressId: number) {
    try {
      let sqlQuery = `
        select a.address_line,c."name" as country_name ,
        s."name" as state_name,city."name" as city_name
        from user_address ua 
        inner join addresses a 
        on a.id=ua.address_id 
        inner join countries c 
        on a.country_id =c.id 
        inner join states s 
        on a.state_id =s.id
        inner join cities city 
        on a.city_id =city.id
        where a.id=$1 AND ua.deleted_at is null`;
      const userData = await this.userRepository.findOne({
        where: { id: userId },
        select: { id: true, name: true, email: true, phone: true },
      });
      const userAddress = await this.addressRepository.query(sqlQuery, [
        addressId,
      ]);

      // serilizing data here

      return {
        status: true,
        data: { user: userData, userAddress: userAddress },
      };
    } catch (error) {
      throw new HttpException(
        error?.message || 'Internal Server Error',
        error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async updateUserAddress(
    addressId: number,
    updateUserAddressDto: UpdateUserAddressDto,
  ) {
    try {
      await this.addressRepository.update(
        { id: addressId },
        { ...updateUserAddressDto },
      );
      return { status: true, message: 'User address updated...' };
    } catch (error) {
      throw new HttpException(
        error?.message || 'Internal Server Error',
        error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async removeUserAddress(userId: number, addressId: number) {
    try {
      await this.userAddressRepository.softDelete({
        user: { id: userId },
        address: { id: addressId },
      });
      return { status: true, message: 'User deleted...' };
    } catch (error) {
      throw new HttpException(
        error?.message || 'Internal Server Error',
        error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // -----------------------------CAR SERVICES METHODS-----------------------

  async addCar(userId: number, createCarDto: CreateCarDto) {
    try {
      const carData: object = {
        type: createCarDto.type,
        model: createCarDto.model,
        color: createCarDto.color,
        totalSeat: createCarDto.totalSeat,
        imageUrl: createCarDto.imageUrl,
        price: createCarDto.price,
        user: { id: userId },
        insuranceExpirationDate: createCarDto.insuranceExpirationDate,
      };
      const newCar = this.carRepository.create(carData);

      await this.carRepository.save(newCar);
      return { status: true, message: 'Car added...' };
    } catch (error) {
      throw new HttpException(
        error?.message || 'Internal Server Error',
        error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async getUserAllCars(userId: number, query: PaginationDto) {
    const { page, limit } = query;

    try {
      const skipRows = (page - 1) * limit;

      const [cars, totalRecords] = await this.carRepository.findAndCount({
        where: { user: { id: userId } },
        select: {
          deletedAt: false,
          user: { name: true, email: true },
        },
        take: limit,
        skip: skipRows,
      });

      const totalPages = Math.ceil(totalRecords / limit);
      return {
        status: true,
        data: cars,
        pagination: { page, limit, totalPages },
      };
    } catch (error) {
      throw new HttpException(
        error?.message || 'Internal Server Error',
        error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async getCarDetails(carId: number) {
    try {
      const car = await this.carRepository.findOne({
        where: { id: carId },
      });

      return {
        status: true,
        data: car,
      };
    } catch (error) {
      throw new HttpException(
        error?.message || 'Internal Server Error',
        error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async updateCar(carId: number, updateCarDto: UpdateCarDto) {
    try {
      await this.carRepository.update({ id: carId }, { ...updateCarDto });
      return { status: true, message: 'Car  updated...' };
    } catch (error) {
      throw new HttpException(
        error?.message || 'Internal Server Error',
        error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async removeCar(carId: number) {
    try {
      await this.carRepository.softDelete(carId);
      return { status: true, message: 'Car deleted...' };
    } catch (error) {
      throw new HttpException(
        error?.message || 'Internal Server Error',
        error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
