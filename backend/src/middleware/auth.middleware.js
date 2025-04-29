import jwt from "jsonwebtoken"
import User from "../models/user.model.js"

export const protectRoute=async(req,res,next)=>{
    try {
        const token = req.cookie.jwt;
        if(!token){
            return res.status(400).json({
                success:false,
                message:"Unauthorized - No token provided...!"
            })
        }

        const decoded=jwt.verify(token,process.env.JWT_SECRET)

        if(!decoded){
            return res.status(400).json({
                success:false,
                message:"Unauthorized - Invalid Token...!"
            })
        }

        const user=await User.findOne(decoded.userId).select("-password");

        if(!user){
            return res.status(404).json({
                success:false,
                message:"User not found in middleware."
            })
        }

        req.user=user;
        next();


    } catch (error) {
        console.log("ProtectRoute ccontroller error",protectRoute)
        return res.status(400).json({
            success:false,
            message:"Protect route error"
        })
    }

}