import {Socket} from 'socket.io-client';
import {memo, useEffect, useState} from 'react';
import {toastWarning} from '../../utils/toaster';
import {useAppDispatch} from '../../redux/store';
import {leaveGameSession, selectRoom} from '../../redux/reducers/gameSessionReducer';
import {useSelector} from 'react-redux';
import {Chat} from './chat/Chat';
import {Board} from './board/Board';
import {selectNickname} from '../../redux/reducers/authReducer';

interface IProps {
  socket: Socket
  onFinishGame: () => void
}

export const GameStarted = memo(({ socket, onFinishGame }: IProps) => {
  const appDispatch = useAppDispatch();
  const currentRoom = useSelector(selectRoom);
  const nickname = useSelector(selectNickname);
  const player = {nickname: nickname, role: 'unknown'};

  const handleLeaveGame = (withToast: boolean) => {
    socket.emit('leave-room', {room: currentRoom, player});
    appDispatch(leaveGameSession());
    onFinishGame();
    withToast && toastWarning('Disconnected from the game room');
  };

  useEffect(() => {
    const handleUnload = () => {
      handleLeaveGame(true);
    };

    window.addEventListener('beforeunload', handleUnload);

    return () => {
      window.removeEventListener('beforeunload', handleUnload);
      handleLeaveGame(true);
    };
  }, [socket]);

  return (
    <>
      <div className="room-controls">
        <h2>{`Welcome to room ${currentRoom}`}</h2>
        <button
          disabled={!currentRoom}
          className='game-leave-btn'
          onClick={() => handleLeaveGame(false)}
        >
            Leave the game
        </button>
      </div>
      <div className='game-controls-container'>
        <Board socket={socket} onLeaveGame={handleLeaveGame} />
        <Chat socket={socket} />
      </div>
    </>
  );
});