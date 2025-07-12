import React, { useState } from 'react';
import OtherUser from './OtherUser';
import useGetOtherUsers from '../hooks/useGetOtherUsers';
import { useSelector } from "react-redux";
import axios from 'axios';

const OtherUsers = () => {
    // Fetch other users using a custom hook
    useGetOtherUsers();
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const { otherUsers } = useSelector(store => store.user);
    if (!otherUsers) return null; // Prevent rendering if there are no users

    const handleClick = (user) => {
        setSelectedUser(user);
        setIsPopupOpen(true);
    };

    const handleClose = () => {
        setIsPopupOpen(false);
        setSelectedUser(null);
    };

   

  
const handleDelete = async () => {
    try {
        console.log(selectedUser._id);
        
        const res = await axios.delete("http://localhost:8080/api/v1/user/userdelete", {
            data: { loggedInUserId: selectedUser._id } // Sending data inside data object
            
         
            
            
        });
        // console.log(res.data);
        window.location.reload();

        // Add delete logic here (e.g., updating state to remove the user from UI)
        handleClose();
    } catch (error) {
        console.error("Error deleting user:", error);
    }
};

    return (
        <div className='overflow-auto flex-1  '>
            {otherUsers.map((user) => (
                <div key={user._id} onClick={() => handleClick(user)}
                className='bg-gray-700'>
                    <OtherUser user={user} />
                </div>
            ))}

            {/* Popup Window */}
            {isPopupOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h2 className="text-lg font-semibold mb-4">User Actions</h2>
                        <p>{selectedUser?.name}</p>
                        <div className="flex justify-between mt-4">
                            <button 
                                className="px-4 py-2 bg-gray-500 text-white rounded" 
                                onClick={handleClose}>
                                Back
                            </button>
                            <button 
                                className="px-4 py-2 bg-red-500 text-white rounded" 
                                onClick={handleDelete}>
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OtherUsers;