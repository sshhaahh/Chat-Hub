import mongoose from "mongoose"

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        minlength:6,
        required:true,
    },
    profilepic:{
        type:String,
        default:"",   
    },
},
{
    timestamps:true
})

export default mongoose.model("User",userSchema);
