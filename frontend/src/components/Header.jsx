// frontend/src/components/Header.jsx
import React, { useContext } from 'react'
import { Link, useNavigate }   from 'react-router-dom'
import { AuthContext }         from '../contexts/AuthContext'
import { CartContext }         from '../contexts/CartContext'

export default function Header() {
  const { token, role, username, logout } = useContext(AuthContext)
  const { totalItems }                   = useContext(CartContext)
  const navigate                         = useNavigate()

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
          {token && role === "customer" && (
            <Link
              to="/cart"
              className="btn btn-outline-light position-relative me-2"
            >
              🛒
              {totalItems > 0 && (
                <span
                  className="badge bg-danger rounded-circle position-absolute"
                  style={{ top: "-5px", right: "-10px" }}
                >
                  {totalItems}
                </span>
              )}
            </Link>
          )}

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
                {role === "restaurant_owner" ? "🏬" : "🙋"} {username}
              </button>
              <ul
                className="dropdown-menu dropdown-menu-end"
                aria-labelledby="userMenuButton"
              >
                <li>
                  <Link className="dropdown-item" to="/orders">
                    📋 My Orders
                  </Link>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
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
  );
}
