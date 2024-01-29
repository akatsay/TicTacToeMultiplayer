import { patterns } from '../constants/patterns';
import { IPlayer, IGameState } from 'src/types/game.types'; 

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

  handleConnection(client: Socket) {
    client.emit('connected', 'Connected to game server');
    console.log('connected:' + client.id);
  }

  handleDisconnect(client: Socket) {
    client.emit('disconnected', 'Disconnected from game server');
    console.log('disconnected:' + client.id);
  }

  private roomCapacityCounts: Map<string, number> = new Map<string, number>();
  private roomGameState: Map<string, IGameState> = new Map<string, IGameState>();
  private resetTheGame = (room: string) => {

    const currentGameStatus = this.roomGameState.get(room);
    const resetGameState: IGameState = {
      players: [...currentGameStatus.players],
      currentPlayer: currentGameStatus.players[0],
      winner: {nickname: 'unknown', role: 'unknown'},
      boardMap: ['', '', '', '', '', '', '', '', ''],
      gameStatus: 'playing'
    };

    console.log(currentGameStatus);
    if (currentGameStatus) {
      this.roomGameState.set(room, resetGameState);
    }

  }; 

  @SubscribeMessage('join-room')
  handleJoinRoom(
    @MessageBody() clientData: {room: string, player: IPlayer},
      @ConnectedSocket() client: Socket,
  ): void {
    const room = clientData.room;
    const player = clientData.player;
    const currentCount = this.roomCapacityCounts.get(room) || 0;
    const existingGameState = this.roomGameState.get(room);

    if (currentCount < 2) {
      // Allow the client to join the room
      client.join(room);
      this.roomCapacityCounts.set(room, currentCount + 1);

      // first to enter the game should be X and go first
      if (!existingGameState?.players) {
        this.roomGameState.set(room, {...existingGameState, players: [...(existingGameState?.players || []), { ...player, role: 'x' }]});
      } else {
        this.roomGameState.set(room, {...existingGameState,   players: [...(existingGameState?.players || []), { ...player, role: 'o' }]});
      }

      this.resetTheGame(room);
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
    @MessageBody() room: string, player: IPlayer,
      @ConnectedSocket() client: Socket,
  ): void {
    const currentCount = this.roomCapacityCounts.get(room) || 0;
    const existingGameState = this.roomGameState.get(room);

    if (client.rooms.has(room)) {
      client.leave(room);
      this.roomCapacityCounts.set(room, currentCount - 1);
      this.roomGameState.set(room, {...existingGameState, players: existingGameState.players.filter((item) => item.nickname != player.nickname )} );
      this.resetTheGame(room);
      console.log(`${client.id} left room: ${room}`);
    }
  }

  @SubscribeMessage('send-chat-message')
  handleMessage(
    @MessageBody() chatMessage: {room: string, sender: string, message: string, dateStamp: number},
      @ConnectedSocket() client: Socket,
  ): void {
    console.log(chatMessage.sender + ' says: ' + chatMessage + ' to room: ' + chatMessage.room );
    client.to(chatMessage.room).emit('receive-chat-message', chatMessage);
  }

  @SubscribeMessage('make-move')
  handleMakeMove(
    @MessageBody() moveData: { room: string; index: number },
      @ConnectedSocket() client: Socket,
  ): void {
    const room = moveData.room;
    const moveIndex = moveData.index;
    const existingGameState = this.roomGameState.get(room);

    if (!existingGameState) {
      console.log(`No existing game state for room: ${room}`);
      return;
    }

    const currentPlayer = existingGameState.currentPlayer;
    const otherPlayer = existingGameState.players.find((player) => player.nickname !== currentPlayer.nickname);

    const updatedBoardMap = existingGameState.boardMap.map((val, idx) => {
      if (idx === moveIndex && val === '') {
        return currentPlayer.role;
      }

      return val;
    });

    // Check for tie
    if (updatedBoardMap.every((square) => square !== '')) {
      const updatedGameState: IGameState = {
        ...existingGameState,
        winner: { nickname: 'No one', role: 'No one' },
        gameStatus: 'tie',
        boardMap: updatedBoardMap,
      };
      this.roomGameState.set(room, updatedGameState);
    } else {
      const updatedGameState: IGameState = {
        ...existingGameState,
        currentPlayer: otherPlayer,
        boardMap: updatedBoardMap,
      };
      this.roomGameState.set(room, updatedGameState);
    }
    
    // Check for win
    patterns.forEach((currPattern) => {
      const potentialWinner = updatedBoardMap[currPattern[0]];
      if (potentialWinner === '') return;

      let foundWinningPattern = true;
      currPattern.forEach((i) => {
        if (updatedBoardMap[i] !== potentialWinner) {
          foundWinningPattern = false;
        }
      });

      if (foundWinningPattern) {
        console.log('Winning Pattern Found!');
        const updatedGameState: IGameState = {
          ...existingGameState,
          boardMap: updatedBoardMap,
          winner: currentPlayer,
          gameStatus: 'won'
        };
        this.roomGameState.set(room, updatedGameState);
      }
    });

    // Broadcast the updated game state to all players in the room
    this.server.to(room).emit('update-game-state', this.roomGameState.get(room));
  }

}