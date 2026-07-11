import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import API, { persistAuthToken } from '../services/api';

export default function Login() {
  //console.log(process.env, "process.env");
  //console.log(API_URL, "URL")
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const userCategory = localStorage.getItem('user_type');
  useEffect(()=>{
    if(userCategory !== '' &&  userCategory !== null){
      handleLoggedUser(userCategory)
    }
  },[userCategory])

  const handleLoggedUser= (user_type)=>{
    if (user_type === 'admin') {
      navigate('/admin');
    } else {
      navigate('/instructions');
    }
  }
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true)
    try {
      const response = await API.post('/login', {
        email,
        password,
      });

      const payload = response.data || {};
      const token = payload.access_token || payload.token || payload?.data?.token || payload?.data?.access_token;
      const { ID, user_id, user_type, name, user_stream } = payload;

      if (!token) {
        throw new Error('Authentication token missing from server response');
      }

      localStorage.setItem('user_id', user_id);
      localStorage.setItem('user_type', user_type);
      localStorage.setItem('name', name);
      localStorage.setItem('ID', ID);
      localStorage.setItem('user_stream', user_stream);
      persistAuthToken(token);
      setLoading(false)
      handleLoggedUser(user_type)
    } catch (error) {
      console.log(error)
      setLoading(false)
      if(error?.status === 403){
        alert("You have already completed the exam.");
      } else {
        alert("Invalid credentials. Please check email/password.");
      }
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100">
    <Row className="w-100 justify-content-center">
      <Col md={6} lg={5}>
        <Card className="shadow-lg">
          <Card.Body>
            <h3 className="mb-4 text-center">Sign In</h3>
            <Form onSubmit={handleLogin}>
              <Form.Group className="mb-3">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder=""
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Form.Group>
              <Button disabled={loading} variant="primary" type="submit" className="w-100">
                Login
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  </Container>
  );
}
