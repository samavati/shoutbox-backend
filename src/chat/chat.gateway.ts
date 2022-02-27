import { ConnectedSocket, MessageBody, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer, WsException } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io';
import { ChatService } from "./chat.service";
import { AdminMessageEvent, MessageEvent } from "./ChatEvent.enum";
@WebSocketGateway({
    cors: {
        origin: '*',
    }
})
export class ChatGateway implements OnGatewayDisconnect {

    constructor(private chatService: ChatService) { }

    room = "GENERAL"

    @WebSocketServer()
    server: Server;

    handleDisconnect(client: Socket) {
        this.server.to(this.room).emit(MessageEvent.ADMIN_MESSAGE, { type: AdminMessageEvent.LEAVED_SUCCESSFULLY, message: '', data: { id: client.id } });
        this.chatService.handleLeave(client.id);
    }

    @SubscribeMessage('JOIN')
    async announceJoin(
        @MessageBody() data: { name: string },
        @ConnectedSocket() client: Socket,
    ) {
        client.join(this.room);
        client.to(this.room).emit(MessageEvent.ADMIN_MESSAGE, { type: AdminMessageEvent.JOINED_SUCCESSFULLY, message: `welcome ${data.name}`, data: { name: data.name, id: client.id } })
        client.broadcast.to(this.room).emit(MessageEvent.ADMIN_MESSAGE, { type: AdminMessageEvent.NEW_MEMBER_JOINED, message: `${data.name} joined to the channel`, data: { name: data.name, id: client.id } })
    }

    @SubscribeMessage(MessageEvent.USER_MESSAGE)
    async handleMessage(
        @MessageBody() data: { message: string },
        @ConnectedSocket() client: Socket,
    ) {
        const message = await this.chatService.handleAddMessage(data, client.id);
        // TODO: remove users data from message
        this.server.to(this.room).emit(MessageEvent.USER_MESSAGE, message);
    }
}