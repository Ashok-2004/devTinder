const express=require('express')
const authRouter=express.Router()
const {validateSigUpData}=require('../utils/validation')
const bcrypt=require('bcrypt')
const User=require("../models/user")
const validator=require("validator")
const jwt=require('jsonwebtoken')
const user = require('../models/user')
 
authRouter.post('/signup',async (req,res)=>{
    try{
        validateSigUpData(req)
        const {firstName,lastName,email,password,gender}=req.body
        const passwordHash=await bcrypt.hash(password,10)
        console.log(passwordHash)
        const user=new User({
            firstName,
            lastName,
            email,
            password:passwordHash,
            gender
        });
         const savedUser=await user.save();
         const token=await savedUser.getJWT()
         console.log(token)
         res.cookie("Token",token,{expires:new Date(Date.now()+1*36000000)}) 
         res.json({message:"data saved ",data:savedUser})
    }
    catch(err){
        res.status(400).send("ERROR : "+err.message);
    }
});
authRouter.post('/login',async (req,res)=>{
    try{
        const {email,password}=req.body
        if(!validator.isEmail(email)){
            throw new Error("Enter Valid Email")
        }
        const user=await User.findOne({email:email})
        if(!user){
            throw new Error("invalid cradentials")
        }
        const isPasswordValid=await user.validatePassword(password)
        if(!isPasswordValid){
            throw new Error("invalid cradentials")
        }
        else{
            const token=await user.getJWT()
            console.log(token)
            res.cookie("Token",token,{expires:new Date(Date.now()+1*36000000)}) 
            res.send(user)
        }
    }
    catch(err){
        res.status(400).send("ERROR : "+err.message)
    }
})
authRouter.post('/logout',async (req,res)=>{
    res.cookie('Token',null,{expires:new Date(Date.now())})
    res.send("logout successful")
})
module.exports=authRouter