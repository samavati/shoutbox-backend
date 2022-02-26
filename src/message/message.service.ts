import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { Message } from './message.entity';

@Injectable()
export class MessagesService {
    constructor(
        @InjectRepository(Message)
        private messagesRepository: Repository<Message>,
        private usersService: UsersService
    ) { }

    async add(message: { text: string, user_id: string }): Promise<Message> {

        const user = await this.usersService.findOne(message.user_id);
        return this.messagesRepository.save({ message: message.text, user });
    }

    findAll(): Promise<Message[]> {
        return this.messagesRepository.find();
    }

    findOne(id: string): Promise<Message> {
        return this.messagesRepository.findOne(id);
    }

    async remove(id: string): Promise<void> {
        await this.messagesRepository.delete(id);
    }
}