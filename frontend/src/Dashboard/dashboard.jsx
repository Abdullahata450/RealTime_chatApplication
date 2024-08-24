import React, { useEffect, useState } from 'react';
import avatar from "./../assets/user2.svg";
import './dashboard.css'; 
import { Inputchat } from '../components/ui/All-input';

function UserDashBoard() {  
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user:details')) || {});
    const [conversations, setConversations] = useState([]);
    const [message, setMessage] = useState({ message: [], reciver: {} });

    useEffect(() => {
        const loggedinUser = JSON.parse(localStorage.getItem('user:details'));
        if (loggedinUser?.id) {
            const fetchConversations = async () => {
                try {
                    const res = await fetch(`http://localhost:8000/api/conversations/${loggedinUser.id}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });
                    const resData = await res.json();
                    setConversations(resData.data);
                } catch (error) {
                    console.error("Error fetching conversations:", error);
                }
            };
            fetchConversations();
        }
    }, []);

    const fetchMessages = async (conversationId, user) => {
        try {
            const res = await fetch(`http://localhost:8000/api/message/${conversationId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const resData = await res.json();
            setMessage({ message: resData.data || [], reciver: user });
        } catch (error) {
            console.error("Error fetching messages:", error);
        }
    }

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
                        {conversations.length > 0 ?
                        conversations.map((conversation) => (
                            console.log(conversation),
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
                            )) : <p className='text-center text-lg font-bold italic mt-14'>No messages Or Conversation</p>
                        }
                    </div>
                </div>

                <div className='chat-input-container'>
                    <Inputchat />
                    <div className='chat-sendbtn'>
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
            </div>
        </div>
    );
}

export default UserDashBoard;
