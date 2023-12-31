import {useEffect, useState, useMemo, useCallback} from 'react';

import '../styles/scss/GamePage.scss';
import { io } from 'socket.io-client';
import {toastSuccess, toastWarning} from '../utils/toaster';
import {GameInitialize} from '../components/game/GameInitialize';
import {GameStarted} from '../components/game/GameStarted';

export const GamePage = () => {

  const [gameStarted, setGameStarted] = useState(false);
  const socket = useMemo(() => io('http://localhost:5000'), []);

  const handleFinishGame = useCallback(() => setGameStarted(false), []);
  const handleStartGame = useCallback(() => setGameStarted(true), []);

  // const sendMessage = () => {
  //   socket.emit('send-chat-message', 'test');
  // };

  useEffect(() => {
    socket.on('connected', message => {
      !gameStarted && toastSuccess(message);
    });

    // socket.on('receive-chat-message', data => {
    //   console.log(data);
    // });

    return () => {
      socket.disconnect();
      socket.off('connected');
      gameStarted && toastWarning('Disconnected from game server');
    };

  }, [socket]);

  return (
    <>
      <div className="homepage-container">
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