import { PublicEndpoint } from '@libs/commons/decorators/public.decorator';
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @PublicEndpoint()
  getHello() {
    return this.appService.getHello();
  }
}
