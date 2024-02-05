"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameGateway = void 0;
const patterns_1 = require("../constants/patterns");
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
let GameGateway = class GameGateway {
    constructor() {
        this.roomCapacityCounts = new Map();
        this.roomGameState = new Map();
        this.resetTheGame = (room) => {
            try {
                const currentGameStatus = this.roomGameState.get(room);
                const resetGameState = {
                    players: currentGameStatus.players.map((item) => ({
                        ...item,
                        readyToRestart: false,
                    })),
                    currentPlayer: currentGameStatus.players.find((item) => item.nickname !== currentGameStatus.winner?.nickname) || currentGameStatus.players[0],
                    winner: { nickname: 'unknown', role: 'unknown', readyToRestart: false },
                    boardMap: ['', '', '', '', '', '', '', '', ''],
                    gameStatus: 'playing',
                };
                if (currentGameStatus) {
                    this.roomGameState.set(room, resetGameState);
                }
                this.server.to(room).emit('update-game-state', resetGameState);
            }
            catch (error) {
                console.error('Error in resetTheGame:', error);
            }
        };
    }
    handleConnection(client) {
        try {
            client.emit('connected', 'Connected to the game server');
            console.log('connected:' + client.id);
        }
        catch (error) {
            console.error('Error in handleConnection:', error);
        }
    }
    handleDisconnect(client) {
        try {
            client.emit('disconnected', 'Disconnected from the game server');
            console.log('disconnected:' + client.id);
        }
        catch (error) {
            console.error('Error in handleDisconnect:', error);
        }
    }
    handleJoinRoom(clientData, client) {
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
                if (!existingGameState?.players || existingGameState.players[0]?.role === 'o') {
                    this.roomGameState.set(room, {
                        ...existingGameState,
                        players: [...(existingGameState?.players || []), { ...player, role: 'x' }],
                    });
                }
                else {
                    this.roomGameState.set(room, {
                        ...existingGameState,
                        players: [...(existingGameState?.players || []), { ...player, role: 'o' }],
                    });
                }
                this.resetTheGame(room);
                client.emit('join-room-success', room);
                this.server.to(room).emit('update-game-state', this.roomGameState.get(room));
                console.log(`${client.id} joined room: ${room}`);
            }
            else {
                client.emit('room-full', room);
                console.log(`${client.id} attempted to join full room: ${room}`);
            }
        }
        catch (error) {
            console.error('Error in handleJoinRoom:', error);
        }
    }
    handleLeaveRoom(clientData, client) {
        try {
            const currentCount = this.roomCapacityCounts.get(clientData.room) || 0;
            const existingGameState = this.roomGameState.get(clientData.room);
            if (client.rooms.has(clientData.room)) {
                client.leave(clientData.room);
                this.roomCapacityCounts.set(clientData.room, currentCount - 1);
                this.roomGameState.set(clientData.room, {
                    ...existingGameState,
                    players: existingGameState.players.filter((item) => item.nickname !== clientData.player.nickname),
                });
                this.resetTheGame(clientData.room);
                console.log(`${client.id} left room: ${clientData.room}`);
            }
        }
        catch (error) {
            console.error('Error in handleLeaveRoom:', error);
        }
    }
    handleMessage(chatMessage, client) {
        try {
            console.log(chatMessage.sender + ' says: ' + chatMessage + ' to room: ' + chatMessage.room);
            client.to(chatMessage.room).emit('receive-chat-message', chatMessage);
        }
        catch (error) {
            console.error('Error in handleMessage:', error);
        }
    }
    handleMakeMove(moveData, client) {
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
                const updatedGameState = {
                    ...existingGameState,
                    winner: { nickname: 'No one', role: 'No one', readyToRestart: false },
                    gameStatus: 'tie',
                    boardMap: updatedBoardMap,
                };
                this.roomGameState.set(room, updatedGameState);
            }
            else {
                const updatedGameState = {
                    ...existingGameState,
                    currentPlayer: otherPlayer,
                    boardMap: updatedBoardMap,
                };
                this.roomGameState.set(room, updatedGameState);
            }
            patterns_1.patterns.forEach((currPattern) => {
                const potentialWinner = updatedBoardMap[currPattern[0]];
                if (potentialWinner === '')
                    return;
                let foundWinningPattern = true;
                currPattern.forEach((i) => {
                    if (updatedBoardMap[i] !== potentialWinner) {
                        foundWinningPattern = false;
                    }
                });
                if (foundWinningPattern) {
                    console.log('Winning Pattern Found!');
                    const updatedGameState = {
                        ...existingGameState,
                        boardMap: updatedBoardMap,
                        winner: currentPlayer,
                        gameStatus: 'won',
                    };
                    this.roomGameState.set(room, updatedGameState);
                }
            });
            this.server.to(room).emit('update-game-state', this.roomGameState.get(room));
        }
        catch (error) {
            console.error('Error in handleMakeMove:', error);
        }
    }
    handleRestartGame(moveData, client) {
        try {
            const currentRoomGameState = this.roomGameState.get(moveData.room);
            const updatedGameState = {
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
        }
        catch (error) {
            console.error('Error in handleRestartGame:', error);
        }
    }
};
exports.GameGateway = GameGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], GameGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('join-room'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], GameGateway.prototype, "handleJoinRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('leave-room'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], GameGateway.prototype, "handleLeaveRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('send-chat-message'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], GameGateway.prototype, "handleMessage", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('make-move'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], GameGateway.prototype, "handleMakeMove", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('restart-game'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], GameGateway.prototype, "handleRestartGame", null);
exports.GameGateway = GameGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({ cors: true })
], GameGateway);
//# sourceMappingURL=game.gateway.js.map