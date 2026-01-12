import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDto } from '../common/dto/pagination.dto';
import { Repository } from 'typeorm';
import { Feedback } from './entities/feedback.entity';

@Injectable()
export class FeedbackService {
  constructor(
    @InjectRepository(Feedback)
    private readonly feedbackRepository: Repository<Feedback>,
  ) {}
  async getAllFeedbacks(paginationDto: PaginationDto) {
    let { page, limit } = paginationDto;

    try {
      page = page ? page : 1;
      limit = limit ? limit : 10;
      const skipRows = (page - 1) * limit;

      const [feedbacks, totalRecords] = await this.feedbackRepository
        .createQueryBuilder('feedback')
        .innerJoinAndSelect('feedback.booking', 'booking')
        .innerJoinAndSelect('feedback.user', 'user')
        .limit(limit)
        .skip(skipRows)
        .getManyAndCount();

      const totalPages = Math.ceil(totalRecords / limit);
      const result = {
        status: true,
        data: feedbacks,
        totalBookings: totalRecords,
        pagination: { page, limit, totalPages },
      };

      return result;
    } catch (error) {
      throw new HttpException(
        error?.message || 'Internal Server Error',
        error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
