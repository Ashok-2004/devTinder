const express=require('express')
const userRouter=express.Router()
const ConnectionRequest=require('../models/connectionRequest')
const authorised=require('../middlewares/auth')
const User=require('../models/user')
const User_Safe="firstName lastName photoURL age gender about skills"
userRouter.get('/user/request/recieved',authorised,async (req,res)=>{
    try{
        const loggedInUser=req.user
        const connectionRequest=await ConnectionRequest.find({
            toUserId:loggedInUser._id,
            status:"interested"
        }).populate("fromUserId","firstName lastName photoURL age gender about skills")
        res.json({message:"Data fetched successful",data:connectionRequest})
    }
    catch(err){
        res.status(400).send("ERROR : "+err.message)
    }
})
userRouter.get('/user/connections',authorised,async (req,res)=>{
    try{
        const loggedInUser=req.user
        console.log(loggedInUser)
        const connectionRequest=await ConnectionRequest.find({
            $or:[{toUserId:loggedInUser._id,status:"accepted"},{fromUserId:loggedInUser._id,status:"accepted"}]
        }).populate("fromUserId",User_Safe).populate("toUserId",User_Safe)
        const data=connectionRequest.map((row)=>{
            if(row.fromUserId._id.equals(loggedInUser._id)){
                return row.toUserId
            }
            return row.fromUserId
        })
        res.json({data})
    }
    catch(err){
        res.status(400).send("ERROR : " +err.message)
    }
})
userRouter.get('/feed',authorised,async (req,res)=>{
    try{
        
        const loggedInUser=req.user
        const page=parseInt(req.query.page)|| 1
        let limit=parseInt(req.query.limit) || 10
        limit=limit>50? 50 : limit
        const skip=(page-1)*limit
        const connectionRequest=await ConnectionRequest.find({
            $or:[{fromUserId:loggedInUser._id},{toUserId:loggedInUser._id}]
        }).select("fromUserId toUserId")

        const hideUserFromFeed=new Set()
        connectionRequest.forEach((req)=>{
            hideUserFromFeed.add(req.fromUserId.toString())
            hideUserFromFeed.add(req.toUserId.toString())
        })
        const user=await User.find({
            $and :
            [{_id: {$nin : Array.from(hideUserFromFeed)}},{_id:{$ne :loggedInUser._id}}]
        }).select(User_Safe).skip(skip).limit(limit)
        res.json({ user }); 
    }
    catch(err){
        res.status(400).json({message:err.message})
    }
})
module.exports=userRouter