import { User } from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";





export const hashedPassword = async (password) => {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
};

export const register = async (req, res) => {
    try {
        const { email, username, password, confirmPassword, gender, profilePhoto } = req.body;

        // Check if all fields are provided
        if (!email || !username || !password || !confirmPassword || !gender) {
            return res.status(400).json({ message: "All fields are required." });
        }

        // Password Match Validation
        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match." });
        }

        // Check if user already exists (both username and email)
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).json({ message: "Username or email already exists. Try a different one." });
        }

        // Hash Password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Assign Default Profile Photo if Not Provided
    
        const assignedProfilePhoto = profilePhoto  ;

        // Create User
        const newUser = await User.create({
            email,
            username,
            password: hashedPassword,
            profilePhoto: assignedProfilePhoto,
            gender,
        });

        // Send Welcome Email After User is Created
        const transport = nodemailer.createTransport({
            service: "gmail",
            secure: true,
            auth: {
                user: process.env.MY_GMAIL,
                pass: process.env.MY_PASSWORD,
            }
        });

        const receiver = {
            from: '"ChatApp" <support@yourdomain.com>',
            to: email,
            subject: "Welcome to ChatApp!",
            html: `
                <p>Hi <strong>${username}</strong>,</p>
                <p>Welcome to ChatApp! We’re glad to have you on board.</p>
                <p>Start exploring and connecting with your friends.</p>
                <p>Thanks,<br>ChatApp Support</p>
            `,
        };

        await transport.sendMail(receiver);

        return res.status(201).json({
            message: "Account created successfully.",
            success: true,
        });

    } catch (error) {
        console.error("Error in register function:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
export const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ message: "All fields are required" });
        };
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({
                message: "Incorrect username or password",
                success: false
            })
        };
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "Incorrect username or password",
                success: false
            })
        };
        const tokenData = {
            userId: user._id
        };

        const token = await jwt.sign(tokenData, process.env.JWT_SECRET_KEY, { expiresIn: '1d' });

        return res.status(200).cookie("token", token, { maxAge: 1 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: 'strict' }).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            profilePhoto: user.profilePhoto
        });

    } catch (error) {
        console.log(error);
    }
}
export const logout = (req, res) => {
    try {
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({
            message: "logged out successfully."
        })
    } catch (error) {
        console.log(error);
    }
}
export const getOtherUsers = async (req, res) => {
    try {
        const loggedInUserId = req.id;
        const otherUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");
        return res.status(200).json(otherUsers);
    } catch (error) {
        console.log(error);
    }
}

export const deleteUser = async (req, res) => {
    try {
        const {loggedInUserId} = req.body;
        
       
        const user = await User.findById(loggedInUserId);
        
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false
            });
        }

      
        await User.findByIdAndDelete(loggedInUserId);
        
        return res.status(200).json({
            message: "User account deleted successfully.",
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "An error occurred while deleting the account.",
            success: false
        });
    }
}





export const forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).send({ message: "Please provide an email" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    const resetLink = `http://localhost:3000/reset-password?email=${email}&otp=${otp}`;

    // Setup Email
    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MY_GMAIL,
        pass: process.env.MY_PASSWORD,
      },
    });

    const mailOptions = {
      from: `"ChatApp Support" <${process.env.MY_GMAIL}>`,
      to: email,
      subject: "Reset Your Password (OTP Included)",
      html: `
        <h3>Hello,</h3>
        <p>Your OTP is: <strong>${otp}</strong></p>
        <p>Click below to reset your password:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>This OTP is valid for 10 minutes. If you didn't request this, ignore the email.</p>
      `,
    };

    await transport.sendMail(mailOptions);

    return res.status(200).send({ message: "OTP sent to your email." });
  } catch (error) {
    console.error("Error in forgetPassword:", error);
    return res.status(500).send({ message: "Internal Server Error" });
  }
};


export const resetPassword = async (req, res) => {
    try {
      const { email, otp, password } = req.body;
  
      if (!email || !otp || !password) {
        return res.status(400).json({ message: "Email, OTP, and password are required" });
      }
  
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // Verify OTP
      if (user.otp !== otp) {
        return res.status(400).json({ message: "Invalid OTP" });
      }
  
      if (user.otpExpires < Date.now()) {
        return res.status(400).json({ message: "OTP expired" });
      }
  
      // Update password
      user.password = await hashedPassword(password);
  
      // Clear OTP
      user.otp = undefined;
      user.otpExpires = undefined;
  
      await user.save();
  
      return res.status(200).json({ message: "Password reset successfully" });
    } catch (error) {
      console.error("Error in resetPassword:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };

  
  // controllers/userController.js or wherever your controller is
export const verifyOtp = async (req, res) => {
    try {
      const { email, otp } = req.body;
  
      if (!email || !otp) {
        return res.status(400).json({ message: "Email and OTP are required" });
      }
  
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      if (user.otp !== otp) {
        return res.status(400).json({ message: "Invalid OTP" });
      }
  
      if (user.otpExpires < Date.now()) {
        return res.status(400).json({ message: "OTP expired" });
      }
  
      return res.status(200).json({ success: true, message: "OTP verified successfully." });
    } catch (error) {
      console.error("Error in verifyOtp:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };
  