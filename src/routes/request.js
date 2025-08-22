const express=require('express')
const authorised=require('../middlewares/auth')
const requestRouter=express.Router()
const ConnectionRequest=require("../models/connectionRequest")
const User=require("../models/user")
requestRouter.post('/request/send/:status/:toUserId',authorised,async (req,res)=>{
   try{
    const fromUserId=req.user;
    const {status,toUserId}=req.params
    const allowedStatus=["ignored","interested"]
    if(!allowedStatus.includes(status)){
        return res.json({message:"invalid status type "+status})
        }
        const toUser=await User.findById(toUserId)
        if(!toUser){
            return res.status(404).json({message:"user not found"})
        }
        const existingRequest=await ConnectionRequest.findOne({
            $or:[{fromUserId,toUserId},
                {fromUserId:toUserId,toUserId:fromUserId}
            ]
        })
        if(existingRequest){
            return res.status(400).json({
                message:"request already Exist"
            })
        }
    const connectionRequest=new ConnectionRequest({
        fromUserId,
        toUserId,
        status

    })
    const data=await connectionRequest.save()
    res.json({message :fromUserId.firstName +" "+status+" to "+toUser.firstName,data})
   }
   catch(err){
    res.status(400).send("ERROR : "+err.message)
   }
})
requestRouter.post('/request/review/:status/:reqId',authorised,async (req,res)=>{
    try{
        const loggedInUser=req.user
        const {status,reqId}=req.params
        const allowedStatus=["accepted","rejected"]
        if(!allowedStatus.includes(status)){
            return res.status(400).json({message:"status not allowed"})
        }
        const connectionRequest=await ConnectionRequest.findOne({
            _id:reqId,
            toUserId:loggedInUser._id,
            status:"interested"
        })
        console.log(connectionRequest)
        if(!connectionRequest){
            return res.status(404).json({
                message:"connection request not found"
            })
        }
        connectionRequest.status=status
       const data= await connectionRequest.save()
       res.json({message:"connection request "+status,data})

    }
    catch(err){
        res.status(400).send("ERROR : "+ err.message)
    }
})
module.exports=requestRouter