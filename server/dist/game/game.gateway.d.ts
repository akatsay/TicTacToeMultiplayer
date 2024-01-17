import { Server, Socket } from 'socket.io';
export declare class GameGateway {
    server: Server;
    handleConnection(client: any): void;
    handleDisconnect(client: any): void;
    private roomCounts;
    handleJoinRoom(room: string, client: Socket): void;
    handleLeaveRoom(room: string, client: Socket): void;
    handleMessage(chatMessage: {
        sender: string;
        message: string;
        dateStamp: number;
    }, client: Socket): void;
}
