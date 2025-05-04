// frontend/src/components/RestaurantCard.jsx
import React from 'react'
import { Link } from 'react-router-dom'

export default function RestaurantCard({ restaurant }) {
  return (
    <div className="card h-100">
      {restaurant.image ? (
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="card-img-top"
          style={{ objectFit: 'cover', height: '200px' }}
        />
      ) : (
        <div
          className="bg-secondary d-flex align-items-center justify-content-center text-white"
          style={{ height: '200px' }}
        >
          No Image
        </div>
      )}

      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{restaurant.name}</h5>
        <div className="mt-auto">
          <Link
            to={`/restaurants/${restaurant.id}`}
            className="btn btn-outline-primary w-100"
          >
            View Menu
          </Link>
        </div>
      </div>
    </div>
  )
}
