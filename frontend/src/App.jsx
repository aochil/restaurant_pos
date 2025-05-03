import React, { useContext } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Home  from './pages/Home'
import Register from './pages/Register'
import { AuthContext } from './AuthContext'

function App() {
  const { token } = useContext(AuthContext);

  return (
    <Routes>
      {/* Public: Login */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Private: everything else */}
      <Route
        path="/*"
        element={token ? <Home /> : <Navigate to="/login" replace />}
      />
    </Routes>
  );
}

export default App
