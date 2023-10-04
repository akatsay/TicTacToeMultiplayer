import React, {useEffect} from 'react';

import '../styles/scss/homePage.scss';
import {useAuth} from '../hooks/auth.hook';
import { io } from 'socket.io-client';

export const HomePage = () => {

  const { nickname } = useAuth();
  const socket = io('http://localhost:5000');

  const sendMessage = () => {
    socket.emit('send-chat-message', 'test');
  };

  useEffect(() => {
    socket.on('connected', data => {
      console.log(data);
    });

    socket.on('receive-chat-message', data => {
      console.log(data);
    });

    return () => {
      socket.disconnect();
      console.log('disconnect');
    };

  }, [socket]);

  return (
    <>
      <div className="homepage-container">
        <button onClick={sendMessage}>Send</button>
        <h1 className="page-title">HomePage</h1>
        <h2>Hello, {nickname} !</h2>
      </div>
    </>
  );
};