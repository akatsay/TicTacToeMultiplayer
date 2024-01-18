import { Server, Socket } from 'socket.io';
export declare class GameGateway {
    server: Server;
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    private roomCounts;
    handleJoinRoom(room: string, client: Socket): void;
    handleLeaveRoom(room: string, client: Socket): void;
    handleMessage(chatMessage: {
        room: string;
        sender: string;
        message: string;
        dateStamp: number;
    }, client: Socket): void;
}
