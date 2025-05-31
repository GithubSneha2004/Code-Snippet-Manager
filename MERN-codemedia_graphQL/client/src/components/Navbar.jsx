import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { NavLink } from 'react-router-dom';
import Auth from '../utils/auth';

export default function Navbarhome() {
  const getNavLinkClass = ({ isActive }) =>
    `nav-link px-3 fw-medium text-light ${isActive ? 'fw-bold text-warning' : ''}`;

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
          <Nav className="ms-auto">
            {Auth.loggedIn() ? (
              <>
                <Nav.Link as={NavLink} to="/dashboard" className={getNavLinkClass}>
                  Dashboard
                </Nav.Link>
                <Nav.Link as={NavLink} to="/snippets" className={getNavLinkClass}>
                  Snippets
                </Nav.Link>
                <Nav.Link as={NavLink} to="/create-snippet" className={getNavLinkClass}>
                  Create
                </Nav.Link>
                <Nav.Link as={NavLink} to="/profile" className={getNavLinkClass}>
                  Profile
                </Nav.Link>
                <Nav.Link
                  as={NavLink}
                  to="/logoutmessage"
                  onClick={Auth.logout}
                  className={getNavLinkClass}
                >
                  Logout
                </Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link as={NavLink} to="/login" className={getNavLinkClass}>
                  Login
                </Nav.Link>
                <Nav.Link as={NavLink} to="/signup" className={getNavLinkClass}>
                  Signup
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
