import '../../../styles/scss/board.scss';
import {useEffect, useState} from 'react';
import {Square} from './Square';
import {patterns} from '../../../constants/patterns';
import {ModalStd} from '../../ui/ModalStd';
import {PostGameModalContent} from './PostGameModalContent';
import {Socket} from 'socket.io-client';

interface IProps {
  socket: Socket
  onLeaveGame: (withToast: boolean) => void
}

type TPlayer = {
  nickname: string | 'unknown' | 'No one'
  role: 'o' | 'x' | 'unknown' | 'No one'
}

export type TGameState = {
  winner: TPlayer
  gameStatus: 'playing' | 'won' | 'tie'
}

export const Board = ({ socket, onLeaveGame }: IProps) => {

  const [boardMap, setBoardMap] = useState(['', '', '', '', '', '', '', '', '']);
  const [currentPlayer, setCurrentPlayer] = useState<TPlayer>({nickname: 'test2', role: 'o'});
  const [gameState, setGameState] = useState<TGameState>({winner: {nickname: 'No one', role: 'No one'}, gameStatus: 'playing'});
  const [openModal, setOpenModal] = useState(false);

  const changePlayer = () => {
    if (currentPlayer.role === 'x') {
      setCurrentPlayer({nickname: 'test2', role: 'o'});
    } else {
      setCurrentPlayer({nickname: 'test1', role: 'x'});
    }
  };

  const chooseSquare = (i: number) => {
    if (boardMap[i] === '') {
      setBoardMap((currValue) => {
        const newBoardMap = [...currValue];
        newBoardMap[i] = currentPlayer.role;
        return newBoardMap;
      });
    }
  };

  const checkWin = () => {
    patterns.forEach((currPattern) => {
      const potentialWinner = boardMap[currPattern[0]];
      if (potentialWinner === '') return;
      let foundWinningPattern = true;
      currPattern.forEach((i) => {
        if (boardMap[i] !== potentialWinner ) {
          foundWinningPattern = false;
        }
      });
      if (foundWinningPattern) {
        setGameState({ winner: currentPlayer, gameStatus: 'won' });
      }
    });
  };

  const checkTie = () => {
    let allSquaresFilled = true;
    boardMap.forEach((square) => {
      if (square === '') {
        allSquaresFilled = false;
      }
    });
    allSquaresFilled && setGameState({winner: {nickname: 'No one', role: 'No one'}, gameStatus: 'tie'});
  };

  const restartGame = () => {
    setCurrentPlayer({nickname: 'test2', role: 'o'});
    setBoardMap(['', '', '', '', '', '', '', '', '']);
    setGameState({winner: {nickname: 'unknown', role: 'unknown'}, gameStatus: 'playing'});
  };

  useEffect(() => {
    checkTie();
    checkWin();
    changePlayer();
  }, [boardMap]);

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