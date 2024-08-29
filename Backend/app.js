import express from 'express';
import dotenv from 'dotenv';
import ConnectDB from './Database/DB-Connection.js';
import {User} from './models/Users.models.js';
import { Conversation } from './models/conversation.models.js';
import {Messages} from './models/messeges.models.js'
import { ApiError } from './utils/ApiErrorResponse.js';
import bcrypt from 'bcrypt'
import { ApiResponse } from './utils/ApiResponse.js';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import http from 'http';
import {Server} from 'socket.io';




dotenv.config(
    {path: './.env'}
);
const app=express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({
    origin: 'http://localhost:5173' // Your frontend URL
}));


// socket.io
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST']
    }
});

let users=[];
io.on('connection', (socket) => {
    console.log('A user connected');

    // Add a user to the list when they connect
    socket.on('addUser', (userId) => {
        // Remove the user if they are already in the list (to avoid duplicates)
        users = users.filter(user => user.userId !== userId);
        // Add or update the user's socket ID
        users.push({ userId, socketId: socket.id });
        // Notify all clients about the updated user list
        io.emit('getUser', users);
    });

    // Handle sending a message
    socket.on('sendMessage', async ({ senderId, reciverId, message, conversationId }) => {
        try {
            // Find the receiver and sender in the users list
            const receiver = users.find(user => user.userId === reciverId);
            const sender = users.find(user => user.userId === senderId);
            const senderUser = await User.findById(senderId);

            // Save the message to the database or other persistence method
            // Example: Save the message to the database here

            const messageData = {
                senderId,
                message,
                conversationId,
                reciverId,
                user: { id: senderUser._id, fullname: senderUser.fullname, email: senderUser.email },
            };

            if (receiver) {
                // Receiver is active, send the message to the receiver
                io.to(receiver.socketId).emit('getMessage', messageData);
            }
            // Always send the message to the sender for local echo
            if (sender) {
                io.to(sender.socketId).emit('getMessage', messageData);
            }

            // If the receiver is not active, you may choose to handle offline message storage here
        } catch (error) {
            console.error('Error sending message:', error);
        }
    });

    // Handle user disconnection
    socket.on('disconnect', () => {
        console.log('A user disconnected');
        // Remove the user from the list on disconnect
        users = users.filter(user => user.socketId !== socket.id);
        // Notify all clients about the updated user list
        io.emit('getUser', users);
    });
});



server.listen(8081, () => {
    console.log('Socket Server running on port 8081');
});

let port = process.env.PORT || 3000;
app.get('/', (req, res) => {
    res.send("Hello World How are u")
})

app.post('/api/register', async (req, res, next) => {
    try {
      const { fullname, email, password } = req.body;
  
      if (!(fullname && email && password)) {
        return res.status(400).json(
          new ApiError(400, "All fields are required", ["All fields are required"])
        );
      }
  
      const alreadyExist = await User.findOne({ email });
      if (alreadyExist) {
        return res.status(409).json(
          new ApiError(409, "User Already Exists", ["User Already Exists"])
        );
      }
  
      const newUser = new User({
        fullname,
        email,
      });
  
      bcrypt.hash(password, 10, async (err, hashedPassword) => {
        if (err) {
          return next(new ApiError(500, "Error hashing password"));
        }
  
        newUser.set({ password: hashedPassword });
        await newUser.save();
  
        return res.status(201).json(
          new ApiResponse(201, newUser, "User Registered Successfully")
        );
      });
  
    } catch (error) {
      next(new ApiError(500, error.message));
    }
  });
  
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
        const isMatch = await bcrypt.compare(password, user.password);
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

             return res.status(200).json(new  ApiResponse(200, { user: { id: user._id, email: user.email, fullname: user.fullname }, token }, "User Logged In Successfully"));

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
             const receiverId = conversation.members.find((member)=>member.toString()!==userId);
             const user= await User.findById(receiverId);
             return {user:{receiverId:user._id ,fullname:user.fullname, email:user.email}, conversationId:conversation._id};
             
         }))
         return  res.status(200).json(new ApiResponse(200,  conversationUsersData, "Conversation Data Fetched Successfully"))

    } catch (error) {
        throw new ApiError(500,"Error while fetching conversation")
    }
})

app.post('/api/message', async (req, res) => {
    try {
        const { conversationId, senderId, message, receiverId = '' } = req.body;
        console.log("conversationId", conversationId, "senderId", senderId, "message", message, "receiverId", receiverId);  

        if (!senderId || !message) {
            return res.status(400).json(new ApiResponse(400, null, "Sender ID and message are required"));
        }

        if (conversationId === 'new' && receiverId) {
            const newConversation = new Conversation({ members: [senderId, receiverId] });
            const savedConversation = await newConversation.save();
            const newMessage = new Messages({ conversationId: savedConversation._id, senderId, message });
            await newMessage.save();
            return res.status(200).json(new ApiResponse(200, newMessage, "Message Sent Successfully"));

        } else if (!conversationId && !receiverId) {
            return res.status(400).json(new ApiResponse(400, null, "Invalid conversationId or missing receiverId"));

        }
        const newMessage = new Messages({ conversationId, senderId, message });
        await newMessage.save();
        return;

    } catch (error) {
        console.error("Error while sending message:", error);
        return res.status(500).json(new ApiResponse(500, null, 'Error while sending message'));
    }
});

app.get('/api/message/:conversationId', async (req, res) => {
    try {
        // Function to fetch messages and user data
        const fetchMessages = async (conversationId) => {
            const messages = await Messages.find({ conversationId });
            if (messages.length === 0) {
                return res.status(404).json(new ApiResponse(404, null, "No messages found for this conversation"));
            }

            const messageUserData = await Promise.all(messages.map(async (message) => {
                const user = await User.findById(message.senderId);
                return { user: { id: user._id, fullname: user.fullname, email: user.email }, message: message.message };
            }));
            return res.status(200).json(new ApiResponse(200, messageUserData, "Messages Fetched Successfully"));
        };

        const conversationId = req.params.conversationId;

        if (conversationId === 'new') {
            const { senderId, receiverId } = req.query;

            if (!senderId || !receiverId) {
                return res.status(400).json(new ApiResponse(400, null, "Sender ID and Receiver ID are required for new conversations"));
            }

            const existingConversation = await Conversation.findOne({
                members: { $all: [senderId, receiverId] }
            });

            if (existingConversation) {
                await fetchMessages(existingConversation._id);
            } else {
                return res.status(200).json([]);
            }
        } else {
            await fetchMessages(conversationId);
        }

    } catch (error) {
        console.error("Error while fetching messages:", error);
        return res.status(500).json(new ApiResponse(500, null, "Error while fetching messages"));
    }
});


app.get('/api/users/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const users = await User.find({ _id: { $ne: userId } });
        const userData = users.map(user => ({
            email: user.email,
            fullname: user.fullname,
            receiverId: user._id
        }));

        return res.status(200).json(new ApiResponse(200, userData, "All Users Fetched Successfully"));
    } catch (error) {
        console.error("Error while fetching users:", error);
        return res.status(500).json(new ApiResponse(500, null, "Error while fetching users"));
    }
});


ConnectDB().then(()=>{
    app.listen(port, () => console.log(`Server is Running on ${port}`))
})