import React from 'react';
import Navbar from './Navbar';
import { Outlet } from 'react-router-dom';

function Layout() {
  return (
    <div>
      <Navbar />
      <Outlet /> {/* This is where the child routes will render */}
    </div>
  );
}
export default Layout;




/* // src/components/Layout.js
import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";

const Layout = ({ children }) => {
  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100">
        <Row className="w-100 justify-content-center">
            <Col md={8}>
            <Card className="shadow p-4">
                <Card.Body>
                    
                    {children}
                </Card.Body>
            </Card>
            </Col>
        </Row>
    </Container>
  );
};

export default Layout;
 */

