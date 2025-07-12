import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "..";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpVerified, setIsOtpVerified] = useState(false);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();

  const handleVerifyOtp = async () => {
    if (!email || !otp) {
      setMessage("Please enter your email and OTP.");
      return;
    }

    try {
      const response = await axios.post(`${BASE_URL}/api/v1/user/verify-otp`, {
        email,
        otp,
      });

      if (response.data.success) {
        setIsOtpVerified(true);
        setMessage("OTP verified successfully. You can now reset your password.");
      } else {
        setMessage(response.data.message || "Invalid OTP.");
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Error verifying OTP.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (password.length < 6) {
      setMessage("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${BASE_URL}/api/v1/user/reset-password`, {
        email,
        password,
        otp,
      });

      if (response.data.success) {
        setMessage("Your password has been successfully reset. You can now log in.");
      } else {
        setMessage(response.data.message || "Something went wrong. Please try again.");
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Error resetting password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen bg-gray-100 p-4">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Reset Password</h2>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email..."
          required
          className="border rounded w-full bg-gray-200 text-black py-2 px-3 mb-4 font-semibold"
        />

        <label className="block text-gray-700 text-sm font-bold mb-2">OTP</label>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP"
            className="flex-grow border rounded bg-gray-200 text-black py-2 px-3 font-semibold"
          />
          <button
            type="button"
            onClick={handleVerifyOtp}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
          >
            Verify OTP
          </button>
        </div>

        {isOtpVerified && (
          <>
            <label className="block text-gray-700 text-sm font-bold mb-2">New Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password..."
              required
              className="border rounded w-full bg-gray-200 text-black py-2 px-3 mb-4 font-semibold"
            />

            <label className="block text-gray-700 text-sm font-bold mb-2">Confirm Password:</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm password..."
              required
              className="border rounded w-full bg-gray-200 text-black py-2 px-3 mb-4 font-semibold"
            />

            <button
              type="submit"
              className={`w-full px-4 py-2 rounded ${
                loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-700"
              } text-white`}
              disabled={loading}
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </>
        )}
      </form>

      {message && <p className="mt-4 text-gray-700">{message}</p>}
    </div>
  );
};

export default ResetPassword;
