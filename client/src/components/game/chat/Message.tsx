import {IMessage} from './Chat';
import {useSelector} from 'react-redux';
import {selectNickname} from '../../../redux/reducers/authReducer';

interface IProps {
  messageData: IMessage
}

export const Message = ({ messageData }: IProps) => {

  const nickname = useSelector(selectNickname);
  const isMessageMine = nickname === messageData.sender;

  return (
    <div className={`${isMessageMine ? 'message-container-me' : 'message-container-enemy'}`}>
      <div
        className={`${isMessageMine ? 'message-avatar-me' : 'message-avatar-enemy'}`}
      >
        {messageData.sender?.charAt(0)}
      </div>
      <div className="message-content">
        <p className="message-sender">
          {messageData.sender}
        </p>
        <p className="message-text">
          {messageData.message}
        </p>
      </div>
    </div>
  );
};