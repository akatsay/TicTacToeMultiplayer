import '../../../styles/scss/board.scss';
import {useEffect, useState} from 'react';
import {Square} from './Square';
import {ModalStd} from '../../ui/ModalStd';
import {PostGameModalContent} from './PostGameModalContent';
import {Socket} from 'socket.io-client';
import {useSelector} from 'react-redux';
import {selectNickname} from '../../../redux/reducers/authReducer';
import {selectRoom} from '../../../redux/reducers/gameSessionReducer';
import {BoardLoadingOverlay} from './BoardLoadingOverlay';

interface IProps {
  socket: Socket
  onLeaveGame: (withToast: boolean) => void
}

interface IPlayer  {
  nickname: string | 'unknown' | 'No one' | null
  role: 'o' | 'x' | 'unknown' | 'No one'
  readyToRestart: boolean
}

export interface IGameState  {
  winner: IPlayer
  gameStatus: 'playing' | 'won' | 'tie'
  players: IPlayer[]
}

interface serverGameState {
  players: IPlayer[]
  currentPlayer: IPlayer
  winner: IPlayer
  boardMap: string[]
  gameStatus: 'playing' | 'won' | 'tie'
}

export const Board = ({ socket, onLeaveGame }: IProps) => {

  const nickname = useSelector(selectNickname);
  const room = useSelector(selectRoom);
  const [boardMap, setBoardMap] = useState(['', '', '', '', '', '', '', '', '']);
  const [currentPlayer, setCurrentPlayer] = useState<IPlayer>({nickname: nickname, role: 'unknown', readyToRestart: false});
  const [gameState, setGameState] = useState<IGameState>({players: [], winner: {nickname: 'No one', role: 'No one', readyToRestart: false}, gameStatus: 'playing'});
  const [openModal, setOpenModal] = useState(false);
  const [loadingMove, setLoadingMove] = useState(false);
  const [loadingRestart, setLoadingRestart] = useState(false);

  const chooseSquare = (index: number) => {
    if (gameState.gameStatus === 'playing' && !loadingMove && currentPlayer.nickname === nickname && boardMap[index] === '') {
      socket.emit('make-move', {room, index});
      setLoadingMove(true);
    }
  };

  const restartGame = () => {
    socket.emit('restart-game', {room, nickname});
    setLoadingRestart(true);
  };

  useEffect(() => {
    socket.on('update-game-state', (gameState: serverGameState) => {
      console.log(gameState);
      setBoardMap(gameState.boardMap);
      setCurrentPlayer(gameState.currentPlayer);
      setGameState({players: gameState.players, winner: gameState.winner, gameStatus: gameState.gameStatus});
      setLoadingMove(false);
      if (gameState.players.every((item) => item.readyToRestart)) {
        setLoadingRestart(false);
      }
    });

    return () => {
      socket.off('update-game-state');
    };

  }, [socket]);

  useEffect(() => {
    if (gameState.gameStatus != 'playing') {
      setOpenModal(true);
    } else {
      setOpenModal(false);
    }
  }, [gameState]);

  return (
    <div className="board">
      {
        gameState.players?.length < 2 &&
          <BoardLoadingOverlay reason='Waiting for another player to join' />
      }
      <div className="row">
        <Square
          value={boardMap[0]}
          chooseSquare={() => {
            chooseSquare(0);
          }}
        />
        <Square
          value={boardMap[1]}
          chooseSquare={() => {
            chooseSquare(1);
          }}
        />
        <Square
          value={boardMap[2]}
          chooseSquare={() => {
            chooseSquare(2);
          }}
        />
      </div>
      <div className="row">
        <Square
          value={boardMap[3]}
          chooseSquare={() => {
            chooseSquare(3);
          }}
        />
        <Square
          value={boardMap[4]}
          chooseSquare={() => {
            chooseSquare(4);
          }}
        />
        <Square
          value={boardMap[5]}
          chooseSquare={() => {
            chooseSquare(5);
          }}
        />
      </div>
      <div className="row">
        <Square
          value={boardMap[6]}
          chooseSquare={() => {
            chooseSquare(6);
          }}
        />
        <Square
          value={boardMap[7]}
          chooseSquare={() => {
            chooseSquare(7);
          }}
        />
        <Square
          value={boardMap[8]}
          chooseSquare={() => {
            chooseSquare(8);
          }}
        />
      </div>
      <ModalStd
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        renderContent={(onClose) =>
          <PostGameModalContent gameState={gameState} onRestartGame={restartGame} loadingRestart={loadingRestart} onLeaveGame={onLeaveGame} onClose={onClose} />
        }
      />
    </div>
  );
};