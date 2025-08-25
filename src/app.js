const express=require('express');
const connectDB=require("./config/database")
const app=express();
const cookieParser=require("cookie-parser")
const cors=require('cors')
// app.use(cors({
//     origin: "https://devtinder2.netlify.app/",
//     credentials: true
// }));

app.use(cookieParser())
app.use(express.json());
const authRouter=require('./routes/auth')
const profileRouter=require('./routes/profile')
const requestRouter=require('./routes/request')
const userRouter=require('./routes/user')

app.use('/',authRouter)
app.use('/',profileRouter)
app.use('/',requestRouter)
app.use('/',userRouter)

connectDB()
.then(()=>{
    const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
})
.catch((err)=>{
    console.error("database not connected")
})