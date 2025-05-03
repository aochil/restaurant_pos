import React, { createContext, useState, useEffect } from 'react'
import api from './api'

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext({
  token: null,
  role: null,
  username: null,
  login: async () => {},
  register: async () => {},
  logout: () => {},
})

export const AuthProvider = ({ children }) => {
  const [token, setToken]       = useState(() => localStorage.getItem('token'))
  const [role, setRole]         = useState(() => localStorage.getItem('role'))
  const [username, setUsername] = useState(() => localStorage.getItem('username'))

  useEffect(() => {
    token
      ? localStorage.setItem('token', token)
      : localStorage.removeItem('token')
  }, [token])

  useEffect(() => {
    role
      ? localStorage.setItem('role', role)
      : localStorage.removeItem('role')
  }, [role])

  useEffect(() => {
    username
      ? localStorage.setItem('username', username)
      : localStorage.removeItem('username')
  }, [username])

  const login = async (user, pass) => {
    const { data } = await api.post('/auth/login/', {
      username: user,
      password: pass
    })
    setToken(data.token)
    setRole(data.role)
    setUsername(user)
  }

  const register = async (user, pass, userRole) => {
    await api.post('/auth/register/', {
      username: user,
      password: pass,
      role:     userRole
    })
    await login(user, pass)
  }

  const logout = () => {
    setToken(null)
    setRole(null)
    setUsername(null)
  }

  return (
    <AuthContext.Provider
      value={{ token, role, username, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  )
}