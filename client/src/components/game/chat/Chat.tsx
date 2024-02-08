import '../../../styles/scss/chat.scss';
import {Socket} from 'socket.io-client';
import {ChangeEvent, FormEvent, useEffect, useRef, useState} from 'react';
import {useSelector} from 'react-redux';
import {selectNickname} from '../../../redux/reducers/authReducer';
import {MessagesList} from './MessagesList';
import {selectRoom} from '../../../redux/reducers/gameSessionReducer';
import {Loader} from '../../loaders/Loader';

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

  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const nickname = useSelector(selectNickname);
  const room = useSelector(selectRoom);
  const [messagesList, setMessagesList] = useState<IMessage[]>([]);
  const [messageToSend, setMessageToSend] = useState<IMessage>({room ,sender: nickname, message: '', dateStamp: null});
  const [loading, setLoading] = useState(false);

  const messageChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setMessageToSend({ ...messageToSend, dateStamp: Date.now(), [event.target.name]: event.target.value });
  };

  const sendMessage = (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    socket.emit('send-chat-message', messageToSend);
    setMessageToSend({room, sender: nickname, message: '', dateStamp: null});
  };

  useEffect(() => {
    socket.on('receive-chat-message', message => {
      console.log('received:');
      console.log(message);
      setLoading(false);
      setMessagesList((prevState) => {
        return [...prevState, message];
      });
    });

    return () => {
      socket.off('receive-chat-message');
    };
  }, [socket]);

  useEffect(() => {
    chatContainerRef.current?.scrollTo(0, chatContainerRef.current?.scrollHeight);
  }, [messagesList]);


  return (
    <div className="chat-container" >
      <MessagesList ref={chatContainerRef} messageList={messagesList} />
      <form className="message-controls-container" >
        <input
          className="chat-input"
          name="message"
          id="message"
          value={messageToSend.message}
          onChange={messageChangeHandler}
          autoComplete='off'
        />
        <button
          type='submit'
          disabled={!messageToSend.message || loading}
          className='game-start-btn'
          onClick={sendMessage}
        >
          {loading ? <Loader size='small' /> : 'Send'}
        </button>
      </form>
    </div>
  );
};