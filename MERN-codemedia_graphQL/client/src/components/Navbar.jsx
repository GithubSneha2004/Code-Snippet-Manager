import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { NavLink, useLocation } from 'react-router-dom';
import Auth from '../utils/auth';

export default function Navbarhome() {
  const location = useLocation();
  //const isRestrictedPage =location.pathname === '/join' || location.pathname.startsWith('/shared');

  const isRestrictedPage =
    location.pathname === '/join' || location.pathname.startsWith('/shared'); // updated

  const getNavLinkClass = ({ isActive }) =>
    `nav-link px-3 py-2 mx-1 rounded-pill fw-medium ${
      isActive ? 'bg-warning text-dark' : 'text-light'
    }`;

  const navLinkStyle = {
    textDecoration: 'none',
    transition: 'all 0.2s ease-in-out',
  };

  const user = Auth.loggedIn() ? Auth.getProfile().data : null;
  const isStudent = user?.role === 'student';

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
                <NavLink to="/dashboard" className={getNavLinkClass} style={navLinkStyle}>
                  Dashboard
                </NavLink>
                <NavLink to="/snippets" className={getNavLinkClass} style={navLinkStyle}>
                  Snippets
                </NavLink>
                {!isStudent && (
                  <NavLink to="/create-snippet" className={getNavLinkClass} style={navLinkStyle}>
                    Create
                  </NavLink>
                )}
                <NavLink to="/profile" className={getNavLinkClass} style={navLinkStyle}>
                  Profile
                </NavLink>
                <NavLink
                  to="/logoutmessage"
                  onClick={Auth.logout}
                  className={getNavLinkClass}
                  style={navLinkStyle}
                >
                  Logout
                </NavLink>
              </>
            ) : !isRestrictedPage && ( // now checks both /join and /shared/*
              <>
                <NavLink to="/login" className={getNavLinkClass} style={navLinkStyle}>
                  Login
                </NavLink>
                <NavLink to="/signup" className={getNavLinkClass} style={navLinkStyle}>
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
