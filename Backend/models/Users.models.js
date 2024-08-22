import mongoose from "mongoose";

const UserScheme= new mongoose.Schema(
    {
        fullname:{
            type:String,
            required:true,
        },
        email:{
            type:String,
            required:true,
            unique:true,
        },
        password:{
            type:String,
            required:true,
        },
        token:{
            type:String
        }
    },
    
    {timestamps:true})

export const User = mongoose.model("User",UserScheme)