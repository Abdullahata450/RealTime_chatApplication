import mongoose from "mongoose";

const conversationScheme = new mongoose.Schema(
    
    {
         members:{
            type: [mongoose.Schema.Types.ObjectId],
            ref:"User" ,      // it will store to data in array userid which is logged in and other which we are conversating with
            required :true
        },


    },
    {timestamps :true}

)


export const Conversation = mongoose.model("Conversation",conversationScheme)