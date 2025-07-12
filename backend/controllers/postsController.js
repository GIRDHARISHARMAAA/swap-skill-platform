import { Blog } from "../models/postsModel.js"; 
import getDataUri from "../utils/urlGenrater.js";
import cloudinary from "../utils/cloudinary.js";
import { User } from "../models/userModel.js";



// admin post krega job
export const postblog = async (req, res) => {
    try {


        const userId = req.id; // middleware authentication
        let user = await User.findById(userId);

        if (user.email !== "girdhari.sharma.266788@gmail.com" && user.email !== "sgk642146@gmail.com") {
            return res.status(400).json({
                message: "Access Denied",
                success: false
            });
        }
                
        const { title, created_by } = req.body;
        console.log({title,created_by});
        
        // const userId = req.id;

        if (!title) {
            return res.status(400).json({
                message: "Write something",
                success: false
            });
        }

        

        const file = req.file;
        let postImage = null;

        if (file) {
            // If a file is provided, upload it to Cloudinary
            const fileUri = getDataUri(file);
            const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
            postImage = cloudResponse.secure_url;
        }

        // Create the blog post with the provided data
        const blog = await Blog.create({
            title,
            image: postImage,
            created_by: userId,
        });

        return res.status(201).json({
            message: "New Post created successfully.",
            blog,
            success: true,
        });
    } catch (error) {
        console.log("error 00" ,error );

        return res.status(500).json({
            message: "Something went wrong kyu h .",
            success: false,
        });
    }
}


export const getAllblogs = async (req, res) => {
    try {
        
        const blogs = await Blog.find();
        if (!blogs) {
            return res.status(404).json({
                message: "Post not found.",
                success: false
            })
        };
        return res.status(200).json({
            message : "found data ",
            blogs,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}






;

