import { useState } from "react";
import axios from "axios";
import { BASE_URL } from "..";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(""); // Clear previous messages

    try {
      const response = await axios.post(`${BASE_URL}/api/v1/user/forget-password`,  {email} );

      
      setMessage("A reset link has been sent to your email, please check your email inbox.");
    } catch (error) {
      setMessage("Error sending reset link. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen bg-gray-100 p-4">
      <h2 className="text-2xl font-bold mb-4 text-gray-600">Forgot Password?</h2>
      <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded px-8 pt-6 pb-8 mb-4 w-96">
        <label className="block text-gray-700 text-sm font-bold mb-2">Enter your email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="border rounded w-full bg-gray-200 text-black py-2 px-3 mb-4"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">
          Send Reset Link
        </button>
      </form>
      {message && <p className="mt-2 text-gray-700">{message}</p>}
    </div>
  );
};

export default ForgotPassword;
