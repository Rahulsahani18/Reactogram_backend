const express=require('express');
const router=express.Router();
const mongoose=require('mongoose');
const bcryptjs= require('bcryptjs');
const jwt=require('jsonwebtoken');
const PostModel=require('../Models/post_model');
const  protectedRout = require('../middleware/protectResource')

router.get('/allposts', (req, res)=>{
   PostModel.find()
   .populate("author", "_id fullName profileImg")
   .populate("comments.commentBy",  "_id fullName")
   .then((dbPosts)=>{
      res.status(200).json({posts: dbPosts})
   })
   .catch((error)=>{
  console.log(error)
   })
})

router.get('/myallposts', protectedRout , (req, res)=>{
   PostModel.find({author: req.user._id})
   .populate("author", "_id fullName profileImg")
   .then((dbPosts)=>{
      res.status(200).json({posts: dbPosts})
   })
   .catch((error)=>{
  console.log(error)
   })
})

router.post("/createpost", protectedRout, (req,res)=>{
   const{description,location,Image}=req.body;
   if(!description || !location || !Image){
    res.status(400).json({error:"One or More mandatory field are empty"});
   }
   req.user.password=undefined
   const PostData= new PostModel({description:description, location:location, Image:Image, author:req.user});
   PostData.save()
   .then((newPost)=>{         
    res.status(201).json({post: newPost});
   })
   .catch((error)=>{
    console.log(error);
   })

})

router.delete('/delete/:postId', protectedRout, async (req, res) => {
   try {
       const postFound = await PostModel.findOne({_id: req.params.postId}).populate("author", "_id");
       if (!postFound) {
           return res.status(400).json({ error: "Post does not exist" });
       }
       if (postFound.author._id.toString() === req.user._id.toString()) {
            await PostModel.deleteOne({ _id: req.params.postId });
           res.status(200).json({ result: "Post deleted successfully" });
       } else {
           res.status(403).json({ error: "You are not authorized to delete this post" });
       }
   } catch (error) {
       console.error("Error deleting post:", error);
       res.status(500).json({ error: "Internal server error" });
   }
});

router.put('/likes', protectedRout, async(req, res)=>{
  const like= await PostModel.findByIdAndUpdate(req.body.postId,{
     $push: {likes: req.user._id} 
   },{
      new: true   // return updated record
   }).populate("author", "_id fullName")
   if(!like){
      return res.status(400).json({ error: "Post does not exist" });
   }
   res.json(like)
})

router.put('/unlikes', protectedRout, async(req, res)=>{
   const result= await PostModel.findByIdAndUpdate(req.body.postId,{
      $pull: {likes: req.user._id} 
    },{
       new: true   // return updated record
    }).populate("author", "_id fullName")
    if(!result){
       return res.status(400).json({ error: "Post does not exist" });
    }
    res.json(result)
 })

 router.put('/comment', protectedRout, async(req, res)=>{
   const comment= {commentText:req.body.commentText, commentBy:req.user};
   const result= await PostModel.findByIdAndUpdate(req.body.postId,{
      $push: {comments: comment} 
    },{
       new: true   // return updated record
    }).populate("author", "_id fullName")
      .populate("comments.commentBy", "_id fullName")
      
    if(!result){
       return res.status(400).json({ error: "Post does not exist" });
    }
    res.json(result)
 })

module.exports=router;

