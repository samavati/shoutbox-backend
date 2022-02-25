import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from 'socket.io';

@WebSocketGateway({
    cors: {
        origin: '*',
    }
})
export class ChatGateway {

    @WebSocketServer()
    server: Server;

    @SubscribeMessage('message')
    handleMessage(
        @MessageBody() data: string,
        @ConnectedSocket() client,
    ): void {
        console.log(client);
        this.server.emit('message', data);
    }

    @SubscribeMessage('LOGOUT')
    handleLogOut(): void {
        console.log('logout');
    }
}