const jwt=require("jsonwebtoken")
const User=require('../models/user')
const authorised=async(req,res,next)=>{
    try{
        const {Token}=req.cookies
        if(!Token){
            return res.status(401).send("please login")
        }
        const decode=await jwt.verify(Token,"DEV@TINDER790");
        console.log(decode)
        const user=await User.findById(decode)
        if(!user){
            throw new Error("User not found")
        }
        req.user=user
        next() 
    }
    catch(err){
        res.status(400).send("ERROR : " + err.message)
    }
}
module.exports=authorised