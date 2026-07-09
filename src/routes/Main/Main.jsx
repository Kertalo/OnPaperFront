import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router";
import Home from '../Home/Home.jsx'
import Game from '../Game/Game.tsx'
import Login from '../Auth/Login.jsx'
import Register from '../Auth/Register.jsx'
import { SignalRProvider } from '../../models/SignalRContext.tsx'
import './Main.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <SignalRProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/game/:gameId" element={<Game />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </SignalRProvider>
    </BrowserRouter>
  </StrictMode>
)
