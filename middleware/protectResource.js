const express=require('express');
const mongoose=require('mongoose');
const bcryptjs= require('bcryptjs');
const jwt=require('jsonwebtoken');
const userModel=require('../Models/user_model');
const JWT_KEY=process.env.JWT_SECRET || "kjagdghkjj6253426nzdgvsdv";


module.exports=(req,res,next)=>{
const{authorization}=req.headers;
if(!authorization){
    res.status(401).json({error:"user not logged in"})
}
const token = authorization.replace("Bearer ", "");
jwt.verify(token, JWT_KEY, (error, payload)=>{
    if(error){
        res.status(401).json({error:"user not logged in"})
    }
    const {_id}=payload;
    userModel.findById(_id)
    .then((dbUser)=>{
        req.user=dbUser;
        next();
    })
    .catch((err) => {
        console.error("Error fetching user:", err);
        res.status(500).json({ error: "Internal server error" });
    });
});
};
