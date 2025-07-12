import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
 
    title: {
        type: String,
        required: true
    },
   
    
    image: {
        type: String
    },
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
   
    
},{timestamps:true});
export const Blog = mongoose.model("blog",blogSchema )