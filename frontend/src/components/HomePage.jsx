import React, { useEffect } from 'react'
import Sidebar from './Sidebar'
import MessageContainer from './MessageContainer'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'


const HomePage = () => {
  const { authUser } = useSelector(store => store.user);
  const navigate = useNavigate();
  useEffect(() => {
    if (!authUser) {
      navigate("/login");
    }
  }, []);
  return (
    <div className='flex  w-screen h-screen  md:h-[98vh] rounded-lg overflow-hidden bg-gray-400  border-2 border-gray-400 backdrop-filter backdrop-blur-lg bg-opacity-0 '
   >
      <Sidebar  />
      <MessageContainer/>
      
    

    </div>
  )
}

export default HomePage