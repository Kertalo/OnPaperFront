import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router";
import Home from '../Home/Home.jsx'
import Game from '../Game/Game.tsx'
import Login from '../Auth/Login.jsx'
import Register from '../Auth/Register.jsx'
import { SignalRProvider } from '../../models/SignalRContext.tsx'
import './Main.css'

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('Root element not found')
}

createRoot(rootElement).render(
  <SignalRProvider>
    <StrictMode>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/game/:gameId" element={<Game />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </BrowserRouter>
    </StrictMode>
  </SignalRProvider>
)
