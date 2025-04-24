import dotenv from "dotenv"
import jwt from "jsonwebtoken"

dotenv.config()
export const generateToken=(userId,res)=>{
    const token=jwt.sign({userId},process.env.JWT_SECRET,{expiresIn:"7d"})

}