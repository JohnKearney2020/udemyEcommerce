import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

//Here we've destructured children from props, hence no {props.children} below
const FormContainer = ({ children }) => {
  return (
    <Container>
      <Row className='justify-content-md-center'>
        <Col xs={12} md={6}>
          {children}
        </Col>
      </Row>
    </Container>
  )
}

export default FormContainer;
