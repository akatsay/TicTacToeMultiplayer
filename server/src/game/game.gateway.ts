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
    client.emit('connected', 'Connected to game server');
    console.log('connected:' + client.id);
  }

  handleDisconnect(client: any) {
    client.emit('disconnected', 'Disconnected from game server');
    console.log('disconnected:' + client.id);
  }

  private roomCounts: Map<string, number> = new Map<string, number>();

  @SubscribeMessage('join-room')
  handleJoinRoom(
    @MessageBody() room: string,
      @ConnectedSocket() client: Socket,
  ): void {
    const currentCount = this.roomCounts.get(room) || 0;

    if (currentCount < 2) {
      // Allow the client to join the room
      this.server.socketsJoin(room);
      this.roomCounts.set(room, currentCount + 1);
      client.emit('join-room-success', room);
      console.log(`${client.id} joined room: ${room}`);
    } else {
      // Reject the request since the room is already full
      client.emit('room-full', room);
      console.log(`${client.id} attempted to join full room: ${room}`);
    }
  }

  @SubscribeMessage('leave-room')
  handleLeaveRoom(
    @MessageBody() room: string,
      @ConnectedSocket() client: Socket,
  ): void {
    const currentCount = this.roomCounts.get(room) || 0;
    this.server.socketsLeave(room);
    this.roomCounts.set(room, currentCount - 1);
    console.log(`${client.id} left room: ${room}`);
  }
  @SubscribeMessage('send-chat-message')
  handleMessage(
    @MessageBody() chatMessage: string,
      @ConnectedSocket() client: Socket,
  ): void {
    client.broadcast.emit('receive-chat-message', chatMessage);
  }
}
