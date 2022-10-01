import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    userId:{
        type:String,
        required:true,
    },
    title:{
        type:String,
        required:true,
    },
    desc:{
        type:String,
        required:true,
    },
    photo:{
        type:String,
        required:false,
    },
    categories:{
        type:[String],
        default:[]
    },
    views:{
        type:Number,
        default:0
    },
    likedBy:{
        type:[String],
        default:[]
    },
    dislikedBy:{
        type:[String],
        default:[]
    }
},
{timestamps: true}
)

export default mongoose.model("Post", postSchema)