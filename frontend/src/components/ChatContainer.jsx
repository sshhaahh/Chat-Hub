import { useChatStore } from '../store/useChatStore';
import { Loader2 } from 'lucide-react';
import { useEffect, useRef } from 'react';
import ChatHeader from './ChatHeader';
import MessageInput from './MessageInput';
import MessageSkeleton from './skeletons/MessageSkeleton';
import { useAuthStore } from '../store/useAuthStore';
import { formatMessageTime } from '../lib/utils';

const ChatContainer = () => {

  const { messages, getMessages, isMessagesLoading, selectedUser, subscribeToMessages, unsubscribeFromMessages } = useChatStore();
  const { authUser } = useAuthStore();

  
  const messageEndRef = useRef(null);

  useEffect(() => {
    if (!selectedUser?._id) return;

    getMessages(selectedUser._id);
    subscribeToMessages();

    return () => {
      unsubscribeFromMessages();
    };
  }, [selectedUser?._id]); 

  useEffect(() => {
    if (messageEndRef.current && messages.length > 0) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  if (isMessagesLoading) return (
    <div className='flex-1 flex flex-col overflow-auto'>
      <ChatHeader />
      <MessageSkeleton />
      <MessageInput />
    </div>
  );

  return (
    <div className='flex-1 flex flex-col overflow-auto'>
      <ChatHeader />

      <div className='flex-1 overflow-y-auto p-4 space-y-4'>
        {
          messages.map((message, index) => (
            <div
              key={message._id}
              className={`chat ${message.senderId === authUser._id ? "chat-end" : "chat-start"}`}
            >
              <div className='chat-image avatar'>
                <div className='size-10 rounded-full border '>
                  <img
                    src={message.senderId === authUser._id ? authUser.profilepic || "./avatar.png" : selectedUser.profilepic}
                    alt=""
                  />
                </div>
              </div>

              <div className='chat-header mb-1'>
                <time className='text-sm opacity-50 ml-1'>
                  {formatMessageTime(message.createdAt)}
                </time>
              </div>

              <div className='chat-bubble flex flex-col'>
                {message.image && (
                  <img
                    src={message.image}
                    alt='Attachment'
                    className='sm:max-w-[200px] rounded-md mb-2'
                  />
                )}
                {message.text && (<p>{message.text}</p>)}
              </div>

              {index === messages.length - 1 && (
                <div ref={messageEndRef} />
              )}
            </div>
          ))
        }
      </div>

      <MessageInput />
    </div>
  );
};

export default ChatContainer;
