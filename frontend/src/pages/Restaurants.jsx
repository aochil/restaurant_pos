import React, { useEffect, useState } from 'react'
import api from '../api'
import RestaurantCard from '../components/RestaurantCard'

export default function Restaurants() {
  const [list, setList] = useState([])

  useEffect(() => {
    api.get('/restaurants/')
       .then(res => setList(res.data))
       .catch(console.error)
  }, [])

  return (
    <div className="container mt-4">
      <h2>Local Restaurants</h2>
      <div className="row">
        {list.map((r) => (
          <div key={r.id} className="col-md-4 mb-3">
            <RestaurantCard restaurant={r} />
          </div>
        ))}
        {list.length === 0 && (
          <p className="text-muted">No restaurants available.</p>
        )}
      </div>
    </div>
  );
}
