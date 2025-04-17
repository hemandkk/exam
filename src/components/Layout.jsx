// src/components/Layout.js
import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";

const Layout = ({ children }) => {
  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100">
        <Row className="w-100 justify-content-center">
            <Col md={8}>
            <Card className="shadow p-4">
                <Card.Body>
                    {/* You can add a header, sidebar, etc. here */}
                    {children}
                    {/* Optionally add a footer here */}        
                </Card.Body>
            </Card>
            </Col>
        </Row>
    </Container>
  );
};

export default Layout;


