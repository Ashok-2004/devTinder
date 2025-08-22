const mongoose=require('mongoose');
const validator=require("validator")
const jwt=require('jsonwebtoken')
const bcrypt=require("bcrypt")
const userSchema=mongoose.Schema({
    firstName:{
        type:String,
        minLength:4,
        required:true,
        unique:true,
        maxLength:50,

    },
    lastName:{
        type:String,
    },
    email:{
        type:String,
        unique:true, 
        required:true,
        lowercase:true,
        trim:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Enter Valid Email")
            }
        }
    },
    password:{
        type:String,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Enter strong password")
            }
        }
    },
    age:{
        type:Number,
        min:18 
    },
    gender:{
        type:String,
        enum:{
            values:["male","female","others"],
            message:`{VALUE} is not a valid gender` 
        }
    },
    photoURL:{
        type:String, 
        default:"https://www.pnrao.com/wp-content/uploads/2023/06/dummy-user-male.jpg",
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("Invalid Photo URL : "+value)
            }
        }
    },
    about:{
        type:String,
        default:"it is default about of the user"
    },
    skills:{
        type:[String],
    }
},{timestamps:true});
userSchema.methods.getJWT=async function(){
    const user=this
    const token=await jwt.sign({_id:user._id},"DEV@TINDER790",{expiresIn:"1d"})
    return token
}
userSchema.methods.validatePassword=async function(passwordInputByUser){
    const user=this
    const passwordHash=user.password
    const isPasswordValid=await bcrypt.compare(passwordInputByUser,passwordHash)
    return isPasswordValid
}
module.exports=mongoose.model("User",userSchema);
