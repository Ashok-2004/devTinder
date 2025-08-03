const express=require('express');
const app=express();
app.use('/test',(req,res)=>{
    res.send("hello from server")
})
app.use('/hello',(req,res)=>{
    res.send("Hello Hello hello");
})
app.listen(7777,()=>{
    console.log("server running on port 7777")
});