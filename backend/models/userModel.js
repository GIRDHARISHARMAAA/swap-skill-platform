import mongoose from "mongoose";

const userModel = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    username:{
      type:String,
      required:true,
      unique:true
    },
    password:{
        type:String,
        required:true
    },
    profilePhoto:{
        type:String,
        require:true
    },
    gender:{
        type:String,
        enum:["male", "female"],
        required:true
    },
    otp: {
        type: String,
      },
      otpExpires: {
        type: Date,
      },
}, {timestamps:true});
export const User = mongoose.model("User", userModel);