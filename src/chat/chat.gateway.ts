import { ConnectedSocket, MessageBody, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer, WsException } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io';
import { UsersService } from "src/user/user.service";
import { v4 as uuidv4 } from 'uuid';
import { ChatService } from "./chat.service";
import { AdminMessageEvent, MessageEvent } from "./ChatEvent.enum";
@WebSocketGateway({
    cors: {
        origin: '*',
    }
})
export class ChatGateway implements OnGatewayDisconnect {

    constructor(private chatService: ChatService, private usersService: UsersService) { }

    room = "GENERAL"

    @WebSocketServer()
    server: Server;

    async handleDisconnect(client: Socket) {
        const user = await this.usersService.findOne(client.id);

        if (user) {
            this.server.to(this.room).emit(MessageEvent.ADMIN_MESSAGE, { type: AdminMessageEvent.LEAVED_SUCCESSFULLY, payload: { id: uuidv4(), message: `${user.name} left the room.`, data: { id: client.id } } });
            this.chatService.handleLeave(client.id);
        }
    }

    @SubscribeMessage('JOIN')
    async announceJoin(
        @MessageBody() data: { name: string },
        @ConnectedSocket() client: Socket,
    ) {
        client.join(this.room);
        client.emit(MessageEvent.ADMIN_MESSAGE, { type: AdminMessageEvent.JOINED_SUCCESSFULLY, payload: { id: uuidv4(), message: `Welcome ${data.name}.`, data: { name: data.name, id: client.id } } })
        client.broadcast.to(this.room).emit(MessageEvent.ADMIN_MESSAGE, { type: AdminMessageEvent.NEW_MEMBER_JOINED, payload: { id: uuidv4(), message: `${data.name} joined to the room.`, data: { name: data.name, id: client.id } } })
    }

    @SubscribeMessage(MessageEvent.USER_MESSAGE)
    async handleMessage(
        @MessageBody() data: { message: string },
        @ConnectedSocket() client: Socket,
    ) {
        const message = await this.chatService.handleAddMessage(data, client.id);
        this.server.to(this.room).emit(MessageEvent.USER_MESSAGE, { ...message, user: { id: message.user.id, name: message.user.name } });
    }
}