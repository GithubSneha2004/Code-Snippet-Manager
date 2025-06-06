import React, { useState } from 'react';
import Card from 'react-bootstrap/Card';
import "./main.css";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useMutation } from '@apollo/client';
import { LOGIN_USER } from '../utils/mutations';
import Auth from '../utils/auth';
import Alert from 'react-bootstrap/Alert';
import { Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const [userFormData, setUserFormData] = useState({ email: '', password: '' });
  const [validated] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [login, { error }] = useMutation(LOGIN_USER);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserFormData({ ...userFormData, [name]: value });
    if (showAlert) setShowAlert(false); // ✅ Hides alert on input change
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    try {
      const { data } = await login({
        variables: { ...userFormData },
      });

      Auth.login(data.login.token);

      setUserFormData({
        username: '',
        email: '',
        password: '',
      });
    } catch (error) {
      console.error(error);
      setShowAlert(true);
    }
  };

  return (
    <>
      {showAlert && error && (
        <Alert variant="danger">{error.message}</Alert>
      )}

      <Card
  className="col-12 col-md-4 mx-auto login glow-box"
  style={{
    marginTop: "10%",
    borderRadius: "30px",
    backgroundColor: "#F5EEDC",
    boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)",
    position: "relative"
  }}
>

        <Card.Body>
          <Card.Title
            className="text-center mb-4"
            style={{ color: "#27548A", fontWeight: "600" }}
          >
            Login
          </Card.Title>
          <div>
            <div className="formlogin">
              <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label style={{ color: "#27548A" }}>Email address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    name="email"
                    onChange={handleInputChange}
                    required
                    style={{
                      borderColor: "#DDA853",
                      backgroundColor: "#FFF",
                      color: "#183B4E"
                    }}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label style={{ color: "#27548A" }}>Password</Form.Label>
                  <div className="d-flex">
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      name="password"
                      onChange={handleInputChange}
                      required
                      style={{
                        borderColor: "#DDA853",
                        backgroundColor: "#FFF",
                        color: "#183B4E"
                      }}
                    />
                    <Button
                      variant="light"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'} // ✅ Added for accessibility
                      style={{
                        marginLeft: "10px",
                        backgroundColor: "#DDA853",
                        border: "none",
                        color: "#183B4E"
                      }}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </Button>
                  </div>
                </Form.Group>

                <Button
                  type="submit"
                  className='mt-3 w-100'
                  style={{
                    backgroundColor: "#27548A",
                    borderColor: "#27548A",
                    color: "#FFF",
                    fontWeight: "500",
                    transition: "background-color 0.3s ease"
                  }}
                  onMouseOver={(e) => e.target.style.backgroundColor = "#183B4E"}
                  onMouseOut={(e) => e.target.style.backgroundColor = "#27548A"}
                >
                  Submit
                </Button>
              </Form>

              <div className='mt-3 text-center'>
                <span style={{ color: "#27548A" }}>
                  Don't have an account?{' '}
                  <a href="/signup" style={{ color: "#DDA853", fontWeight: "500" }}>
                    Sign Up
                  </a>
                </span>
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>
    </>
  );
}
