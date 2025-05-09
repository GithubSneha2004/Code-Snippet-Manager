import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Auth from '../utils/auth';
import auth from '../utils/auth';

export default function Navbarhome() {
  return (
<Navbar collapseOnSelect expand="lg" bg="success" variant="dark" className='text-black'>
  <Navbar.Brand href="/">Code-Media</Navbar.Brand>
  <Navbar.Toggle aria-controls="responsive-navbar-nav" />
  <Navbar.Collapse id="responsive-navbar-nav">
    <Nav className="ms-auto ">
      {auth.loggedIn() ? (
        <>
           <Nav.Link href="/dashboard">Dashboard</Nav.Link>
         <Nav.Link href="/logoutmessage" onClick={Auth.logout}>Logout</Nav.Link>
        </>
      ) : (
        <>
        <Nav.Link href="/login">Login</Nav.Link>
        <Nav.Link href="/signup">Signup</Nav.Link>
          </>
        
      )}
    </Nav>
  </Navbar.Collapse>
</Navbar>


  )
}
