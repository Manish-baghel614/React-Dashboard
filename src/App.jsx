import React from 'react'
import Login from './components/Login'
import SignUp from './components/SignUp'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';


const App = () => {

  const user = localStorage.getItem("user");

  return (

    console.log(user),
    
    <BrowserRouter>
      <Routes>
        <Route
         path="/signup"
        element={user ? <Dashboard /> : <SignUp />} />
        <Route 
          path="/login" 
          element={user ? <Dashboard /> : <Login />} />
        <Route path="/dashboard" element={  <Dashboard />  } />  
        {/* Redirect home to signup by default */}
        <Route path="/" element={user ? <Dashboard /> : <Login />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
