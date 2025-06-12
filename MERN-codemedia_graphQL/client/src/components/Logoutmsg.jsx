import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Logoutmsg() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/');
    }, 3000); // redirect after 3 seconds

    return () => clearTimeout(timer); // cleanup
  }, [navigate]);

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card text-center bg-light" style={{ borderRadius: '50px' }}>
            <div className="card-body">
              <h3 className="card-title">Thank you for using the app!</h3>
              <p className="card-text">You will be redirected to the homepage shortly.</p>
              <Link to="/" className="btn btn-primary">Go Now</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
