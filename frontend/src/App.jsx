
import './App.css'
import { Form } from './modules/forms'
import UserDashBoard from './Dashboard/dashboard'
function App() {

  return (
    <div className='bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500  h-screen flex items-center justify-center'> 
     {/* <Form/> */}
     <UserDashBoard/>
    </div>
  )
}

export default App
