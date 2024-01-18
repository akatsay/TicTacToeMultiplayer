import '../../../styles/scss/chat.scss';
import {Socket} from 'socket.io-client';
import {ChangeEvent, useState} from 'react';
import {useSelector} from 'react-redux';
import {selectNickname} from '../../../redux/reducers/authReducer';
import {MessagesList} from './MessagesList';
import {selectRoom} from '../../../redux/reducers/gameSessionReducer';

interface IProps {
  socket: Socket
}

export interface IMessage {
  room: string
  sender: string | null
  message: string
  dateStamp: number | null
}

export const Chat = ({ socket }: IProps) => {

  const nickname = useSelector(selectNickname);
  const room = useSelector(selectRoom);
  const [messagesList, setMessagesList] = useState<IMessage[]>([]);
  const [messageToSend, setMessageToSend] = useState<IMessage>({room ,sender: nickname, message: '', dateStamp: null});

  const messageChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setMessageToSend({ ...messageToSend, dateStamp: Date.now(), [event.target.name]: event.target.value });
  };

  const sendMessage = () => {
    socket.emit('send-chat-message', messageToSend);
    setMessagesList(() => {
      return [...messagesList, messageToSend];
    });
    setMessageToSend({room, sender: nickname, message: '', dateStamp: null});
  };

  socket.on('receive-chat-message', message => {
    console.log('received:');
    console.log(message);
    setMessagesList(() => {
      return [...messagesList, message];
    });
  });

  return (
    <div className="chat-container" >
      <MessagesList messageList={messagesList} />
      <div className="message-controls-container" >
        <input
          className="chat-input"
          name="message"
          id="message"
          value={messageToSend.message}
          onChange={messageChangeHandler}
        />
        <button
          disabled={!messageToSend.message}
          className='game-start-btn'
          onClick={() => sendMessage()}
        >
        Send
        </button>
      </div>
    </div>
  );
};