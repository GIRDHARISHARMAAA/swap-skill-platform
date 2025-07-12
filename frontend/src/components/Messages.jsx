import React from 'react'
import Message from './Message'
import useGetMessages from '../hooks/useGetMessages';
import { useSelector } from "react-redux";
import useGetRealTimeMessage from '../hooks/useGetRealTimeMessage';

const Messages = () => {
    useGetMessages();
    useGetRealTimeMessage();
    const { messages } = useSelector(store => store.message);

    // Function to handle the click event and log message ID
    const handleClick = (messageId) => {
        console.log(messageId);
    };

    return (
        <div className='px-4 flex-1 overflow-auto'>
            {
               messages && messages?.map((message) => {
                    return (
                        <div key={message._id} onClick={() => handleClick(message._id)}>
                            <Message message={message} />
                        </div>
                    )
                })
            }
        </div>
    )
}

export default Messages;