import React, { useState } from "react";
import Card from "react-bootstrap/Card";
import "./main.css";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useMutation } from "@apollo/client";
import { ADD_USER } from "../utils/mutations";
import Auth from "../utils/auth";
import Alert from "react-bootstrap/Alert";
import { Eye, EyeOff, Check, X } from "lucide-react";
import { useNavigate } from "react-router-dom";


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
  const navigate = useNavigate();


  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserFormData({ ...userFormData, [name]: value });
  };

  // Password rule checks
  const hasUpperCase = (password) => /[A-Z]/.test(password);
  const hasLowerCase = (password) => /[a-z]/.test(password);
  const hasNumber = (password) => /\d/.test(password);
  const hasSpecialChar = (password) => /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const hasMinLength = (password) => password.length >= 8;

  const allRulesPassed = (password) =>
    hasUpperCase(password) &&
    hasLowerCase(password) &&
    hasNumber(password) &&
    hasSpecialChar(password) &&
    hasMinLength(password);

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    if (userFormData.password !== userFormData.confirmPassword) {
      setShowAlert(true);
      return;
    } else {
      setShowAlert(false);
    }

    if (!allRulesPassed(userFormData.password)) {
      setShowAlert(true);
      return;
    }

    try {
      const { data } = await addUser({
        variables: { ...userFormData },
      });

      Auth.login(data.addUser.token);
      navigate("/dashboard");


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
      {showAlert && (
        <Alert variant="danger">
          {userFormData.password !== userFormData.confirmPassword
            ? "Passwords do not match!"
            : !allRulesPassed(userFormData.password)
            ? "Password does not meet all requirements."
            : error?.message}
        </Alert>
      )}

      <Card
  className="col-12 col-md-4 mx-auto signup glow-box"
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
            Sign Up
          </Card.Title>

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
                  value={userFormData.username}
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
                  value={userFormData.email}
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
                    value={userFormData.password}
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
                    data-testid="password-toggle"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </Button>
                </div>

                {/* Password rules display */}
                <div
                  style={{
                    marginTop: "8px",
                    color: "#27548A",
                    fontSize: "0.9rem",
                    userSelect: "none",
                  }}
                >
                  <div className="d-flex align-items-center mb-1">
                    {hasUpperCase(userFormData.password) ? (
                      <Check color="#4BB543" size={18} />
                    ) : (
                      <X color="#D9534F" size={18} />
                    )}
                    <span style={{ marginLeft: "8px" }}>
                      At least one uppercase letter
                    </span>
                  </div>
                  <div className="d-flex align-items-center mb-1">
                    {hasLowerCase(userFormData.password) ? (
                      <Check color="#4BB543" size={18} />
                    ) : (
                      <X color="#D9534F" size={18} />
                    )}
                    <span style={{ marginLeft: "8px" }}>
                      At least one lowercase letter
                    </span>
                  </div>
                  <div className="d-flex align-items-center mb-1">
                    {hasNumber(userFormData.password) ? (
                      <Check color="#4BB543" size={18} />
                    ) : (
                      <X color="#D9534F" size={18} />
                    )}
                    <span style={{ marginLeft: "8px" }}>At least one digit</span>
                  </div>
                  <div className="d-flex align-items-center mb-1">
                    {hasSpecialChar(userFormData.password) ? (
                      <Check color="#4BB543" size={18} />
                    ) : (
                      <X color="#D9534F" size={18} />
                    )}
                    <span style={{ marginLeft: "8px" }}>
                      At least one special character (!@#$%^&*)
                    </span>
                  </div>
                  <div className="d-flex align-items-center">
                    {hasMinLength(userFormData.password) ? (
                      <Check color="#4BB543" size={18} />
                    ) : (
                      <X color="#D9534F" size={18} />
                    )}
                    <span style={{ marginLeft: "8px" }}>Minimum 8 characters</span>
                  </div>
                </div>
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicConfirmPassword">
                <Form.Label style={{ color: "#27548A" }}>Confirm Password</Form.Label>
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
                    value={userFormData.confirmPassword}
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
                    data-testid="confirm-password-toggle"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </Button>
                </div>
              </Form.Group>

              <Button
                type="submit"
                className="mt-3 w-100"
                style={{
                  backgroundColor: allRulesPassed(userFormData.password)
                    ? "#27548A"
                    : "#999", // disable color if rules not passed
                  borderColor: allRulesPassed(userFormData.password)
                    ? "#27548A"
                    : "#999",
                  color: "#FFF",
                  fontWeight: "500",
                  transition: "background-color 0.3s ease",
                }}
                onMouseOver={(e) => {
                  if (allRulesPassed(userFormData.password)) {
                    e.target.style.backgroundColor = "#183B4E";
                  }
                }}
                onMouseOut={(e) => {
                  if (allRulesPassed(userFormData.password)) {
                    e.target.style.backgroundColor = "#27548A";
                  }
                }}
                disabled={!allRulesPassed(userFormData.password)}
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
        </Card.Body>
      </Card>
    </>
  );
}
