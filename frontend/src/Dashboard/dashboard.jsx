import React from 'react'
import avatar from "./../assets/user2.svg"
import './dashboard.css'; 
import {Inputchat} from '../components/ui/All-input'

function UserDashBoard() {  
    const contacts = [
        { name: "Abdullah", status: "online", avatar: avatar },
        { name: "Ali", status: "online", avatar: avatar },
        { name: "Hamza", status: "online", avatar: avatar },
        { name: "Waqas", status: "online", avatar: avatar },
    ];
    
    return (
        <div className='main-section'>
            {/* Sidebar */}
            <div className='sidebar-container'>
                <div className='user-info'>
                    <img 
                        className='avatar-image ' 
                        src={avatar} 
                        alt="User Avatar" 
                    />
                    <div className='ml-4'>
                        <h2 className='user-name'>Abdullah</h2>
                        <p className='user-account '>My account</p>
                    </div>
                </div>
                <hr className='border-gray-400' />
                <div className='message-section '>
                    <div className='message-title'>Messages</div>
                    <div className='message-list'>
                        {contacts.map(({ avatar, name, status }) => (
                            <div key={name} className='message-item'>
                                <img 
                                    className='message-avatar' 
                                    src={avatar} 
                                    alt={name} 
                                />
                                <div className='ml-4'>
                                    <h2 className='message-name'>{name}</h2>
                                    <p className='message-status'>{status}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Chat Window */}
            <div className='chat-container'>
                <div className='chat-header'>
                    <img className='chat-avatar' src={avatar} alt="Contact Avatar" />
                    <div className='chat-title'>
                        <h2 className='text-md md:text-lg'>Ali</h2>
                        <p className='chat-status'>online</p>
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
                <div className='chat-body'>
                <div className='chat-section'>
                    <div className='chat-message-sent'>
                        hello
                    </div>
                    <div className='chat-message-received'>
                        Hi
                    </div>
                    
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
            <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" />
            <path d="M9 12h6" />
            <path d="M12 9v6" />
            </svg>
            </div>
        </div>
                
           
         </div>

            <div className='w-full md:w-[25%] flex h-full bg-green-200'>
            </div>
        </div>
    );
}

export default UserDashBoard;
