import { Controller, Get } from '@nestjs/common';

@Controller('health/api')
export default class HealthController {
  @Get()
  checkHealth() {
    return {
      message: 'Ok',
      serverTime: new Date().toISOString(),
    };
  }
}
