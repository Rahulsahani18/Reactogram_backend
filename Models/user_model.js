const mongoose= require('mongoose');

const userSchema= new mongoose.Schema({
 fullName:{
    type:String,
    required:true
 },
 email:{
    type:String,
    required:true
 },
 password:{
    type:String,
    required:true
 },
 profileImg:{
    type:String,
    default:"https://media.istockphoto.com/id/1221041044/photo/teenage-girl-at-white-background-stock-images.webp?b=1&s=170667a&w=0&k=20&c=0Gy4mH-Gobn1EeqlVOPicXxWQtl3Y9IhVrumvlxFZKk="
 },
});

 module.exports= mongoose.model('userModel',userSchema);