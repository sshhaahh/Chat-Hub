import { useChatStore } from '../store/useChatStore'
import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';
import ChatHeader from './chatHeader';
import MessageInput from './MessageInput';
import MessageSkeleton from './skeletons/MessageSkeleton';

const ChatContainer = () => {

  const {messages,getMessages,isMessagesLoading,selectedUser}=useChatStore();

  
  useEffect(()=>{
    getMessages(selectedUser._id);
  },[getMessages])

  console.log(messages)
  if(isMessagesLoading) return (
    <div className='flex-1 flex flex-col overflow-auto'>
      <ChatHeader/>
      <MessageSkeleton/>
      <MessageInput/> 
    </div>
  )



  return (
    <div className='flex-1 flex flex-col overflow-auto'>
      <ChatHeader/>

      <p>messags...</p>

      <MessageInput/>
    </div>
  )
}

export default ChatContainer