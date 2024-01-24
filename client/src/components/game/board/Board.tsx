import '../../../styles/scss/board.scss';
import {useEffect, useState} from 'react';
import {Square} from './Square';
import {ModalStd} from '../../ui/ModalStd';
import {PostGameModalContent} from './PostGameModalContent';
import {Socket} from 'socket.io-client';
import {useSelector} from 'react-redux';
import {selectNickname} from '../../../redux/reducers/authReducer';
import {selectRoom} from '../../../redux/reducers/gameSessionReducer';

interface IProps {
  socket: Socket
  onLeaveGame: (withToast: boolean) => void
}

interface IPlayer  {
  nickname: string | 'unknown' | 'No one' | null
  role: 'o' | 'x' | 'unknown' | 'No one'
}

export interface IGameState  {
  winner: IPlayer
  gameStatus: 'playing' | 'won' | 'tie'
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
  const [currentPlayer, setCurrentPlayer] = useState<IPlayer>({nickname: nickname, role: 'unknown'});
  const [gameState, setGameState] = useState<IGameState>({winner: {nickname: 'No one', role: 'No one'}, gameStatus: 'playing'});
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const changePlayer = () => {
    if (currentPlayer.role === 'x') {
      setCurrentPlayer({nickname: 'test2', role: 'o'});
    } else {
      setCurrentPlayer({nickname: 'test1', role: 'x'});
    }
  };

  const chooseSquare = (i: number) => {
    if (gameState.gameStatus === 'playing' && !loading) {
      socket.emit('make-move', room, i, currentPlayer);
      setLoading(true);
    }
  };

  const restartGame = () => {
    setCurrentPlayer({nickname: 'test2', role: 'o'});
    setBoardMap(['', '', '', '', '', '', '', '', '']);
    setGameState({winner: {nickname: 'unknown', role: 'unknown'}, gameStatus: 'playing'});
  };

  useEffect(() => {
    socket.on('update-game-state', (gameState: serverGameState) => {
      setBoardMap(gameState.boardMap);
      setCurrentPlayer(gameState.currentPlayer);
      setGameState({winner: gameState.winner, gameStatus: gameState.gameStatus});
      setLoading(false);
    });

    return () => {
      socket.off('update-game-state');
    };

  }, [socket]);

  useEffect(() => {
    if (gameState.gameStatus != 'playing') {
      setOpenModal(true);
    }
  }, [gameState]);

  return (
    <div className="board">
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
          <PostGameModalContent gameState={gameState} onRestartGame={restartGame} onLeaveGame={onLeaveGame} onClose={onClose} />
        }

      />

    </div>
  );
};