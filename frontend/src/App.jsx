import React, { useContext } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Restaurants from './pages/Restaurants'
import RestaurantDetail from './pages/RestaurantDetail'
import Register from './pages/Register'
import { AuthContext } from './AuthContext'
import Header from './components/Header'

function App() {
  const { token } = useContext(AuthContext);

  return (
    <>
    <Header />
    <Routes>
      {/* Public: Login */}
      <Route path="/" element={<Restaurants />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/restaurants/:id" element={<RestaurantDetail />} />

      {/* Protected routes */}
      {token ? (
        <>
          <Route path="/orders"       element={<Orders />} />
        </>
      ) : (
        // redirect all other paths to /login
        <Route path="*" element={<Navigate to="/" replace />} />
      )}
    </Routes>
    </>
    
  );
}

export default App
