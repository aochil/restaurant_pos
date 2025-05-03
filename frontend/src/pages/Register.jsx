import React, { useState, useContext } from 'react'
import { useNavigate, Link }     from 'react-router-dom'
import { AuthContext }           from '../AuthContext'

export default function Register() {
  const navigate = useNavigate()
  const { register } = useContext(AuthContext)

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole]         = useState('customer')
  const [error, setError]       = useState(null)

  const handleSubmit = async e => {
    e.preventDefault()
    setError(null)
    try {
      await register(username, password, role)
      navigate('/')  // after signup + auto-login, go home
    } catch (err) {
      setError(err.response?.data || 'Registration failed')
    }
  }

  return (
    <div className="container mt-5" style={{ maxWidth: 400 }}>
      <h2 className="mb-4">Sign Up</h2>
      <form onSubmit={handleSubmit}>
        {error && <div className="alert alert-danger">{JSON.stringify(error)}</div>}

        <div className="mb-3">
          <label className="form-label">Username</label>
          <input
            className="form-control"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Role</label>
          <select
            className="form-select"
            value={role}
            onChange={e => setRole(e.target.value)}
          >
            <option value="customer">Customer</option>
            <option value="restaurant_owner">Restaurant Owner</option>
          </select>
        </div>

        <button type="submit" className="btn btn-primary w-100">Register</button>
      </form>

      <p className="mt-3 text-center">
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </div>
  )
}
