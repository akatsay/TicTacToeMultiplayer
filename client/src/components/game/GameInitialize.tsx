import {ChangeEvent, FormEvent, useEffect, useState, memo} from 'react';
import {Socket} from 'socket.io-client';
import {toastError, toastSuccess} from '../../utils/toaster';
import {useAppDispatch} from '../../redux/store';
import {joinGameSession} from '../../redux/reducers/gameSessionReducer';

interface IProps {
  socket: Socket
  onStartGame: () => void
}
export const GameInitialize = memo(({ socket, onStartGame }: IProps) => {

  const appDispatch = useAppDispatch();
  const [room, setRoom] = useState('');

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setRoom(e.target.value);
  };

  const handleCreateNewRoom = (e: FormEvent) => {
    e.preventDefault();
    socket.emit('join-room', room);
  };

  const handleJoinRoom = (e: FormEvent) => {
    e.preventDefault();
    socket.emit('join-room', room);
  };

  useEffect(() => {
    socket.on('join-room-success', room => {
      appDispatch(joinGameSession({room: room}));
      onStartGame();
      console.log(room);
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