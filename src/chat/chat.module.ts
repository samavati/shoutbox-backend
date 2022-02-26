import { Module } from '@nestjs/common';
import { MessageModule } from 'src/message/message.module';
import { UserModule } from 'src/user/user.module';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';

@Module({
  imports: [UserModule, MessageModule],
  providers: [ChatGateway, ChatService],
})
export class ChatModule { }