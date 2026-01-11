import {
  Controller,
  Get,
  HttpCode,
  HttpException,
  Query,
} from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { PaginationDto } from '../common/dto/pagination.dto';

@Controller('feedbacks')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}
  @Get()
  @HttpCode(200)
  async getAllFeedbacks(@Query() query: PaginationDto) {
    try {
      const result = await this.feedbackService.getAllFeedbacks(query);

      return result;
    } catch (err) {
      throw new HttpException(err.message, err.status);
    }
  }
}
