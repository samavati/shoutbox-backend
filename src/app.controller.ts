import { Controller, Get, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express-serve-static-core';
import { join } from 'path';
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  serverClient(@Res() res: Response) {
    return res.sendFile(join(__dirname, '..', 'client'));
  }

  @Get('config')
  getConfig() {
    return this.appService.getConfig();
  }
}
