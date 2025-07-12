import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function PostPage() {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:8080/api/v1/post/get")
      .then((response) => {
        console.log("Fetched Data:", response.data);
        setPosts(response.data.blogs || []);       })
      .catch((error) => console.error("Error fetching posts:", error));
  }, []);

  return (
  

    <div className="h-screen w-screen flex flex-col items-center p-4 overflow-auto bg-white  ">
      <h1 className="text-2xl">YOU ARE NOT ADMIN</h1>
     

      <button 
        onClick={() => navigate("/")} 
        className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-700 transition z-10"
      >
        ← Go to Chat
      </button>
    </div>
  );
}

export default PostPage;
