import { Navigate } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import Auth from '../utils/auth';

export default function StudentRedirectRoute({ children }) {
  if (!Auth.loggedIn()) {
    return <Navigate to="/login" />;
  }

  try {
    const token = localStorage.getItem('id_token');
    const decoded = jwtDecode(token);
    const role = decoded?.data?.role;

    if (role === 'student') {
      return <Navigate to="/join" />;
    }

    return children;
  } catch (err) {
    console.error('Token decode error:', err);
    return <Navigate to="/login" />;
  }
}
