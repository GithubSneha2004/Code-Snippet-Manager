import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Auth from '../utils/auth';

export default function Navbarhome() {
  const linkStyle = {
    color: '#EAE4DD',
    transition: 'color 0.3s ease',
    fontWeight: '500',
  };

  const hoverStyle = (e) => e.target.style.color = '#DDA853';
  const outStyle = (e) => e.target.style.color = '#EAE4DD';

  return (
    <Navbar collapseOnSelect expand="lg" style={{ backgroundColor: '#27548A' }}>
      <Container>
        <Navbar.Brand
          href="/"
          style={{
            color: '#DDA853',
            fontWeight: 'bold',
            fontSize: '1.5rem',
            letterSpacing: '1px'
          }}
        >
          Code-Media
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="ms-auto">
            {Auth.loggedIn() ? (
              <>
                <Nav.Link
                  href="/dashboard"
                  style={linkStyle}
                  onMouseOver={hoverStyle}
                  onMouseOut={outStyle}
                >
                  Dashboard
                </Nav.Link>
                <Nav.Link
                  href="/logoutmessage"
                  onClick={Auth.logout}
                  style={linkStyle}
                  onMouseOver={hoverStyle}
                  onMouseOut={outStyle}
                >
                  Logout
                </Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link
                  href="/login"
                  style={linkStyle}
                  onMouseOver={hoverStyle}
                  onMouseOut={outStyle}
                >
                  Login
                </Nav.Link>
                <Nav.Link
                  href="/signup"
                  style={linkStyle}
                  onMouseOver={hoverStyle}
                  onMouseOut={outStyle}
                >
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
