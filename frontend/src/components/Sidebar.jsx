import React, { useState } from 'react';
import { BiSearchAlt2 } from "react-icons/bi";
import OtherUsers from './OtherUsers';
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setAuthUser, setOtherUsers, setSelectedUser } from '../redux/userSlice';
import { setMessages } from '../redux/messageSlice';
import { BASE_URL } from '..';

const Sidebar = () => {
    const [search, setSearch] = useState("");
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { authUser, otherUsers } = useSelector((store) => store.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const ALLOWED_EMAIL = "girdhari.sharma.266788@gmail.com";  // Admin email

    const logoutHandler = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/api/v1/user/logout`);
            navigate("/login");
            toast.success(res.data.message);
            dispatch(setAuthUser(null));
            dispatch(setMessages(null));
            dispatch(setOtherUsers(null));
            dispatch(setSelectedUser(null));
        } catch (error) {
            console.log(error);
        }
    };

    const searchSubmitHandler = (e) => {
        e.preventDefault();
        const conversationUser = otherUsers?.find((user) =>
            user.username.toLowerCase().includes(search.toLowerCase())
        );
        if (conversationUser) {
            dispatch(setOtherUsers([conversationUser]));
        } else {
            toast.error("User not found!");
        }
    };

    // Handle Gallery button click
    const handleGalleryClick = () => {
        if (authUser?.email === ALLOWED_EMAIL) {
            navigate("/admin");  // Redirect Admin to /admin
        } else {
            navigate("/gallery");  // Redirect others to /gallery
        }
    };

    return (
        <div className='absolute bg-zinc-800 z-10 h-full'>
            <div className="mt-6 px-4 pb-5 w-14 flex justify-between items-center border-b border-slate-500">
                <div className="text-lg md:font-semibold"></div>
                <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden rounded-md">
                    <span className="block w-6 h-1 bg-white mb-1"></span>
                    <span className="block w-6 h-1 bg-white mb-1"></span>
                    <span className="block w-6 h-1 bg-white"></span>
                </button>
                
            </div>

            {/* Sidebar Menu */}
            <div className={`md:flex md:flex-col md:items-start md:justify-start ${isMenuOpen ? 'block' : 'hidden'} lg:block`}>
                <form onSubmit={searchSubmitHandler} className='flex items-center gap-2 m-1'>
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className='input input-bordered rounded-md'
                        type="text"
                        placeholder='Search...'
                    />
                    <button type='submit' className='btn bg-zinc-700 text-white'>
                        <BiSearchAlt2 className='w-6 h-6 outline-none' />
                    </button>
                </form>
                <div className="overflow-y-auto h-[60vh] mt-4 w-full">
                    <OtherUsers />
                </div>

                <div className="flex flex-col items-center w-full gap-2 absolute bottom-10">
                    {/* Visible to all users */}
                    <button 
                        onClick={handleGalleryClick} 
                        className="btn w-40 btn-sm text-white border-2 border-white hover:bg-blue-600"
                    >
                        Admin
                    </button>
                    
                    <button 
                        onClick={logoutHandler} 
                        className="btn w-40 btn-sm text-white border-2 border-white hover:bg-blue-600"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
