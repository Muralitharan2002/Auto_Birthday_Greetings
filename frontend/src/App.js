import React, { createContext, useState } from 'react';
import './Style/style.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { ToastContainer, Bounce } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css';

import Signup from './Pages/Signup';
import Home from './Pages/Home';
import AddReminder from './Components/AddReminder';
import TodayEvents from './Components/TodayEvents';
import Upcoming from './Components/Upcoming';
import Intro from './Components/Intro';
import Login from './Pages/Login';
import Greets from './Pages/Greets';

export const AuthUserContext = createContext();

function App() {
  const LoginStatus = sessionStorage.getItem("login") === "true"

  const [login, setLogin] = useState(LoginStatus);
  const [token, setToken] = useState(sessionStorage.getItem("userToken"));

  const toggleLogin = (token) => {
    setToken(token)
    sessionStorage.setItem("userToken", token)
    setLogin(true)
    sessionStorage.setItem("login", true)
  }
  return (
    <>
      <AuthUserContext.Provider value={{ login, setLogin, token, toggleLogin }}>
        <Router>
          <Routes>
            <Route path='/' element={<Login />} />
            <Route path='/signup' element={<Signup />} />
            <Route path='/home' element={login ? <Home /> : <Navigate to={"/"} />}>
              <Route path='/home' element={<Intro />} />
              <Route path='add_events' element={<AddReminder />} />
              <Route path='today_events' element={<TodayEvents />} />
              <Route path='upcoming' element={<Upcoming />} />
            </Route>
            <Route path='/greetings/:name/:_id/:_idO' element={<Greets />} />
          </Routes>
        </Router>
      </AuthUserContext.Provider>
      <ToastContainer
        position='top-right'
        autoClose={2000}
        pauseOnFocusLoss={false}
        pauseOnHover={false}
        draggable={false}
        transition={Bounce}
      />
    </>
  );
}

export default App;
