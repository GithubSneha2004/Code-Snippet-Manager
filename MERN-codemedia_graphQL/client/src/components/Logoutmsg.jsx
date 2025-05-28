import React from 'react'
import { Link } from 'react-router-dom';

export default function Logoutmsg() {
  return (
    <div className="container mt-5">
    <div className="row justify-content-center">
      <div className="col-md-6">
        <div className="card text-center bg-light"style={{borderRadius:"50px"}}>
          <div className="card-body">
            <h3 className="card-title">Thank you for using the app!</h3>
            <p className="card-text">To continue, please log in.</p>
            <Link to="/login" className="btn btn-primary">Log In</Link>
          </div>
        </div>
      </div>
    </div>
  </div>
  )
}
