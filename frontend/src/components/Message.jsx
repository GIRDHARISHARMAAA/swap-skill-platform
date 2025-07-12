import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from "react-redux";
import { TbTrash } from "react-icons/tb";
import axios from 'axios';
import { format } from 'date-fns';



const Message = ({ message }) => {
    const scroll = useRef();
    const { authUser, selectedUser } = useSelector(store => store.user);
    const [currentTime, setCurrentTime] = useState('');
    const [showDelete, setShowDelete] = useState(false); // State to handle delete icon visibility

    // Function to format the time into HH:mm format
    const formatTime = (date) => {
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    };
    console.log(message);
    

    // Effect to update time every minute
    useEffect(() => {
        // Set initial time when the component mounts
        const updateTime = () => {
            setCurrentTime(formatTime(new Date()));
        };

        updateTime(); // Update time immediately
        const intervalId = setInterval(updateTime, 60000); // Update time every minute

        // Cleanup the interval when the component unmounts
        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        scroll.current?.scrollIntoView({ behavior: "smooth" });
        console.log(selectedUser._id);
    }, [message]);

    // Function to handle delete message
    const deleteMessage = async () => {
        // if (!message?._id) {
        //     console.error("Message ID is missing");
        //     return;
        // }
    
        try {
            console.log('Deleting message:', message._id);
            const res = await axios.delete(`http://localhost:8080/api/v1/message/delete/${message._id}`);
            console.log('Delete response:', res.data);
            window.location.reload();
        } catch (error) {
            console.error('Error deleting message:', error.response?.data || error.message);

        }
    };
    

    return (
        <div ref={scroll} className={`chat ${message?.senderId === authUser?._id ? 'chat-end' : 'chat-start'}`}
        

        >
            <div className="chat-image avatar">
                <div
                    className={`w-10 rounded-full ${message?.senderId === authUser?._id ? 'border-2 border-blue-500' : 'border-2 border-green-500'}`}
                >
                    <img
                        alt="Profile"
                        src={message?.senderId === authUser?._id ? authUser?.profilePhoto : selectedUser?.profilePhoto}
                    />
                </div>
            </div>
            <div className="chat-header flex justify-between items-center">
            {message?.createdAt ? format(new Date(message?.createdAt), 'hh:mm a ') : ""}
                {/* Three dots button to show delete icon, only for the sender */}
                {message?.senderId === authUser?._id && (
                    <button 
                        className="p-1 text-xl text-white"
                        onClick={() => setShowDelete(!showDelete)}
                    >
                        &#8230; {/* Three dots symbol */}
                    </button>
                )}
                {/* Delete icon */}
                {showDelete && (
                    <div className="mt-1 p-1 rounded cursor-pointer" onClick={deleteMessage}>
                        
                        <span className="text-red-500 text-xl"><TbTrash /></span>
                    </div>
                )}
            </div>
            <div
                className={`chat-bubble ${message?.senderId === authUser?._id ? 'bg-blue-500 text-white' : 'bg-green-500 text-white'}`}
            >
                {message?.message}
            </div>
        </div>
    );
};




export default Message;
