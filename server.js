const express=require('express');
const cors=require('cors');
const mongoose = require('mongoose');
const connectDB=require('./config/db')
const userRouter = require('./Routers/user_router');
const postRouter=require('./Routers/post_router');
const uploadRouter=require('./Routers/file_router')

global.__basedir= __dirname;

const PORT=5000;

const app=express();
app.use(cors());
app.use(express.json());

connectDB();

require('./Models/user_model');
require('./Models/post_model');

app.use('/api/users', userRouter);
app.use('/api/posts', postRouter);
app.use('/api/upload', uploadRouter)





app.listen(PORT,()=>{
    console.log(`Server is Runing ${PORT}...`);
})