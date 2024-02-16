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

@WebSocketGateway({ cors: true, secure: true })
export class GameGateway {
  @WebSocketServer()
    server: Server;

  handleConnection(client: Socket) {
    try {
      client.emit('connected', 'Connected to the game server');
      console.log('connected:' + client.id);
    } catch (error) {
      console.error('Error in handleConnection:', error);
    }
  }

  handleDisconnect(client: Socket) {
    try {
      client.emit('disconnected', 'Disconnected from the game server');
      console.log('disconnected:' + client.id);
    } catch (error) {
      console.error('Error in handleDisconnect:', error);
    }
  }

  private roomCapacityCounts: Map<string, number> = new Map<string, number>();
  private roomGameState: Map<string, IGameState> = new Map<string, IGameState>();

  private resetTheGame = (room: string) => {
    try {
      const currentGameStatus = this.roomGameState.get(room);

      const resetGameState: IGameState = {
        players: currentGameStatus.players.map((item) => ({
          ...item,
          readyToRestart: false,
        })),
        currentPlayer:
          currentGameStatus.players.find(
            (item) => item.nickname !== currentGameStatus.winner?.nickname
          ) || currentGameStatus.players[0],
        winner: { nickname: 'unknown', role: 'unknown', readyToRestart: false },
        boardMap: ['', '', '', '', '', '', '', '', ''],
        gameStatus: 'playing',
      };

      if (currentGameStatus) {
        this.roomGameState.set(room, resetGameState);
      }

      this.server.to(room).emit('update-game-state', resetGameState);
    } catch (error) {
      console.error('Error in resetTheGame:', error);
    }
  };

  @SubscribeMessage('join-room')
  handleJoinRoom(
    @MessageBody() clientData: { room: string; player: IPlayer },
      @ConnectedSocket() client: Socket
  ): void {
    try {
      const room = clientData.room;
      const player = clientData.player;
      const currentCount = this.roomCapacityCounts.get(room) || 0;
      const existingGameState = this.roomGameState.get(room);

      if (existingGameState) {
        if (existingGameState.players?.find((item) => item.nickname === player.nickname)) {
          client.emit('room-full', room);
          console.log(`${client.id} is already in the game and trying to join`);
          return;
        }
      }

      if (currentCount < 2) {
        client.join(room);
        this.roomCapacityCounts.set(room, currentCount + 1);
        // if this is the first player to join this game or the player who is already in the room plays 'o', assign the newcomer to 'x'
        if (!existingGameState?.players || existingGameState.players[0]?.role === 'o') {
          this.roomGameState.set(room, {
            ...existingGameState,
            players: [...(existingGameState?.players || []), { ...player, role: 'x' }],
          });
        } else {
          this.roomGameState.set(room, {
            ...existingGameState,
            players: [...(existingGameState?.players || []), { ...player, role: 'o' }],
          });
        }

        this.resetTheGame(room);
        client.emit('join-room-success', room);
        this.server.to(room).emit('update-game-state', this.roomGameState.get(room));
        console.log(`${client.id} joined room: ${room}`);
      } else {
        client.emit('room-full', room);
        console.log(`${client.id} attempted to join full room: ${room}`);
      }
    } catch (error) {
      console.error('Error in handleJoinRoom:', error);
    }
  }

  @SubscribeMessage('leave-room')
  handleLeaveRoom(
    @MessageBody() clientData: { room: string; player: IPlayer },
      @ConnectedSocket() client: Socket
  ): void {
    try {
      const currentCount = this.roomCapacityCounts.get(clientData.room) || 0;
      const existingGameState = this.roomGameState.get(clientData.room);

      if (client.rooms.has(clientData.room)) {
        client.leave(clientData.room);
        this.roomCapacityCounts.set(clientData.room, currentCount - 1);
        this.roomGameState.set(clientData.room, {
          ...existingGameState,
          players: existingGameState.players.filter(
            (item) => item.nickname !== clientData.player.nickname
          ),
        });
        this.resetTheGame(clientData.room);
        console.log(`${client.id} left room: ${clientData.room}`);
      }
    } catch (error) {
      console.error('Error in handleLeaveRoom:', error);
    }
  }

  @SubscribeMessage('send-chat-message')
  handleMessage(
    @MessageBody() chatMessage: { room: string; sender: string; message: string; dateStamp: number },
      @ConnectedSocket() client: Socket
  ): void {
    try {
      console.log(chatMessage.sender + ' says: ' + chatMessage.message + ' to room: ' + chatMessage.room);
      this.server.to(chatMessage.room).emit('receive-chat-message', chatMessage);
    } catch (error) {
      console.error('Error in handleMessage:', error);
    }
  }

  @SubscribeMessage('make-move')
  handleMakeMove(
    @MessageBody() moveData: { room: string; index: number },
      @ConnectedSocket() client: Socket
  ): void {
    try {
      const room = moveData.room;
      const moveIndex = moveData.index;
      const existingGameState = this.roomGameState.get(room);

      if (this.roomCapacityCounts.get(room) < 2) {
        console.log(`Not enough players in room: ${room}`);
        return;
      }

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

      if (updatedBoardMap.every((square) => square !== '')) {
        const updatedGameState: IGameState = {
          ...existingGameState,
          winner: { nickname: 'No one', role: 'No one', readyToRestart: false },
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
            gameStatus: 'won',
          };
          this.roomGameState.set(room, updatedGameState);
        }
      });

      this.server.to(room).emit('update-game-state', this.roomGameState.get(room));
    } catch (error) {
      console.error('Error in handleMakeMove:', error);
    }
  }

  @SubscribeMessage('restart-game')
  handleRestartGame(
    @MessageBody() moveData: { room: string; nickname: string },
      @ConnectedSocket() client: Socket
  ): void {
    try {
      const currentRoomGameState = this.roomGameState.get(moveData.room);

      const updatedGameState: IGameState = {
        ...currentRoomGameState,
        players: currentRoomGameState.players.map((item) => {
          console.log('item.nickname ' + item.nickname);
          console.log('moveData.player.nickname ' + moveData.nickname);
          if (item.nickname === moveData.nickname) {
            return {
              ...item,
              readyToRestart: true,
            };
          }
          return item;
        }),
      };

      this.roomGameState.set(moveData.room, updatedGameState);
      this.server.to(moveData.room).emit('update-game-state', updatedGameState);

      if (updatedGameState.players.every((item) => item.readyToRestart)) {
        this.resetTheGame(moveData.room);
      }
    } catch (error) {
      console.error('Error in handleRestartGame:', error);
    }
  }

  // refresh the whole server every 4 hours
  interval = setInterval(() => {
    this.roomGameState.clear();
    this.roomCapacityCounts.clear();
    this.server.emit('game-server-restart', 'Game server has been restarted');
  }, 14400000);

}