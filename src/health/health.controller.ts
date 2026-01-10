// health.controller.ts
import { Controller, Get, ServiceUnavailableException } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Controller('health')
export class HealthController {
  constructor(private readonly dataSource: DataSource) {}

  @Get()
  async checkHealth() {
    try {
      await this.dataSource.query('SELECT 1');

      return {
        status: 'ok',
        database: 'postgres',
        serverTime: new Date().toISOString(),
      };
    } catch (error) {
      throw new ServiceUnavailableException({
        status: 'error',
        database: 'postgres',
      });
    }
  }
}
