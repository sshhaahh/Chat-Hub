import User from "../models/user.model.js";
import Message from "../models/message.model.js"
import cloudinary from "../lib/cloudinary.js";

export const getUserForSlider = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");

    return res.status(200).json({
      success: true,
      users: filteredUsers
    });

  } catch (error) {
    console.error("getUserForSlider error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch users"
    });
  }
}

export const getMessages=async(req,res)=>{
    try {
        const {id:userToChatId}=req.params
        const senderId=req.user._id;

        const messages=await Message.find({
            $or:[
                {senderId:senderId , receiverId:userToChatId},
                {senderId:userToChatId , receiverId:senderId}
            ]
        })


        return res.status(200).json(messages);
    } catch (error) {
        console.log("get mesage error",error)
        return res.status(500).json({
            success:false,
            message:"get message controller error."
        })        
    }    
}

export const sendMessages=async(req,res)=>{
    try {
        const {text,image}=req.body;
        const {id:receiverId}=req.params;
        const senderId=req.user._id;

        let imageURL;

        if(image){
            const uploadResponse=await cloudinary.uploader.upload(image);
            imageURL=uploadResponse.secure_url;
        }

        const newMessage=new Message({
            senderId,
            receiverId,
            text,
            image:imageURL,
        })

        await newMessage.save();

        // soket io 

        return res.status(201).json(newMessage);
    } catch (error) {
        console.log("send message failed send messgae controller error",sendMessages);
        return res.status(500).json({
            success:false,
            message:"send messag controller error."
        })
    }

    
}