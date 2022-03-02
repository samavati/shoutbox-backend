import { Controller, Get, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express-serve-static-core';
import { join } from 'path';
import { existsSync } from 'fs';
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  serverClient(@Res() res: Response) {
    const clientFilePath = join(__dirname, '..', 'client');
    if (existsSync(clientFilePath)) {
      return res.sendFile(clientFilePath);
    }
    return res.send(`
    <div>
    <h1>Welcome to shoutbox</h1>
    <p>You can use your own client application dev server or build it under client folder</p>
    </div>
    `)
  }

  @Get('config')
  getConfig() {
    return this.appService.getConfig();
  }
}
