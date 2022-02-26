import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer, WsException } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io';
import { ChatService } from "./chat.service";

@WebSocketGateway({
    cors: {
        origin: '*',
    }
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {

    constructor(private chatService: ChatService) { }

    @WebSocketServer()
    server: Server;

    handleConnection(client: Socket, ...args: any[]) {
    }

    handleDisconnect(client: Socket) {
        this.chatService.handleLeave(client.id);
    }

    @SubscribeMessage('JOIN')
    async handleJoin(
        @MessageBody() data: { name: string },
        @ConnectedSocket() client: Socket,
    ) {
        const user_agent = client.handshake.headers["user-agent"];
        const IP = client.handshake.address;
        try {
            await this.chatService.handleJoin({ id: client.id, name: data.name, user_agent, IP });
            client.join('GENERAL');
            client.emit('ADMIN_MESSAGE', { type: 'JOINED_SUCCESSFULLY', message: `welcome ${data.name}`, data: { name: data.name, id: client.id } })
            client.broadcast.to('GENERAL').emit('ADMIN_MESSAGE', { type: 'NEW_MEMBER_JOINED', message: `${data.name} joined to the channel`, data: { name: data.name, id: client.id } })

        } catch (error) {
            console.log(error)
        }
    }

    @SubscribeMessage('message')
    async handleMessage(
        @MessageBody() data: { message: string },
        @ConnectedSocket() client: Socket,
    ) {
        const message = await this.chatService.handleAddMessage(data, client.id);
        // TODO: remove users data from message
        this.server.emit('message', message);
    }

    @SubscribeMessage('LEAVE')
    handleLogOut(): void {
        console.log('leave');
    }
}