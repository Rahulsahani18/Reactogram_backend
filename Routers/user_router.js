const express=require('express');
const router=express.Router();
const mongoose=require('mongoose');
const bcryptjs= require('bcryptjs');
const jwt=require('jsonwebtoken');
const userModel=require('../Models/user_model');
const JWT_KEY=process.env.JWT_SECRET || "kjagdghkjj6253426nzdgvsdv";


router.post('/signup',(req,res)=>{
  const {fullName, email, password, profileImg }= req.body;
  if(!fullName || !email || !password){
   return res.status(400).json({error:"One or More mandatory field are empty"});
  }
   userModel.findOne({email:email})
   .then((UserInDB)=>{
     if(UserInDB){ 
        return res.status(500).json({error:"User with this email already registered"});
     }
     bcryptjs.hash(password,14)
     .then((hashedPassword)=>{
     const userData= new userModel({fullName, email, password:hashedPassword, profileImg});
     userData.save()
     .then((newUser)=>{
        return res.status(201).json({result:"User signed up successfuly"});
     })
     })
   })
   .catch((err)=>{
    console.log(err)
   })
});

router.post('/login',(req,res)=>{
   const { email, password}= req.body;
   if( !email || !password){
    return res.status(400).json({error:"One or More mandatory field are empty"});
   }
    userModel.findOne({email:email})
    .then((UserInDB)=>{
      if(!UserInDB){ 
         return res.status(500).json({error:"Invalid credential"});
      }
      bcryptjs.compare(password,UserInDB.password)
      .then((didMatch)=>{
       if(didMatch){
         const jwtToken=jwt.sign({_id: UserInDB._id }, JWT_KEY);
         const userInfo={ "id":UserInDB._id, "email":UserInDB.email, "fullName":UserInDB.fullName};
         return res.status(200).json({token:jwtToken ,result:userInfo});
       }else{
         return res.status(401).json({error:"Invalid credential"});
       }
      })
    })
    .catch((err)=>{
     console.log(err)
    })
 });

module.exports= router;
