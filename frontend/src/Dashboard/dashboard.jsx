import React from 'react'
import avatar from "./../assets/users.jpg"

function UserDashBoard() {
  return (
    <div className='w-screen flex'>
        <div className='w-[25%] border border-black h-screen bg-slate-100'>
         <div className='flex justify-center items-center'>
            <img src={avatar} alt="" width={75} height={75} rounded-sm/>
            <div className='ml-4'>
                <h2 className='text-2xl'>Abdullah</h2>
                <p className='text-lg'>My account</p>
            </div>

         </div>
        </div>

        <div className='w-[50%] border border-black h-screen'></div>
        <div className='w-[25%] border border-black h-screen'></div>
    </div>
  )
}

export default UserDashBoard
