import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        minlength:6
    },
    profilePic:{
        type:String,
        default:''
    },
    isAdmin:{
        type:Boolean,
        default:false
    },
    fromGoogle:{
        type:Boolean,
        default:false
    }
},
{timestamps: true}
)

export default mongoose.model("User", userSchema)