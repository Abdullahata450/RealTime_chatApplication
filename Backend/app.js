import express from 'express';
import dotenv from 'dotenv';
import ConnectDB from './Database/DB-Connection.js';
import {User} from './models/Users.models.js';
import { Conversation } from './models/conversation.models.js';
import {Messages} from './models/messeges.models.js'
import { ApiError } from './utils/ApiErrorResponse.js';
import bscript from 'bcrypt'
import { ApiResponse } from './utils/ApiResponse.js';
import jwt from 'jsonwebtoken';
import cors from 'cors';

dotenv.config(
    {path: './.env'}
);
const app=express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());


let port = process.env.PORT || 3000;
app.get('/', (req, res) => {
    res.send("Hello World How are u")
})

app.post('/api/register', async (req,res,next)=>{

     try{
         const {fullname, email, password} = req.body;
         if(!(fullname && email && password ))
        {
             res.json(
                new ApiError(201, "All fields are required", ["All fields are required"])
            )
        }else{
            const alreadyExist = await User.findOne({email});
            if (alreadyExist){
                 res.json(
                    new ApiError(200, alreadyExist, "User Already Exists")
                )
            }else{
                const newUser= new User({
                    fullname,
                    email,
                })
                bscript.hash(password,10,async(err,hasedPassword)=>{
                    newUser.set({password:hasedPassword})
                    newUser.save();
                    next();
                })
                 res.json(
                    new ApiResponse(200, newUser, "User Registered Successfully")
                )
            }
        }
     }
     catch(error){
        throw new ApiError(500, error.message);
     }
})

app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!(email && password)) {
            return res.status(400).json(
                new ApiError(400, "All fields are required", ["All fields are required"])
            );
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json(
                new ApiError(404, "User Not Found", ["User Not Found"])
            );
        }

        const isMatch = await bscript.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json(
                new ApiError(401, "Incorrect password", ["Incorrect password"])
            );
        }

        const payload = {
            Userid: user._id,
            email: user.email
        };

        const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

        jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: '24h' }, async (err, token) => {
            if (err) {
                return res.status(500).json(
                    new ApiError(500, "Error signing token", [err.message])
                );
            }

            await User.updateOne({ _id: user._id }, { $set: { token } });

             return res.status(200).json(new  ApiResponse(200, { user: { email: user.email, fullname: user.fullname }, token }, "User Logged In Successfully"));

            // return res.json({ user: { email: user.email, fullname: user.fullname }, token });
        });

    } catch (error) {
        return res.status(500).json(
            new ApiError(500, error.message, [error.message])
        );
    }
});


app.post('/api/conversations', async (req,res)=>{
    try {
         const {senderId, receiverId} = req.body;
         const newConversation= Conversation({members:[senderId,receiverId]});
         await newConversation.save();
         return res.status(200).json(new ApiResponse(200, newConversation, "Conversation Created Successfully"))

    } catch (error) {
        throw new ApiError(500,error.message,'Error while creating conversation')
    }
})

app.get('/api/conversations/:userId', async (req,res)=>{
    try {
         const userId=req.params.userId;
         const conversations = await Conversation.find({members:{$in:[userId]}});
         const conversationUsersData= await Promise.all(conversations.map(async (conversation)=>{
             const receiverId = conversation.members.find((member)=>member!==userId);
             const user= await User.findById(receiverId);
             return {user:{fullname:user.fullname, email:user.email}, conversationId:conversation._id};
             
         }))
         return  res.status(200).json(new ApiResponse(200,  conversationUsersData, "Conversation Data Fetched Successfully"))

    } catch (error) {
        throw new ApiError(500,"Error while fetching conversation")
    }
})

app.post('/api/message', async (req,res)=>{
    try {
        const {conversationId,senderId,message,receiverId=''}= req.body;

        if(!senderId || !message) return res.status(200).json(new ApiResponse(200, null, "All fields are required"));


        if(!conversationId && receiverId){
            const newConservation = new Conversation({members:[senderId,receiverId]});
            await newConservation.save();
            const newMessag= new Messages({conversationId:newConservation._id,senderId,message});
            await newMessag.save();
            return res.status(200).json(new ApiResponse(200, newMessag, "Message Sent Successfully"))
        }else if(!conversationId && !receiverId){
            return res.status(200).json(new ApiResponse(200, null, "All fields are required"))
        }
        const newMessag = new Messages({conversationId,senderId,message});
        await newMessag.save();
        return res.status(200).json(new ApiResponse(200, newMessag, "Message Sent Successfully"))

    } catch (error) {
        throw new ApiError(500,error.message,'Error while sending message')
    }
})

app.get('/api/message/:conversationId', async (req,res)=>{
     try {
             const conversationId =req.params.conversationId;
             if(conversationId=== 'new') return res.status(200).json([]);

             const messages = await Messages.find({conversationId});
             const messageUserData= await Promise.all(messages.map(async (message)=>{
                 const user= await User.findById(message.senderId);
                 return {user:{fullname:user.fullname, email:user.email}, message:message.message}
             }))
             return res.status(200).json(new ApiResponse(200, messageUserData, "Messages Fetched Successfully"))

     } catch (error) {
        
        throw new ApiError(500,"Error while fetching messages")
     }
})

app.get('/api/users', async (req,res)=>{
    try {
         const users = await User.find().select("-password -token -_id");
         return res.status(200).json(new ApiResponse(200, users, "All Users Fetched Successfully"))
    } catch (error) {
         throw new ApiError(500,"Error while fetching users ")
    }
})

ConnectDB().then(()=>{
    app.listen(port, () => console.log(`Server is Running on ${port}`))
})
