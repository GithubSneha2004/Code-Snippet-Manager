import React, { useState } from "react";
import Card from "react-bootstrap/Card";
import "./main.css";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useMutation } from "@apollo/client";
import { ADD_USER } from "../utils/mutations";
import Auth from "../utils/auth";
import Alert from "react-bootstrap/Alert";
import { Eye, EyeOff } from "lucide-react";

export default function Signup() {
  const [userFormData, setUserFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [validated] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [addUser, { error }] = useMutation(ADD_USER);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserFormData({ ...userFormData, [name]: value });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    // Optional: Add client-side confirm password match check here if you want

    try {
      const { data } = await addUser({
        variables: { ...userFormData },
      });

      Auth.login(data.addUser.token);

      setUserFormData({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error(error);
      setShowAlert(true);
    }
  };

  return (
    <>
      {showAlert && error && <Alert variant="danger">{error.message}</Alert>}

      <Card
        className="col-12 col-md-4 mx-auto signup"
        style={{
          marginTop: "10%",
          borderRadius: "30px",
          backgroundColor: "#F5EEDC",
          boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Card.Body>
          <Card.Title
            className="text-center mb-4"
            style={{ color: "#27548A", fontWeight: "600" }}
          >
            Sign Up
          </Card.Title>
          <Card.Text>
            <div className="formsignup">
              <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
                <Form.Group className="mb-3" controlId="formBasicUsername">
                  <Form.Label style={{ color: "#27548A" }}>Username</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter username"
                    name="username"
                    onChange={handleInputChange}
                    required
                    style={{
                      borderColor: "#DDA853",
                      backgroundColor: "#FFF",
                      color: "#183B4E",
                    }}
                  />
                </Form.Group>

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
                      color: "#183B4E",
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
                        color: "#183B4E",
                      }}
                    />
                    <Button
                      variant="light"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        marginLeft: "10px",
                        backgroundColor: "#DDA853",
                        border: "none",
                        color: "#183B4E",
                      }}
                      type="button"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </Button>
                  </div>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicConfirmPassword">
                  <Form.Label style={{ color: "#27548A" }}>
                    Confirm Password
                  </Form.Label>
                  <div className="d-flex">
                    <Form.Control
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm Password"
                      name="confirmPassword"
                      onChange={handleInputChange}
                      required
                      style={{
                        borderColor: "#DDA853",
                        backgroundColor: "#FFF",
                        color: "#183B4E",
                      }}
                    />
                    <Button
                      variant="light"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      style={{
                        marginLeft: "10px",
                        backgroundColor: "#DDA853",
                        border: "none",
                        color: "#183B4E",
                      }}
                      type="button"
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </Button>
                  </div>
                </Form.Group>

                <Button
                  type="submit"
                  className="mt-3 w-100"
                  style={{
                    backgroundColor: "#27548A",
                    borderColor: "#27548A",
                    color: "#FFF",
                    fontWeight: "500",
                    transition: "background-color 0.3s ease",
                  }}
                  onMouseOver={(e) => (e.target.style.backgroundColor = "#183B4E")}
                  onMouseOut={(e) => (e.target.style.backgroundColor = "#27548A")}
                >
                  Submit
                </Button>
              </Form>

              <div className="mt-3 text-center">
                <span style={{ color: "#27548A" }}>
                  Already have an account?{" "}
                  <a href="/login" style={{ color: "#DDA853", fontWeight: "500" }}>
                    Login
                  </a>
                </span>
              </div>
            </div>
          </Card.Text>
        </Card.Body>
      </Card>
    </>
  );
}
