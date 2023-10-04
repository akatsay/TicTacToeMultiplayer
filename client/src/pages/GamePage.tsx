import React, {useEffect, useState} from 'react';

import '../styles/scss/GamePage.scss';
import {useAuth} from '../hooks/auth.hook';
import { io } from 'socket.io-client';
import {toastSuccess, toastWarning} from '../utils/toaster';
import {GameInitialize} from '../components/game/GameInitialize';
import {GameStarted} from '../components/game/GameStarted';

export const GamePage = () => {

  const [gameStarted, setGameStarted] = useState(false);
  const socket = io('http://localhost:5000');

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
      gameStarted && toastWarning('Disconnected from game server');
    };

  }, [socket]);

  return (
    <>
      <div className="homepage-container">
        {
          gameStarted ?
            <GameStarted socket={socket} />
            :
            <GameInitialize socket={socket} onStartGame={() => setGameStarted(true)} />
        }
      </div>
    </>
  );
};