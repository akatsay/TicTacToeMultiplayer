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
            const currentGameStatus = this.roomGameState.get(room);
            const resetGameState = {
                players: [...currentGameStatus.players],
                currentPlayer: currentGameStatus.players[0],
                winner: { nickname: 'unknown', role: 'unknown' },
                boardMap: ['', '', '', '', '', '', '', '', ''],
                gameStatus: 'playing'
            };
            if (currentGameStatus) {
                this.roomGameState.set(room, resetGameState);
            }
        };
    }
    handleConnection(client) {
        client.emit('connected', 'Connected to game server');
        console.log('connected:' + client.id);
    }
    handleDisconnect(client) {
        client.emit('disconnected', 'Disconnected from game server');
        console.log('disconnected:' + client.id);
    }
    handleJoinRoom(room, player, client) {
        const currentCount = this.roomCapacityCounts.get(room) || 0;
        const existingGameState = this.roomGameState.get(room);
        if (currentCount < 2) {
            client.join(room);
            this.roomCapacityCounts.set(room, currentCount + 1);
            if (existingGameState?.players?.length < 1) {
                this.roomGameState.set(room, { ...existingGameState, players: [...(existingGameState?.players || []), { ...player, role: 'x' }] });
            }
            else {
                this.roomGameState.set(room, { ...existingGameState, players: [...(existingGameState?.players || []), { ...player, role: 'o' }] });
            }
            this.resetTheGame(room);
            client.emit('join-room-success', room);
            console.log(`${client.id} joined room: ${room}`);
        }
        else {
            client.emit('room-full', room);
            console.log(`${client.id} attempted to join full room: ${room}`);
        }
    }
    handleLeaveRoom(room, player, client) {
        const currentCount = this.roomCapacityCounts.get(room) || 0;
        const existingGameState = this.roomGameState.get(room);
        if (client.rooms.has(room)) {
            client.leave(room);
            this.roomCapacityCounts.set(room, currentCount - 1);
            this.roomGameState.set(room, { ...existingGameState, players: existingGameState.players.filter((item) => item.nickname != player.nickname) });
            this.resetTheGame(room);
            console.log(`${client.id} left room: ${room}`);
        }
    }
    handleMessage(chatMessage, client) {
        console.log(chatMessage.sender + ' says: ' + chatMessage + ' to room: ' + chatMessage.room);
        client.to(chatMessage.room).emit('receive-chat-message', chatMessage);
    }
    handleMakeMove(moveData, client) {
        const room = moveData.room;
        const index = moveData.index;
        const currentPlayer = moveData.currentPlayer;
        const existingGameState = this.roomGameState.get(room);
        if (!existingGameState) {
            console.log(`No existing game state for room: ${room}`);
            return;
        }
        const otherPlayer = this.roomGameState.get(room).players.filter((player) => player.nickname != currentPlayer.nickname);
        const changePlayer = () => {
            const updatedGameState = {
                ...existingGameState,
                currentPlayer: otherPlayer[0]
            };
            this.roomGameState.set(room, updatedGameState);
        };
        const checkWin = () => {
            patterns_1.patterns.forEach((currPattern) => {
                const potentialWinner = existingGameState.boardMap[currPattern[0]];
                if (potentialWinner === '')
                    return;
                let foundWinningPattern = true;
                currPattern.forEach((i) => {
                    if (existingGameState.boardMap[i] !== potentialWinner) {
                        foundWinningPattern = false;
                    }
                });
                if (foundWinningPattern) {
                    const updatedGameState = {
                        ...existingGameState,
                        winner: currentPlayer,
                        gameStatus: 'won'
                    };
                    this.roomGameState.set(room, updatedGameState);
                }
            });
        };
        const checkTie = () => {
            let allSquaresFilled = true;
            existingGameState.boardMap.forEach((square) => {
                if (square === '') {
                    allSquaresFilled = false;
                }
            });
            if (allSquaresFilled) {
                const updatedGameState = {
                    ...existingGameState,
                    winner: { nickname: 'No one', role: 'No one' },
                    gameStatus: 'tie'
                };
                this.roomGameState.set(room, updatedGameState);
            }
        };
        if (!existingGameState) {
            console.log(`No existing game state for room: ${room}`);
        }
        checkTie();
        checkWin();
        changePlayer();
        const updatedGameState = {
            ...existingGameState,
            boardMap: [...existingGameState.boardMap, existingGameState.boardMap[index] = currentPlayer.role]
        };
        this.roomGameState.set(room, updatedGameState);
        this.server.to(room).emit('update-game-state', this.roomGameState.get(room));
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
    __param(2, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], GameGateway.prototype, "handleJoinRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('leave-room'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(2, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, socket_io_1.Socket]),
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
exports.GameGateway = GameGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({ cors: true })
], GameGateway);
//# sourceMappingURL=game.gateway.js.map