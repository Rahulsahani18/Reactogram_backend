const { default: mongoose } = require("mongoose");
const {ObjectId}=mongoose.Schema.Types;

const postSchema= new mongoose.Schema({
    description:{
        type:String,
        required:true
    },
    location:{
        type:String,
        required:true
    },
    Image:{
        type:String,
        required:true
    },
    likes:[
        {
        type:ObjectId,
        ref:'userModel'
        }
    ],
    comments:[
        {
        commentText:String,
        commentBy:{type:ObjectId, ref:'userModel'}
        }
    ],
    author:{
        type:ObjectId,
        ref:'userModel'
    }
})

module.exports= mongoose.model("postModel",postSchema)