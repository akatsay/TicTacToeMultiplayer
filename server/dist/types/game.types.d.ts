export interface IPlayer {
    nickname: string | 'unknown' | 'No one';
    role: 'o' | 'x' | 'unknown' | 'No one';
}
export interface IGameState {
    players: IPlayer[];
    currentPlayer: IPlayer;
    winner: IPlayer;
    boardMap: string[];
    gameStatus: 'playing' | 'won' | 'tie';
}
