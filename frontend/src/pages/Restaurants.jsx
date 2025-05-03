import React, { useEffect, useState } from 'react'
import api from '../api'
import { Link } from 'react-router-dom'

export default function Restaurants() {
  const [list, setList] = useState([])

  useEffect(() => {
    api.get('/restaurants/')
       .then(res => setList(res.data))
       .catch(console.error)
  }, [])

  return (
    <div className="container mt-4">
      <h2>Our Restaurants</h2>
      <div className="row">
        {list.map(r => (
          <div key={r.id} className="col-md-4 mb-3">
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">{r.name}</h5>
                <p className="card-text">Owner: {r.owner}</p>
                <Link
                  to={`/restaurants/${r.id}`}
                  className="btn btn-outline-primary"
                >
                  View Menu
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
