import React, { useContext } from 'react'
import { CartContext } from '../contexts/CartContext'
import api             from '../api'
import { useNavigate } from 'react-router-dom'

export default function Cart() {
  const {
    cart,
    addItem,
    removeItem,
    removeAllItem,
    updateItem,
    clearCart,
    totalPrice
  } = useContext(CartContext)
  const navigate = useNavigate()

  const handleCheckout = async () => {
    const payload = {
      items: cart.map(ci => ({
        menu_item_id: ci.menu_item.id,
        quantity:     ci.quantity
      }))
    }
    try {
      await api.post('/orders/', payload)
      alert('Order placed!')
      clearCart()
      navigate('/orders')
    } catch (err) {
      console.error(err)
      alert('Checkout failed')
    }
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Your Cart</h2>
      {cart.length === 0 ? (
        <p className="text-muted">Your cart is empty.</p>
      ) : (
        <>
          <ul className="list-group mb-3">
            {cart.map(ci => (
              <li
                key={ci.menu_item.id}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <div>
                  <strong>{ci.menu_item.name}</strong>
                </div>
                <div className="d-flex align-items-center">
                  {/* Decrement */}
                  <button
                    className="btn btn-sm btn-outline-secondary me-2"
                    onClick={() => removeItem(ci.menu_item.id)}
                  >
                    —
                  </button>

                  {/* Quantity input */}
                  <input
                    type="number"
                    min="1"
                    className="form-control form-control-sm text-center"
                    style={{ width: '60px' }}
                    value={ci.quantity}
                    onChange={e =>
                      updateItem(
                        ci.menu_item.id,
                        parseInt(e.target.value, 10) || 0
                      )
                    }
                  />

                  {/* Increment */}
                  <button
                    className="btn btn-sm btn-outline-secondary ms-2 me-3"
                    onClick={() => addItem(ci.menu_item)}
                  >
                    +
                  </button>

                  {/* Line total */}
                  <span className="me-3">
                    ${(ci.menu_item.price * ci.quantity).toFixed(2)}
                  </span>

                  {/* Remove entire */}
                  <button
                    className="btn btn-sm btn-link text-danger"
                    onClick={() => removeAllItem(ci.menu_item.id)}
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className="d-flex justify-content-between align-items-center mb-3">
            <strong>Total: ${totalPrice}</strong>
            <button className="btn btn-success" onClick={handleCheckout}>
              Place Order
            </button>
          </div>
        </>
      )}
    </div>
  )
}
