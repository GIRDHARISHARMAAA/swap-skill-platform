import React from 'react';
import SendInput from './SendInput';
import Messages from './Messages';
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setSelectedUser } from '../redux/userSlice';
import { FaRegUserCircle } from "react-icons/fa";
import { AiOutlineHome } from "react-icons/ai";

const MessageContainer = () => {
    const { selectedUser, authUser, onlineUsers } = useSelector(store => store.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const isOnline = onlineUsers?.includes(selectedUser?._id);

    return (
        <>
            {selectedUser !== null ? (
                <div
                    className='w-full [sm:w-3/4 md:w-1200px] flex flex-col ml-14 md:ml-[290px]'
                    style={{
                        backgroundImage: "url('https://wallpapercave.com/wp/wp14199750.jpg')",
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                    }}
                >
                    {/* Header with icons */}
                    <div className='flex gap-4 items-center bg-indigo-800 text-white px-4 py-2 mb-2'>
                        <div className={`avatar ${isOnline ? 'online' : ''}`}>
                            <div className='w-12 rounded-full border-2 border-purple-500'>
                                <img src={selectedUser?.profilePhoto} alt="user-profile" />
                            </div>
                        </div>

                        <div className='flex flex-col flex-1'>
                            <div className='flex justify-between gap-2'>
                                <p>{selectedUser?.username}</p>
                            </div>
                        </div>

                        {/* Profile Icon */}
                        <div
                            className="cursor-pointer transition-transform hover:scale-110"
                            onClick={() => navigate('/basic-info')}
                            title="My Profile"
                        >
                            <FaRegUserCircle size={28} />
                        </div>

                        {/* Home Icon */}
                        <div
                            className="cursor-pointer transition-transform hover:scale-110"
                            onClick={() => navigate('/users')}
                            title="All Users"
                        >
                            <AiOutlineHome size={28} />
                        </div>
                    </div>

                    <Messages />
                    <SendInput />
                </div>
            ) : (
                <div className='w-full [sm:w-3/4 md:w-1200px] flex flex-col justify-center items-center'>
                    <h1 className='text-4xl text-white font-bold'>Hi, {authUser?.username}</h1>
                    <h1 className='text-2xl text-white'>Let's start conversation</h1>

                    {/* Home icon visible even if no user selected */}
                    <div
                        className="mt-6 text-white cursor-pointer transition-transform hover:scale-110"
                        onClick={() => navigate('/users')}
                        title="Explore Users"
                    >
                        <AiOutlineHome size={36} />
                    </div>
                </div>
            )}
        </>
    );
};

export default MessageContainer;
