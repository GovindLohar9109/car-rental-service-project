import { Module } from '@nestjs/common';
import { FeedbacksService } from './feedback.service';
import { FeedbacksController } from './feedback.controller';

@Module({
  controllers: [FeedbacksController],
  providers: [FeedbacksService],
})
export class FeedbacksModule {}
