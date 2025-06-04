import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { NavLink } from 'react-router-dom';
import Auth from '../utils/auth';

export default function Navbarhome() {
  const getNavLinkClass = ({ isActive }) =>
    `nav-link px-3 fw-medium text-warning ${isActive ? 'fw-bold text-decoration-underline' : ''}`;

  // Get user data (assuming auth.getProfile() returns decoded token with user info)
  const user = Auth.loggedIn() ? Auth.getProfile().data : null;
  const isStudent = user?.role === 'student';  // adjust 'role' property as per your user object

  return (
    <Navbar collapseOnSelect expand="lg" style={{ backgroundColor: '#27548A' }}>
      <Container>
        <Navbar.Brand
          as={NavLink}
          to="/"
          className="text-warning fw-bold fs-3 text-decoration-none"
        >
          Code-Media
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="ms-auto d-flex align-items-center">
            {Auth.loggedIn() ? (
              <>
                <NavLink to="/dashboard" className={getNavLinkClass}>
                  Dashboard
                </NavLink>
                <NavLink to="/snippets" className={getNavLinkClass}>
                  Snippets
                </NavLink>
                {!isStudent && (
                  <NavLink to="/create-snippet" className={getNavLinkClass}>
                    Create
                  </NavLink>
                )}
                <NavLink to="/profile" className={getNavLinkClass}>
                  Profile
                </NavLink>
                <NavLink to="/logoutmessage" onClick={Auth.logout} className={getNavLinkClass}>
                  Logout
                </NavLink>
              </>
            ) : (
              <>
                <NavLink to="/login" className={getNavLinkClass}>
                  Login
                </NavLink>
                <NavLink to="/signup" className={getNavLinkClass}>
                  Signup
                </NavLink>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
