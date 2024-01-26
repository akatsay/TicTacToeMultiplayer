import { IPlayer } from 'src/types/game.types';
import { Server, Socket } from 'socket.io';
export declare class GameGateway {
    server: Server;
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    private roomCapacityCounts;
    private roomGameState;
    private resetTheGame;
    handleJoinRoom(clientData: {
        room: string;
        player: IPlayer;
    }, client: Socket): void;
    handleLeaveRoom(room: string, player: IPlayer, client: Socket): void;
    handleMessage(chatMessage: {
        room: string;
        sender: string;
        message: string;
        dateStamp: number;
    }, client: Socket): void;
    handleMakeMove(moveData: {
        room: string;
        index: number;
        currentPlayer: IPlayer;
    }, client: Socket): void;
}
