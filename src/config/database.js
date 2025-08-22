const mongoose=require('mongoose')
const connectDB=async ()=>{
    await mongoose.connect(
        "mongodb+srv://ashokdb:kmpXShGBi5UwOB0t@namastenode.xkfzp5m.mongodb.net/devTinder"
    );
};
module.exports=connectDB;