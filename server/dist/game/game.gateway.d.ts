import { Server, Socket } from 'socket.io';
export declare class GameGateway {
    server: Server;
    handleConnection(client: any): void;
    handleDisconnect(client: any): void;
    handleMessage(data: string, client: Socket): void;
}
