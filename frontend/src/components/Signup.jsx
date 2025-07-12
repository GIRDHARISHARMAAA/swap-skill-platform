import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { BASE_URL } from '..';

// Load Cloudinary environment variables
const CLOUD_NAME = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET;

// Debugging: Ensure env variables are loaded
// console.log("Cloudinary Cloud Name:", CLOUD_NAME);
// console.log("Upload Preset:", CLOUDINARY_UPLOAD_PRESET);

const Signup = () => {
  const [user, setUser] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    gender: '',
    profilePhoto: '', 
  });
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  
  
   
  // Handle checkbox selection (gender)
  const handleCheckbox = (gender) => {
    setUser({ ...user, gender });
  };

  // Handle file input change
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Upload Image to Cloudinary
  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      return response.data.secure_url;
    } catch (error) {
      toast.error('Error uploading image');
      console.error("Cloudinary Upload Error:", error);
      return null;
    }
  };

  // Handle Form Submission
  const onSubmitHandler = async (e) => {
    e.preventDefault();

    // Check if passwords match
    if (user.password !== user.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    // Upload photo if file is selected
    let photoUrl = user.profilePhoto; // Keep existing photo if already set
    if (file) {
      photoUrl = await uploadToCloudinary(file);
      if (!photoUrl) {
        toast.error("Failed to upload image. Please try again.");
        return;
      }
    }

    // Prepare user data without resetting the state
    const userData = { ...user, profilePhoto: photoUrl };

    try {
      const res = await axios.post(`${BASE_URL}/api/v1/user/register`, userData, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      });

      if (res.data.success) {
        toast.success(res.data.message);
        navigate('/login');

        // Reset form state after successful signup
        setUser({
          email: '',
          username: '',
          password: '',
          confirmPassword: '',
          gender: '',
          profilePhoto: '',
        });
        setFile(null);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed");
      console.error("Signup Error:", error);
    }
  };

  return (
    
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100 w-screen">
      <section className="bg-white p-8 rounded-lg shadow-lg w-90 sm:w-1/2 md:w-1/4">
        <div className="flex justify-center items-center flex-col">
          <h2 className="text-3xl font-bold mb-8 text-blue-600">Signup</h2>
        </div>
        <form onSubmit={onSubmitHandler}>

          {/* Email Field */}
          <div className="space-y-4">
            <div>
              <label className="block text-lg font-medium text-gray-700">Email:</label>
              <input
                className="mt-1 block w-full px-4 py-2 bg-white text-black font-semibold border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => setUser({ ...user, email: e.target.value })}
                type="email"
                value={user.email}
                placeholder="Enter Email..."
                required
              />
            </div>

            {/* Username Field */}
            <div>
              <label className="block text-lg font-medium text-gray-700">Username:</label>
              <input
                className="mt-1 block w-full px-4 py-2 bg-white text-black font-semibold border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => setUser({ ...user, username: e.target.value })}
                type="text"
                value={user.username}
                placeholder="Enter username..."
                required
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-lg font-medium text-gray-700">Password:</label>
              <input
                className="mt-1 block w-full px-4 py-2 bg-white text-black font-semibold border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => setUser({ ...user, password: e.target.value })}
                type="password"
                value={user.password}
                placeholder="Enter password..."
                required
              />
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="block text-lg font-medium text-gray-700">Confirm Password:</label>
              <input
                className="mt-1 block w-full px-4 py-2 bg-white text-black font-semibold border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => setUser({ ...user, confirmPassword: e.target.value })}
                type="password"
                value={user.confirmPassword}
                placeholder="Confirm password..."
                required
              />
            </div>

            {/* Profile Photo Upload */}
            <div>
              <label className="block text-lg font-medium text-gray-700">Profile Photo:</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="mt-1 block w-full px-4 py-2 bg-white text-black font-semibold border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Gender Selection */}
          <div className="flex items-center my-4 text-black">
            <div className="flex items-center">
              <p>Male</p>
              <input type="radio" checked={user.gender === 'male'} onChange={() => handleCheckbox('male')} className="mx-2 appearance-none w-5 h-5 border-2 border-gray-400 rounded-full checked:bg-blue-600 checked:border-blue-600 focus:ring-2 focus:ring-blue-500 cursor-pointer transition-all" />
            </div>
            <div className="flex items-center">
              <p>Female</p>
              <input type="radio" checked={user.gender === 'female'} onChange={() => handleCheckbox('female')} className="mx-2 appearance-none w-5 h-5 border-2 border-gray-400 rounded-full checked:bg-pink-500 checked:border-pink-500 focus:ring-2 focus:ring-pink-400 cursor-pointer transition-all" />
            </div>
          </div>

          

          {/* Login Link */}
          <p className="text-center my-2">
            Already have an account? <Link to="/login" className="text-blue-600 hover:underline">Login</Link>
          </p>

          {/* Submit Button */}
          <div>
            <button type="submit" className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">
              Signup
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default Signup;
