// frontend/src/pages/RestaurantDetail.jsx
import React, { useEffect, useState } from 'react'
import { useParams }           from 'react-router-dom'
import api                     from '../api'
import MenuItemCard           from '../components/MenuItemCard'

export default function RestaurantDetail() {
  const { id } = useParams()          // 1) pull the :id param
  const [restaurant, setRestaurant] = useState(null)
  const [error, setError]           = useState(null)

  useEffect(() => {
    api.get(`/restaurants/${id}/`)    // 2) fetch the restaurant + its menu_items
       .then(res => setRestaurant(res.data))
       .catch(err => {
         console.error(err)
         setError('Could not load restaurant')
       })
  }, [id])

  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger">{error}</div>
      </div>
    )
  }

  if (!restaurant) {
    return (
      <div className="container mt-4">
        <p>Loading…</p>
      </div>
    )
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-4">{restaurant.name}</h2>
      <div className="row">
        {restaurant.menu_items.map((item) => (
          <div key={item.id} className="col-md-4 mb-3">
            <MenuItemCard item={item} />
          </div>
        ))}
        {restaurant.menu_items.length === 0 && (
          <p className="text-muted">No menu items available.</p>
        )}
      </div>
    </div>
  );
}
