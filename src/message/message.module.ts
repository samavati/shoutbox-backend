import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';
import { Message } from './message.entity';
import { MessagesService } from './message.service';

@Module({
  imports: [TypeOrmModule.forFeature([Message]), UserModule],
  providers: [MessagesService],
  exports: [TypeOrmModule, MessagesService]
})
export class MessageModule { }
