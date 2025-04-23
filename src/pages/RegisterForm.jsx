import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Card, Spinner} from 'react-bootstrap';
import axios from 'axios';
import ToastAlert from '../components/ToastAlert'
const API_URL = process.env.REACT_APP_API_URL;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const RegisterForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    user_stream: '',
    contact_number: '',
    university: '',
    year_of_study: ''
  });

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  const tostTrigger = (message, type)=>{
    setToast({ show: true, message: message, type: type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  }
  const handleValidation = ()=>{
    let valid = true
    if(formData.name === ''){
        alert("Please enter Full Name")
        valid = false
    } else if(formData.email === ''){
        alert("Please enter Email")
        valid = false
    } else if(!emailRegex.test(formData.email)){
        alert("Please enter a valid email address.");
        valid = false
    } else if(formData.password === ''){
        alert("Please enter Password")
        valid = false
    } else if(formData.user_stream === ''){
        alert("Please enter Stream")
        valid = false
    } else if(formData.contact_number === ''){
        alert("Please enter Contact Number")
        valid = false
    } else if(formData.university === ''){
        alert("Please enter University")
        valid = false
    } else if(formData.year_of_study === ''){
        alert("Please enter Year of study")
        valid = false
    }
    return valid
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if(handleValidation){
        try {
            const response = await axios.post(`${API_URL}/register-single-student`, formData);
            console.log("Success:", response.data);
            tostTrigger(response?.data?.message,response?.status ===200 ? 'success':  'danger')
            setLoading(false);
          } catch (error) {
            setLoading(false);
            if(error?.response?.data?.detail !== '' ){
                tostTrigger(error.response.data.detail,'danger')
            } else {
                console.error("Registration failed:", error);
                tostTrigger("Error during registration. Please try again.",'danger')
            }
          }
    }
  };

  return (
    <Container className="py-5">
    { toast?.show && <ToastAlert show={toast.show}  setShow={setToast} message={toast.message} variant={toast.type} />}
      <Card className="p-4 shadow rounded-4" style={{ maxWidth: '700px', margin: '0 auto' }}>
        <h2 className="text-center mb-3">Registration Form</h2>
        <p className="text-center text-muted mb-4">Fill out the form carefully for registration. All Fields are mandatory!!</p>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Full Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="e.g John Davis"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="custom-placeholder"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="ex: myname@example.com"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="custom-placeholder"
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="custom-placeholder"
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Stream</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="(e.g., Bsc Computer science)"
                  name="user_stream"
                  value={formData.user_stream}
                  onChange={handleChange}
                  className="custom-placeholder"
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Contact Number</Form.Label>
                <Form.Control
                  type="text"
                  name="contact_number"
                  value={formData.contact_number}
                  onChange={handleChange}
                  placeholder="+91 9995553331"
                  className="custom-placeholder"
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>University</Form.Label>
                <Form.Control
                  type="text"
                  name="university"
                  value={formData.university}
                  onChange={handleChange}
                  placeholder="(e.g., Manglore)"
                  className="custom-placeholder"
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-4">
                <Form.Label>Year of Study</Form.Label>
                <Form.Control
                  type="text"
                  name="year_of_study"
                  value={formData.year_of_study}
                  onChange={handleChange}
                  placeholder="(e.g., 2013-2016)"
                  className="custom-placeholder"
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <div className="text-center">
            <Button type="submit" className="px-5 rounded-pill" variant="success" disabled={loading}>
            {loading ? (
                <>
                <Spinner size="sm" animation="border" className="me-2" />
                Submitting...
                </>
            ) : (
                "Submit"
            )}
            </Button>
          </div>
        </Form>
      </Card>
    </Container>
  );
};

export default RegisterForm;
