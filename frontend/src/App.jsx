
import './App.css'
import { Form } from './modules/forms'
import UserDashBoard from './Dashboard/dashboard'
import { Routes, Route ,Navigate } from 'react-router-dom'

const ProtectedRoutes= ({children}) =>{
 const isLoggedIn = localStorage.getItem('user:token')!==null || true;      

 if(!isLoggedIn){
  return <Navigate to={'users/signin'}/>
 }
//  else if(isLoggedIn && ['/users/signin', '/users/signup'].includes(window.location.pathname)){
//   return <Navigate to={'/'}/>
//  }

 return children;
}

function App() {

  return (
        <Routes>
           <Route path='/' element={
           <ProtectedRoutes>
            <UserDashBoard></UserDashBoard>
           </ProtectedRoutes>
           }/>
           <Route path='/users/signin' element={
            <ProtectedRoutes>
              <Form isSignin={true}/>
            </ProtectedRoutes>
           }/>
            <Route path='/users/signup' element={
            <ProtectedRoutes>
              <Form isSignin={false}/>
            </ProtectedRoutes>
           }/>
        </Routes>

  )
}

export default App
