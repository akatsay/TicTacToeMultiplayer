import {IMessage} from './Chat';
import {Message} from './Message';
import React, {forwardRef} from 'react';

interface IProps {
  messageList: IMessage[]
}
export const MessagesList = forwardRef<HTMLDivElement, IProps>(({ messageList }, ref) => {
  return (
    <div ref={ref} className='message-list-container'>
      {messageList.map((messageItem) => (
        <Message key={messageItem.dateStamp} messageData={messageItem} />
      ))}
    </div>
  );
});