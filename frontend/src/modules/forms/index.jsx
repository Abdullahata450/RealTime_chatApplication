import React, { useState } from 'react'
import { InputWithEmailLabel, InputWithNameLabel, InputWithPasswrodLabel } from '@/components/ui/All-input'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom';

function Form({ isSignin = false }) {
  const [data, setData] = useState({
    ...(isSignin ? {} : { fullName: "" }),
    email: "",
    password: "",
  });

  const navigate=useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isSignin && !data.fullName) {
      alert("Full Name is required!");
      return;
    }
    if (!data.email && !data.email.contains("@")) {
      alert("Email is required!");
      return;
    }
    if (!data.password) {
      alert("Password is required!");
      return;
    }

    console.log("Form data:", data);

  };

  return (
    <div className='bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-screen flex items-center justify-center'>

    <form onSubmit={handleSubmit} className='backdrop-blur bg-white/40 border w-[500px] h-[600px] shadow-xl rounded-lg justify-center items-center flex flex-col'>
      <div className='text-center font-bold text-4xl mb-3'>
        Welcome {isSignin && 'Back'}
      </div>
      <div className='font-light text-xl mb-5'>
        {isSignin ? "Sign in To Get Started" : "Register now To Get Started"}
      </div>
      <div className='mb-2 w-1/2'>
        {!isSignin && (
          <InputWithNameLabel
            value={data.fullName}
            onChange={(e) => setData({ ...data, fullName: e.target.value })}
          />
        )}
        <InputWithEmailLabel
          value={data.email}
          onChange={(e) => setData({ ...data, email: e.target.value })}
        />
        <InputWithPasswrodLabel
          value={data.password}
          onChange={(e) => setData({ ...data, password: e.target.value })}
        />
      </div>
      <div className='w-1/2 flex flex-col py-2'>
        <Button type="submit">{isSignin ? "Sign in" : "Register"}</Button>
      </div>
      <div>
        {isSignin
          ? "Didn't have an account."
          : "Already have an account?"}{" "}
        <span className='cursor-pointer text-blue-950 underline' onClick={()=>{navigate(`${isSignin ? '/users/signup' : '/users/signin'}`)}}>
          {isSignin ? "Sign in" : "Sign up"}
        </span>
      </div>
    </form>
    </div>

  )
}

export { Form }
