import { Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { LIMIT_SAVE_MESSAGE } from 'src/config';
import { Message } from 'src/message/message.entity';
import { MessagesService } from 'src/message/message.service';
import { User } from 'src/user/user.entity';
import { UsersService } from 'src/user/user.service';

@Injectable()
export class ChatService {
    constructor(
        private usersService: UsersService,
        private messagesService: MessagesService
    ) { }

    async handleJoin(user: Omit<User, 'messages'>) {
        const presentUser = await this.usersService.findByName(user.name);
        if (!presentUser) {
            return this.usersService.add(user);
        }

        throw new WsException('This name is taken.')
    }

    async handleLeave(id: string) {
        await this.usersService.remove(id)
    }

    async handleAddMessage(data: { message: string }, userId: string): Promise<Message> {
        const count = await this.messagesService.count();
        let diff = (count + 1) - LIMIT_SAVE_MESSAGE;

        while (diff > 0) {
            await this.messagesService.shift();
            diff--;
        }

        const message = await this.messagesService.add({ text: data.message, user_id: userId });
        return message
    }
}