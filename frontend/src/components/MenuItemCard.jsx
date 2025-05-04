import React from 'react'
import { useContext } from 'react'
import { CartContext } from '../contexts/CartContext'

export default function MenuItemCard({ item }) {
    const { addItem} = useContext(CartContext)
  return (
    <div className="card h-100">
      {item.image ? (
        <img
          src={item.image}
          className="card-img-top"
          alt={item.name}
          style={{ objectFit: "cover", height: "200px" }}
        />
      ) : (
        <div
          className="bg-secondary d-flex align-items-center justify-content-center text-white"
          style={{ height: "200px" }}
        >
          No Image
        </div>
      )}

      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{item.name}</h5>
        <p className="card-text text-muted mb-2">${item.price}</p>
        <p className="card-text flex-grow-1">{item.description}</p>
        <button
          className="btn btn-primary mt-auto"
          onClick={() => addItem(item)}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
