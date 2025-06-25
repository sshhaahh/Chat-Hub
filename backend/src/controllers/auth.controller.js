import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from 'bcryptjs';
import cloudinary from "../lib/cloudinary.js";

// SIGNUP
export const signup = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "All fields required!" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User already exists!" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ name, email, password: hashedPassword });

    generateToken(newUser._id, res);
    await newUser.save();

    const { password: pass, ...userData } = newUser._doc;

    res.status(201).json({
      success: true,
      message: "User created successfully.",
      ...userData, // 👈 return correct user fields
    });

  } catch (error) {
    console.log("Error in signup controller:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// LOGIN
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: "All fields required!" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found!" });
    }

    const isPassCorrect = await bcrypt.compare(password, user.password);
    if (!isPassCorrect) {
      return res.status(400).json({ message: "Incorrect password!" });
    }

    generateToken(user._id, res);

    const { password: pass, ...userData } = user._doc;

    res.status(200).json({
      success: true,
      message: "Login successful.",
      ...userData // 👈 return correct user fields
    });

  } catch (error) {
    console.log("Login controller failed:", error);
    res.status(500).json({ success: false, message: "Login server error!" });
  }
};

// LOGOUT
export const logout = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logout successful." });
  } catch (error) {
    console.log("Logout controller error:", error);
    res.status(400).json({ success: false, message: "Logout error!" });
  }
};

// UPDATE PROFILE
export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    const userId = req.user._id;

    if (!profilePic || !userId) {
      return res.status(400).json({ success: false, message: "Pic or UserId not found!" });
    }

    const uploadResponse = await cloudinary.uploader.upload(profilePic);

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilepic: uploadResponse.secure_url },
      { new: true }
    );

    const { password, ...userData } = updatedUser._doc;

    res.status(200).json({
      success: true,
      message: "Profile updated.",
      ...userData
    });

  } catch (error) {
    console.log("Update profile controller error!", error);
    res.status(500).json({ success: false, message: "Update profile server error!" });
  }
};

// CHECK AUTH
export const checkAuth = (req, res) => {
  try {
    const { password, ...userData } = req.user._doc;
    return res.json(userData);
  } catch (error) {
    console.log("Check auth error:", error);
    res.status(500).json({ message: "Check auth error!" });
  }
};
