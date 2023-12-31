import {Socket} from 'socket.io-client';
import {memo, useEffect, useState} from 'react';
import {toastWarning} from '../../utils/toaster';
import {useAppDispatch} from '../../redux/store';
import {leaveGameSession, selectRoom} from '../../redux/reducers/gameSessionReducer';
import {useSelector} from 'react-redux';

interface IProps {
  socket: Socket
  onFinishGame: () => void
}

export const GameStarted = memo(({ socket, onFinishGame }: IProps) => {
  const appDispatch = useAppDispatch();
  const currentRoom = useSelector(selectRoom);

  const handleLeaveGame = (withToast: boolean) => {
    socket.emit('leave-room', currentRoom);
    appDispatch(leaveGameSession);
    onFinishGame();
    withToast && toastWarning('Disconnected from the game room');
  };

  useEffect(() => {
    return () => {
      handleLeaveGame(true);
    };
  }, [ socket]);

  return (
    <>
      <h2>{`Welcome to room ${currentRoom}`}</h2>
      <button
        disabled={!currentRoom}
        className='game-action-btn'
        onClick={() => handleLeaveGame(false)}
      >
          Leave the game
      </button>
    </>
  );
});