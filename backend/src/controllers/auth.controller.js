import User from "../models/user.model.js"
import bcrypt from 'bcrypt'
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

        const salt=await bcrypt.genSalt(10);
        const hashPassword=(password,slat);

        const newUser=await User({name,email,password:hashPassword})

        if(newUser){
            
        }else{
            return res.status.json({
                success:false,
                message:"New user create failed!"
            })
        }

    } catch (error) {
        
    }
}

export const login=(req,res)=>{
    res.send("login route");
}

export const logout=(req,res)=>{
    res.send("logout route");
}