import { Injectable } from '@nestjs/common';
import { LIMIT_SAVE_MESSAGE } from './config';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Welcome to my shoutbox backend';
  }

  getConfig() {
    return {
      show_limit: LIMIT_SAVE_MESSAGE
    }
  }
}
