import React, { useState } from 'react'
import { InputWithEmailLabel, InputWithNameLabel, InputWithPasswrodLabel } from '@/components/ui/All-input'
import { Button } from '@/components/ui/button'

function Form({ isSignin = false }) {
  const [data, setData] = useState({
    ...(isSignin ? {} : { fullName: "" }),
    email: "",
    password: "",
  });

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
          ? "You already have an account."
          : "Already have an account?"}{" "}
        <span className='cursor-pointer text-blue-950'>
          {isSignin ? null : "Sign in"}
        </span>
      </div>
    </form>
  )
}

export { Form }
