import {useEffect, useState, useMemo, useCallback} from 'react';

import '../styles/scss/GamePage.scss';
import { io } from 'socket.io-client';
import {toastSuccess, toastWarning} from '../utils/toaster';
import {GameInitialize} from '../components/game/GameInitialize';
import {GameStarted} from '../components/game/GameStarted';

export const GamePage = () => {

  const [gameStarted, setGameStarted] = useState(false);
  const socket = useMemo(() => io('wss://localhost:443', { secure: true }), []);

  const handleFinishGame = useCallback(() => setGameStarted(false), []);
  const handleStartGame = useCallback(() => setGameStarted(true), []);

  useEffect(() => {
    socket.on('connected', message => {
      !gameStarted && toastSuccess(message);
    });

    socket.on('game-server-restart', message => {
      !gameStarted && toastWarning(message);
      handleFinishGame();
    });

    return () => {
      socket.disconnect();
      socket.off('connected');
      socket.off('game-server-restart');
      gameStarted && toastWarning('Disconnected from game server');
    };

  }, [socket]);

  return (
    <>
      <div className="gamepage-container">
        {
          gameStarted ?
            <GameStarted socket={socket} onFinishGame={handleFinishGame} />
            :
            <GameInitialize socket={socket} onStartGame={handleStartGame} />
        }
      </div>
    </>
  );
};