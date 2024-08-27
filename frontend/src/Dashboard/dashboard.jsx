import React, { useEffect, useState,useRef  } from 'react';
import avatar from "./../assets/users.jpg";
import './dashboard.css';
import { Inputchat } from '../components/ui/All-input';
import { io } from "socket.io-client";


function UserDashBoard() {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user:details')) || {});
    const [conversations, setConversations] = useState([]);
    const [message, setMessage] = useState({ message: [], reciver: {}, conversationId: "" });
    const [newMessage, setNewMessage] = useState(""); // For handling new message input
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [socket,setSocket] = useState(null);  
    const inputRef = useRef(null);
      
    console.log(message,"message");

    useEffect(() => {
        const socketInstance = io('http://localhost:8081');
        setSocket(socketInstance);

        return () => {
            socketInstance.disconnect();
        };
    }, []);

    useEffect(() => {
        if (socket) {
            socket.emit('addUser', user?.id);

            socket.on('getUser', (users) => {
                console.log("Active Users", users);
                setUsers(users);
            });
            socket?.on('getMessage',data =>{
                console.log("message Data",data);
                setMessage(prev=>({
                    ...prev,
                    message:[...prev.message,{user:data.user,message:data.message}],
                }))

            })
        }
        return () => {
            if (socket) {
                socket.off('getUser');
            }
        };
    }, [socket, user]);

    useEffect(() => {
        const fetchAllUsersAndConversations = async () => {
            try {
                const loggedinUser = JSON.parse(localStorage.getItem('user:details'));
                
                if (loggedinUser?.id) {
                    // Fetch Conversations
                    const conversationsRes = await fetch(`http://localhost:8000/api/conversations/${loggedinUser.id}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });
                    const conversationsData = await conversationsRes.json();
                    setConversations(conversationsData.data);
                    
                    // Extract user IDs from conversations
                    const conversationUserIds = conversationsData.data.map(convo => convo.user.receiverId);
                    // console.log(conversationUserIds);
                    
                    // Fetch All Users
                    const usersRes = await fetch(`http://localhost:8000/api/users/${loggedinUser.id}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });
                    const usersData = await usersRes.json();
                    setUsers(usersData.data);
                    
                    // Filter out users who are already in conversations
                    const uniqueUsers = usersData.data.filter(user => !conversationUserIds.includes(user.receiverId));
                    // console.log(uniqueUsers);
                    setFilteredUsers(uniqueUsers);
                }
            } catch (error) {
                console.error("Error fetching users or conversations:", error);
            }
        };

        fetchAllUsersAndConversations();
    }, []);

    const fetchMessages = async (conversationId, reciver) => {
        try {
            const res = await fetch(`http://localhost:8000/api/message/${conversationId}?senderId=${user?.id}&&receiverId=${reciver?.receiverId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const resData = await res.json();
            setMessage({ message: resData.data, reciver, conversationId });
        } catch (error) {
            console.error("Error fetching messages:", error);
        }
    };

    const sendMessage = async () => {
        try {
            socket?.emit('sendMessage', {
                senderId: user?.id,
                reciverId: message?.reciver?.receiverId,
                conversationId: message?.conversationId,
                message: newMessage,
            })
            setNewMessage("");
            const res = await fetch('http://localhost:8000/api/message', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    conversationId: message?.conversationId,
                    senderId: user?.id,
                    message: newMessage,
                    receiverId: message?.reciver?.receiverId,
                    
                }),
                
            });

        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    return (
        <div className='main-section'>
            {/* Sidebar */}
            <div className='sidebar-container'>
                <div className='user-info'>
                    <img
                        className='avatar-image'
                        src={avatar}
                        alt="User Avatar"
                    />
                    <div className='ml-4'>
                        <h2 className='user-name'>{user.fullname || 'User Name'}</h2>
                        <p className='user-account'>My account</p>
                    </div>
                </div>
                <hr className='border-gray-400' />
                <div className='message-section'>
                    <div className='message-title'>Messages</div>
                    <div className='message-list'>
                        {
                            conversations.length > 0 ?
                                conversations.map((conversation) => (
                                    <div key={conversation.conversationId} className='message-item cursor-pointer' onClick={() => fetchMessages(conversation.conversationId, conversation.user)}>
                                        <img
                                            className='message-avatar'
                                            src={avatar}
                                            alt={conversation.user.fullname || 'User Avatar'}
                                        />
                                        <div className='ml-4'>
                                            <h2 className='message-name'>{conversation.user.fullname || 'User Name'}</h2>
                                            <p className='message-status'>{conversation.user.email || 'No Email'}</p>
                                        </div>
                                    </div>
                                )) :
                                <p className='text-center text-lg font-bold italic mt-14'>No conversations found</p>
                        }
                    </div>
                </div>
            </div>

            {/* Chat Window */}
            <div className='chat-container'>
                {
                    message?.reciver?.fullname &&
                    <div className='chat-header'>
                        <img className='chat-avatar' src={avatar} alt="Contact Avatar" />
                        <div className='chat-title'>
                            <h2 className='text-md md:text-lg'>{message.reciver.fullname || 'Contact Name'}</h2>
                            <p className='chat-status'>{message.reciver.email || 'No Email'}</p>
                        </div>
                        <div className='cursor-pointer'>
                            <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.25} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-phone-outgoing">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                <path d="M5 4h4l2 5l-2.5 1.5a11 11 0 0 0 5 5l1.5 -2.5l5 2v4a2 2 0 0 1 -2 2c-8.072 -.49 -14.51 -6.928 -15 -15a2 2 0 0 1 2 -2" />
                                <path d="M15 5h6" />
                                <path d="M18.5 7.5l2.5 -2.5l-2.5 -2.5" />
                            </svg>
                        </div>
                    </div>
                }
                <div className='chat-body'>
                    <div className='chat-section'>
                        {
                            message?.message?.length > 0 ?
                                message.message.map(({ message, user: { id } = {} }, index) => (
                                    <div key={index} className={id === user?.id ? 'chat-message-sent' : 'chat-message-received'}>
                                        {message}
                                    </div>
                                )) : <p className='text-center text-lg font-bold italic mt-14'>{`No messages Or Conversation with  ${message.reciver.fullname}`}</p>
                        }
                    </div>
                </div>
                {
                    message?.reciver?.fullname &&
                    <div className='chat-input-container '>
                        <Inputchat value={newMessage} onChange={(e) => setNewMessage(e.target.value)} />
                        <div className='chat-sendbtn ' onClick={sendMessage}>
                            <svg xmlns="http://www.w3.org/2000/svg" width={25} height={25} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.25} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-brand-telegram">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                <path d="M15 10l-4 4l6 6l4 -16l-18 7l4 2l2 6l3 -4" />
                            </svg>
                        </div>
                        <div className='chat-senditemsbtn'>
                            <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.25} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-circle-plus">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                <path d="M9 12h6" />
                                <path d="M12 9v6" />
                            </svg>
                        </div>
                    </div>
                }
            </div>

            <div className='w-[25%] h-screen bg-slate-300'>
                <div className='message-title '>People May You Know</div>
                <div className='message-list px-3 h-[90vh]'>
                    {
                        filteredUsers.length > 0 ?
                            filteredUsers.map((user) => (
                                <div key={user.receiverId} className='message-item cursor-pointer' onClick={() => fetchMessages('new', user)}>
                                    <img
                                        className='message-avatar'
                                        src={avatar}
                                        alt={user.fullname || 'User Avatar'}
                                    />
                                    <div className='ml-4'>
                                        <h2 className='message-name'>{user.fullname || 'User Name'}</h2>
                                        <p className='message-status'>{user.email || 'No Email'}</p>
                                    </div>
                                </div>
                            )) :
                            <div className='text-center mt-14'>
                                <p className='text-lg font-bold italic'>No Accounts Avaliable </p>
                                <a href="https://github.com/Abdullahata450/RealTime_chatApplication.git" target="_blank" rel="noopener noreferrer" className='text-blue-500 hover:underline' onClick={() => {
                                    navigator.clipboard.writeText('https://github.com/Abdullahata450/RealTime_chatApplication.git');
                                    alert('Link Copied to Clipboard. Share it with your friends to invite them.');
                                }}>Invite People</a>
                            </div>
                    }
                </div>
            </div>
        </div>
    );
}

export default UserDashBoard;
