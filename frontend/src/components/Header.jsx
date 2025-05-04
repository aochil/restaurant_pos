// src/components/Header.jsx
import React, { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext }       from '../AuthContext'

export default function Header() {
  const { token, role, username, logout } = useContext(AuthContext)
  const navigate = useNavigate()
  const isOwner = role === 'restaurant_owner'
  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">
        <Link className="navbar-brand" to="/">
          BentoBox Clone
        </Link>

        <div className="d-flex align-items-center">

          {/* User dropdown (or Sign In) */}
          {!token ? (
            <Link to="/login" className="btn btn-outline-light me-2">
              Sign In
            </Link>
          ) : (
            <div className="dropdown">
              <button
                className="btn btn-outline-light dropdown-toggle"
                type="button"
                id="userMenuButton"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                {role === 'restaurant_owner' ? '🏬' : '🙋'} {username}
              </button>
              <ul
                className="dropdown-menu dropdown-menu-end"
                aria-labelledby="userMenuButton"
              >
                <li>
                  <Link className="dropdown-item" to="/orders">
                    {isOwner ? '📦 Orders' : '🛍️ My Orders'}
                  </Link>
                </li>
                <li><hr className="dropdown-divider" /></li>
                <li>
                  <button
                    className="dropdown-item text-danger"
                    onClick={handleLogout}
                  >
                    🚪 Log Out
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
