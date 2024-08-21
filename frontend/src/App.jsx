
import './App.css'
import { Form } from './modules/forms'
import UserDashBoard from './Dashboard/dashboard'
import { Routes, Route } from 'react-router-dom'
function App() {

  return (
        <Routes>
           <Route path='/' element={<UserDashBoard/>}/>
           <Route path='/users/signin' element={<Form isSignin={true}/>}/>
           <Route path='/users/signup' element={<Form isSignin={false}/>}/>
        </Routes>
    // <div className='bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500  h-screen flex items-center justify-center'> 
    //  {/* <Form/> */}
    //  <UserDashBoard/>
    // </div>
  )
}

export default App
