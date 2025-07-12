import React, { useState, useEffect } from "react";
import axios from "axios";
import OtherUsers from "./othersUsers2";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FiMenu, FiX } from "react-icons/fi";

function Admin() {
  const [media, setMedia] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [mediaType, setMediaType] = useState("");
  const [text, setText] = useState("");
  const [posts, setPosts] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/v1/post/get");
      if (response.data.blogs && Array.isArray(response.data.blogs)) {
        setPosts(response.data.blogs);
      } else {
        console.error("Unexpected response structure:", response.data);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileType = file.type.split("/")[0];
      setMediaType(fileType);
      setMedia(file);
      setMediaPreview(URL.createObjectURL(file));
    }
  };

  const handleTextChange = (e) => setText(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (text || media) {
      const formData = new FormData();
      formData.append("title", text);
      formData.append("created_time", new Date().toISOString());
      if (media) {
        formData.append("file", media);
      }

      try {
        const token = localStorage.getItem("token");
        await axios.post("http://localhost:8080/api/v1/post/post", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });

        fetchPosts();
        setMedia(null);
        setText("");
        setMediaType("");
        setMediaPreview(null);
        setMenuOpen(false);
      } catch (error) {
        console.error("Error uploading post:", error.response?.data || error.message);
        toast.error(error.response?.data?.message || "Failed to upload post.");
      }
    }
  };

  

  return (
    <div className="relative min-h-screen w-screen flex bg-gray-100">
      <button
        className="fixed top-4 right-4 bg-gray-800 text-white p-2 rounded-md sm:hidden z-40"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      <div
        className={`fixed sm:relative inset-y-0 right-0 transform ${menuOpen ? "translate-x-0" : "translate-x-full"} sm:translate-x-0 w-64 bg-white p-4 rounded-lg shadow-xl z-30 transition-transform duration-300 pt-10 px-6 flex flex-col gap-6`}
      >
        
        <div className="flex-1 overflow-y-auto max-h-64 border-t border-gray-300 pt-4">
          <h2 className="text-lg font-semibold text-gray-700 mb-3">Other Users</h2>
          <OtherUsers />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto max-h-screen p-6">
        
        
      </div>
      <button 
        onClick={() => navigate("/")} 
        className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-700 transition z-10"
      >
        ← Go to Chat
      </button>
    </div>
  );
}

export default Admin;
