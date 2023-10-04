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
    this.server.emit('connected', 'Connected to game server');
    console.log('connected:' + client.id);
  }

  handleDisconnect(client: any) {
    this.server.emit('disconnected', 'Disconnected from game server');
    console.log('disconnected:' + client.id);
  }

  // @SubscribeMessage('join-room')
  // handleMessage(
  //   @MessageBody() room: string,
  //     @ConnectedSocket() client: Socket,
  // ): void {
  //   this.server.socketsJoin(room);
  // }
  @SubscribeMessage('send-chat-message')
  handleMessage(
    @MessageBody() chatMessage: string,
      @ConnectedSocket() client: Socket,
  ): void {
    this.server.emit('receive-chat-message', `hello from ${client.id}, message is ${chatMessage}`);
  }
}
