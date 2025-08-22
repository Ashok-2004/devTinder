const express=require('express')
const profileRouter=express.Router()
const {validateProfileData}=require('../utils/validation')
const validator=require("validator")
const bcrypt=require("bcrypt")
const jwt=require('jsonwebtoken')
const authorised=require('../middlewares/auth')

profileRouter.get('/profile/view',authorised,async (req,res)=>{
    try{
        const user=req.user 
        if(!user){
            throw new Error("User does not exist")
        }
        res.send(user)
        console.log(decode)
        // res.send("cookie")
    }
    catch(err){
        res.status(400).send("ERROR : "+err.message)
    }
})
profileRouter.patch('/profile/edit',authorised,async (req,res)=>{
    try{
        if(!validateProfileData(req)){
            throw new Error("Invalid Edit Request")
        }
        const loggedInUser=req.user
        Object.keys(req.body).forEach(field=>loggedInUser[field]=req.body[field])
        await loggedInUser.save()
        res.json({message:`${loggedInUser.firstName} profile updated successful`,data:loggedInUser})
    }
    catch(err){
        res.status(401).send("ERROR : " + err.message)
    }
})
module.exports=profileRouter