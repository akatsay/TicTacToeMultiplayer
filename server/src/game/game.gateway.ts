import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: true })
export class GameGateway {
  @WebSocketServer()
    server: Server;

  handleConnection(client: any) {
    this.server.emit('connected', 'client connected');
    console.log('connected:' + client.id);
  }

  handleDisconnect(client: any) {
    this.server.emit('disconnected', 'client disconnected');
    console.log('disconnected:' + client.id);
  }

  @SubscribeMessage('send-chat-message')
  handleMessage(
    @MessageBody() data: string,
      @ConnectedSocket() client: Socket,
  ): void {
    this.server.emit('receive-chat-message', `hello from ${client.id}, message is ${data}`);
  }
}
