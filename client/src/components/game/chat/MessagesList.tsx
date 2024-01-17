import {IMessage} from './Chat';
import {Message} from './Message';

interface IProps {
  messageList: IMessage[]
}
export const MessagesList = ({messageList}: IProps) => {
  return (
    <div className='message-list-container' >
      {
        messageList.map((messageItem) =>
          <Message key={messageItem.dateStamp} messageData={messageItem} />
        )
      }
    </div>
  );
};