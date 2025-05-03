import React, { useContext } from 'react'
import { Link, useNavigate }   from 'react-router-dom'
import { AuthContext }         from '../AuthContext'

export default function Header() {
  const { token, role, username, logout } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const userSection = !token ? (
    <Link to="/login" className="btn btn-outline-light me-2">
      Sign In
    </Link>
  ) : (
    <div className="d-flex align-items-center">
      <span className="text-light me-2">
        {role === 'restaurant_owner' ? '🏬' : '🙋'} {username}
      </span>
      <button
        className="btn btn-outline-light btn-sm"
        onClick={handleLogout}
      >
        Log Out
      </button>
    </div>
  )

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">
        <Link className="navbar-brand" to="/">
          BentoBox Clone
        </Link>
        <div className="d-flex">
          {userSection}
        </div>
      </div>
    </nav>
  )
}
