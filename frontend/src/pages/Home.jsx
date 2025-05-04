// src/pages/Home.jsx

import React, { useContext } from 'react'
import { AuthContext }       from '../contexts/AuthContext'
export default function Home() {
  const { role, logout } = useContext(AuthContext)

  return (
    <div className="container mt-5">
      <div className="card p-4">
        <h1 className="card-title">Welcome!</h1>
        <p className="card-text">
          Your role: <strong>{role}</strong>
        </p>
        <button onClick={logout} className="btn btn-secondary">
          Log Out
        </button>
      </div>
    </div>
  )
}
