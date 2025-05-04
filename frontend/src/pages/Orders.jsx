// frontend/src/pages/Orders.jsx
import React, { useState, useEffect, useContext } from 'react'
import api from '../api'
import OrderCard from '../components/OrderCard'
import { AuthContext } from '../contexts/AuthContext'

export default function Orders() {
  const [orders, setOrders] = useState(null)
  const [error,  setError]  = useState(null)

const { role } = useContext(AuthContext)

useEffect(() => {
    const endpoint = role === 'customer' ? '/orders/my_orders' : '/orders'
    api.get(endpoint)
        .then(res => setOrders(res.data))
        .catch(err => {
            console.error(err)
            setError('Failed to load orders.')
        })
}, [role])

  const handleStatusChange = (orderId, newStatus) => {
    setOrders(prev =>
      prev.map(o =>
        o.id === orderId
          ? { ...o, status: newStatus }
          : o
      )
    )
  }

  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger">{error}</div>
      </div>
    )
  }

  if (orders === null) {
    return (
      <div className="container mt-4">
        <p>Loading orders…</p>
      </div>
    )
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Orders</h2>
      {orders.length === 0 && (
        <p className="text-muted">No orders found.</p>
      )}
      <div className="row">
        <div className="col-12">

         {orders.map(order => (
           <OrderCard
             key={order.id}
             order={order}
             onStatusChange={handleStatusChange}
           />
        ))}
        </div>
      </div>
    </div>
  )
}
