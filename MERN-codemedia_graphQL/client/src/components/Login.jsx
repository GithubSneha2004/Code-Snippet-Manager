import React, { useState } from 'react';
import Card from 'react-bootstrap/Card';
import "./main.css"
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useMutation } from '@apollo/client';
import { LOGIN_USER } from '../utils/mutations';
import Auth from '../utils/auth';
import Alert from 'react-bootstrap/Alert';





export default function Login() {
  const [userFormData, setUserFormData] = useState({ email: '', password: '' });
  const [validated] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

const [login, { error, data }] = useMutation(LOGIN_USER);


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
  <Alert variant="danger">
    {error.message}
  </Alert>
)}


<Card className=' col-12 col-md-4  mx-auto login bg-light' style={{marginTop:"10%",borderRadius:"50px"}}>
    <div className="">
    <Card.Body>
      <Card.Title>Login</Card.Title>
      <Card.Text>
     <div className="formlogin ">
     <Form.Group className="mb-3 " controlId="formBasicEmail">
        <Form.Label>Email address</Form.Label>
        <Form.Control type="email" placeholder="Enter email" name ="email" onChange={handleInputChange} />
        <Form.Text className="text-muted">
          We'll never share your email with anyone else.
        </Form.Text>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control type="password" placeholder="Password" name="password" onChange={handleInputChange}/>
      </Form.Group>
    
      <Button variant="primary" type="submit " className='mt-3' onClick={handleFormSubmit}>
        Submit
      </Button>
     <div className='mt-3'>
        dont have an account? <a href="/signup">Sign Up</a>
     </div>
  

     </div>
      </Card.Text>
    </Card.Body>
    </div>
  </Card>
  </>
  )
}
