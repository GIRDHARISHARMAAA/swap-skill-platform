


import Signup from './components/Signup';
import './App.css';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from './components/HomePage';
import Login from './components/Login';
import { useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import io from "socket.io-client";
import { setSocket } from './redux/socketSlice';
import { setOnlineUsers } from './redux/userSlice';
import { BASE_URL } from '.';
import Admin from './components/admin';
import Galary from './components/Gallary';
import Reset from './components/Reset';
import ResetPassword from './components/Reset-Password';
import ProtectedRoute from './components/ProtectedRoute'; // Import Protected Route
import Basic_info from './components/basic-info'
import UserCardsPage from './components/users';


const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />
  },
  {
    path: "/signup",
    element: <Signup />
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute>
        <Admin />
      </ProtectedRoute>
    )
  },
  {
    path: "/gallery",
    element: <Galary />
  },
  {
    path: "/reset",
    element: <Reset />
  },
  {
    path: "/Reset-Password",
    element: <ResetPassword />
  },
  {
    path: "/basic-info",
    // eslint-disable-next-line react/jsx-pascal-case
    element: <Basic_info />
  },
  {
    path: "/UserCardsPage",
    // eslint-disable-next-line react/jsx-pascal-case
    element: <UserCardsPage />
  },
]);

function App() { 
  const { authUser } = useSelector(store => store.user);
  const { socket } = useSelector(store => store.socket);
  const dispatch = useDispatch();

  useEffect(() => {
    if (authUser) {
      const socketio = io(`${BASE_URL}`, {
        query: { userId: authUser._id }
      });
      dispatch(setSocket(socketio));

      socketio?.on('getOnlineUsers', (onlineUsers) => {
        dispatch(setOnlineUsers(onlineUsers));
      });

      return () => socketio.close();
    } else {
      if (socket) {
        socket.close();
        dispatch(setSocket(null));
      }
    }
  }, [authUser]);

  return (
    <div className="h-screen flex items-center justify-center">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
