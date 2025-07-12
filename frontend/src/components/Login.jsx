import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from "react-hot-toast";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setAuthUser } from '../redux/userSlice';
import { BASE_URL } from '..';

const Login = () => {
  const [user, setUser] = useState({
    username: "",
    password: "",
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();



  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${BASE_URL}/api/v1/user/login`, user, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });
      navigate("/");
      console.log(res);
      dispatch(setAuthUser(res.data));
    } catch (error) {
      toast.error(error.response.data.message);
      console.log(error);
    }
    setUser({
      username: "",
      password: ""
    })
  }

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100 w-screen">
      <h2 className="text-4xl font-bold mb-8 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
        
      </h2>
      <section className="bg-white p-8 rounded-lg shadow-lg  w-90 sm:w-1/2 md:w-1/4 ">
        <div className="flex justify-self-center items-center flex-col">
          <h2 className="text-3xl font-bold mb-8 text-blue-600">Login</h2>
        </div>
        <form onSubmit={onSubmitHandler} className="space-y-10">
          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-lg font-medium text-gray-700">
                Username:
              </label>
              <input
                className="mt-1 block w-full px-4 py-2 bg-white text-black font-semibold border  border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => setUser({ ...user, username: e.target.value })}
                type="text"
                name="username"
                value={user.username}
                placeholder="Enter username..."
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-lg font-medium text-gray-700">
                Password:
              </label>
              <input
                className="mt-1 block w-full  px-4 py-2 bg-white text-black font-semibold border  border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => setUser({ ...user, password: e.target.value })}
                type="password"
                name="password"
                value={user.password}
                placeholder="Enter password..."
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Login
          </button>

          <div className="text-center text-sm text-gray-600">
            <span>Don't have an account? </span>
            <Link to="/signup" className="text-blue-600 hover:underline" >
            
              SignUp
            </Link>
          <div className='text-center text-sm text-gray-600 '>
            <span>Forget Password? </span>
            <Link to="/reset" className="text-blue-600 hover:underline  " >
            
              Reset
            </Link>
            </div>
          </div>
        </form>
      </section>
    </div>
  );
}

export default Login;
