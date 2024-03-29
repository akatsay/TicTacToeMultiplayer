import {ChangeEvent, FormEvent, useEffect, useState, memo} from 'react';
import {Socket} from 'socket.io-client';
import {toastError, toastSuccess} from '../../utils/toaster';
import {useAppDispatch} from '../../redux/store';
import {joinGameSession} from '../../redux/reducers/gameSessionReducer';
import {useSelector} from 'react-redux';
import {selectNickname} from '../../redux/reducers/authReducer';

interface IProps {
  socket: Socket
  onStartGame: () => void
}
export const GameInitialize = memo(({ socket, onStartGame }: IProps) => {

  const appDispatch = useAppDispatch();
  const nickname = useSelector(selectNickname);
  const [room, setRoom] = useState('');
  const player = {nickname: nickname, role: 'unknown'};

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setRoom(e.target.value);
  };

  const handleJoinRoom = (e: FormEvent) => {
    e.preventDefault();
    if (room) {
      socket.emit('join-room', {room, player});
    }
  };

  useEffect(() => {
    socket.on('join-room-success', room => {
      appDispatch(joinGameSession({room: room}));
      onStartGame();
      toastSuccess(`Joined room ${room}`);
    });
    socket.on('room-full', room => {
      toastError(`Room ${room} is full`);
    });

    return () => {
      socket.off('join-room-success');
      socket.off('room-full');
    };

  }, [socket]);

  return (
    <>
      <h2>Welcome to TicTacToe!</h2>
      <form className='init-game-form'>
        <label>To play simply enter the room name</label>
        <input
          name='roomJoin'
          value={room}
          placeholder='Input room name'
          onChange={handleChange}
        />
        <button className='game-start-btn' onClick={handleJoinRoom} >Play</button>
      </form>
    </>
  );
});