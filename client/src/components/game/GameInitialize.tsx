import {ChangeEvent, FormEvent, useState} from 'react';
import {Socket} from 'socket.io-client';
import {toastSuccess} from '../../utils/toaster';

interface IProps {
  socket: Socket //  Socket<DefaultEventsMap, DefaultEventsMap>
  onStartGame: () => void
}
export const GameInitialize = ({ socket, onStartGame }: IProps) => {

  const [initForm, setInitForm] = useState({
    roomCreate: '',
    roomJoin: ''
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInitForm({
      ...initForm,
      [e.target.name]: e.target.value
    });
  };

  const handleCreateNewRoom = (e: FormEvent) => {
    e.preventDefault();
    socket.emit('join-room', initForm.roomCreate);
    onStartGame();
    toastSuccess(`Created room ${initForm.roomCreate}`);
  };

  const handleJoinRoom = (e: FormEvent) => {
    e.preventDefault();
    socket.emit('join-room', initForm.roomJoin);
    onStartGame();
    toastSuccess(`Joined room ${initForm.roomJoin}`);

  };

  return (
    <>
      <h2>Welcome to TicTacToe!</h2>
      <form className='init-game-form' >
        <h3>You can:</h3>
        <label>Create new game room to play</label>
        <input
          name='roomCreate'
          value={initForm.roomCreate}
          placeholder='Input name for your room'
          onChange={handleChange}
        />
        <button disabled={!initForm.roomCreate} className='game-action-btn' onClick={handleCreateNewRoom} >Create room</button>
      </form>
      <h3>Or</h3>
      <form className='init-game-form'>
        <label>Join existing game room</label>
        <input
          name='roomJoin'
          value={initForm.roomJoin}
          placeholder='Input name of the existing room'
          onChange={handleChange}
        />
        <button disabled={!initForm.roomJoin} className='game-action-btn' onClick={handleJoinRoom} >Join room</button>
      </form>
    </>
  );
};