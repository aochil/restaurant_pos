// frontend/src/components/OrderCard.jsx
import React, { useContext, useState } from 'react'
import { AuthContext }              from '../AuthContext'
import api                          from '../api'
import { format }                   from 'date-fns'

const STATUS_LABELS = {
  P: 'Pending',
  I: 'In Progress',
  C: 'Completed'
}

const BADGE_CLASSES = {
  P: 'badge bg-secondary',
  I: 'badge bg-warning text-dark',
  C: 'badge bg-success'
}

export default function OrderCard({ order, onStatusChange }) {
  const { role } = useContext(AuthContext)
  const [status, setStatus] = useState(order.status)
  const [loading, setLoading] = useState(false)
  const isCustomer = role === 'customer'

  const handleChange = async e => {
    const newStatus = e.target.value
    setLoading(true)
    try {
      await api.patch(`/orders/${order.id}/`, { status: newStatus })
      setStatus(newStatus)
      onStatusChange(order.id, newStatus)
    } catch (err) {
      console.error(err)
      alert('Failed to update status')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card mb-3">
      <div className="card-header d-flex justify-content-between align-items-center">
        <span>
          Order #{order.id}
          {isCustomer && order.restaurant_name && (
            <>
              {" "}
              — <strong>{order.restaurant_name}</strong>
            </>
          )}
        </span>
        {!isCustomer ? (
          <select
            className="form-select form-select-sm w-auto"
            value={status}
            onChange={handleChange}
            disabled={loading}
          >
            <option value="P">Pending</option>
            <option value="I">In Progress</option>
            <option value="C">Completed</option>
          </select>
        ) : (
          <span className={BADGE_CLASSES[status]}>{STATUS_LABELS[status]}</span>
        )}
      </div>
      <div className="card-body">
        <p className="mb-2 text-muted">
          Placed on {format(new Date(order.created_at), "PPPpp")}
          {!isCustomer && ` by: ${order.customer}`}
        </p>
        <ul className="list-group list-group-flush mb-3">
          {order.items.map((item) => (
            <li
              key={item.id}
              className="list-group-item d-flex justify-content-between"
            >
              <span>
                {item.quantity} × {item.menu_item.name}
              </span>
              <strong>${item.total_price}</strong>
            </li>
          ))}
        </ul>
        <div className="d-flex justify-content-end">
          <strong>Total: ${order.total_amount}</strong>
        </div>
      </div>
    </div>
  );
}
