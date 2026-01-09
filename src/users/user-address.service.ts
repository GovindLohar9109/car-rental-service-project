import { HttpException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpStatus } from '@nestjs/common';
import { CreateUserAddressDto } from './dto/user-address.dto';
import { UserAddress } from './entities/user-address.entity';
import { Address } from './entities/address.entity';
import { User } from './entities/user.entity';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { UpdateUserAddressDto } from './dto/update-user-address.dto';

@Injectable()
export class UserAddressService {
  constructor(
    @InjectRepository(UserAddress) // this will only work when add entity into  typeOrmModule.forFeature([User])
    private readonly userAddressRepository: Repository<UserAddress>,
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

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

      const newAddress = await this.addressRepository.save(addressData);

      // adding inside user_address table

      await this.userAddressRepository.save({
        address: { id: newAddress.id },
        user: { id: userId },
        tag: createUserAddressDto.tag,
      });

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
}
