import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js"
import bcrypt from 'bcrypt'
import cloudinary from "../lib/cloudinary.js";
export const signup=async(req,res)=>{
    const {name,email,password}=req.body;
    try {
        if(!name || !email || !password){
            return res.status(400).json({
                success:false,
                message:"All field required!"
            })
        }

        const user = await User.findOne({email})
        if(user){return res.status(400).json({success:false,message:"User Already Exists!"})}

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser=await User({name,email,password:hashedPassword})

        if(newUser){
            generateToken(newUser._id,res)
            await newUser.save()

            res.status(201).json({
                success:true,
                message:"User created Successfully.",
                _id:newUser._id,
                name:newUser.name,
                email:newUser.email,
                profile:newUser.profile,
            })
        }else{
            return res.status.json({
                success:false,
                message:"New user create failed!"
            })
        }

    } catch (error) {
        console.log("Errot SignUp controller",e)
        return res.status(500).json({
            message:"Internal Server Error"
        })
    }
}

export const login= async(req,res)=>{
    const {email,password}=req.body
    try {
        if(!email || !password){
            return res.status(400).json({message:"All field required!"})
        }

        const user = await User.findOne({email})
        if(!user){
            return res.status(400).json({
                message:"User Not Found!"
            })
        }

        const isPassCorrect=await bcrypt.compare(password,user.password)
        if(!isPassCorrect){
            return res.status(400).json({
                message:"Incorrect Password!"
            })
        }
        const { password: pass, ...cleanUser } = user._doc;


        generateToken(user._id,res);
        res.status(200).json({
            success:true,
            message:"Login Successfull.",
            cleanUser

        })
        
    } catch (error) {
        console.log("login constroller failed ",error)
        return res.status(400).json({
            success:false,
            message:"login error",
            
        })
    }
}

export const logout=async(req,res)=>{
    try {
        res.cookie("jwt","",{
            maxAge:0
        })
        res.status(200).json({message:"Logout Successfull."})
    } catch (error) {
        console.log("logout controller error",error);
        return res.status(400).json({
            success:false,
            message:"Logout error!"
        })
    }
}

export const updateProfile=async(req,res)=>{
    try {
        const {profilePic}=req.body;
        const userId=req.user._id;

        if(!profilePic || !userId){
            return res.status(404).json({
                success:false,
                message:"Pic or UserId not found!"
            })
        }

        const uploadResponse=await cloudinary.uploader.upload(profilePic);
        const updatedUser=await User.findByIdAndUpdate(userId,{profilepic:uploadResponse.secure_url},{new:true})

        return res.status(201).json(updatedUser);


    } catch (error) {
        console.log("Update profile controller error! " ,error);
        return res.status(400).josn({
            success:false,
            message:"Update profile server error!"
        })
    }
} 

export const checkAuth=(req,res)=>{
    try {
        return res.json(req.user);
    } catch (error) {
        console.log(error)
        return res.json({message:"check Auth error..."})
    }
}