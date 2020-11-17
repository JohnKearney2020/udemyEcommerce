import React from 'react';
import { Nav } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

import './CheckOutSteps.css';

const CheckoutSteps = ({ step1, step2, step3, step4 }) => {
  return (
    // <Nav className='justify-content-center mb-4'>
    // <Nav className='justify-content-space-around mb-4 mx-auto w-50'>
    <Nav className='justify-content-center mb-4'>
    {/* // <Nav className='justify-content-space-between mb-4'> */}
      {/* Sign In */}
      <Nav.Item className='d-flex align-items-center mr-0'>
        {step1 ? (
            <>
            <LinkContainer to='/login'>
              <Nav.Link className='font-weight-bold'>Sign In</Nav.Link>
            </LinkContainer>
            <i className="fas fa-long-arrow-alt-right"></i>
            </>
        ) : ( 
          <Nav.Link disabled>Sign In</Nav.Link>
        )}
      </Nav.Item>
      {/* Shipping */}
      <Nav.Item className='d-flex align-items-center mr-0'>
        {step2 ? (
          <>
          <LinkContainer to='/shipping'>
            <Nav.Link className='font-weight-bold'>Shipping</Nav.Link>
          </LinkContainer>
          <i className="fas fa-long-arrow-alt-right"></i>
          </>
        ) : (
          <>
            <Nav.Link disabled>Shipping</Nav.Link>
            <i className="fas fa-long-arrow-alt-right arrowDisabled"></i>
          </>
        )}
      </Nav.Item>
      {/* Payment */}
      <Nav.Item className='d-flex align-items-center mr-0'>
        {step3 ? (
          <>
            <LinkContainer to='/payment'>
              <Nav.Link className='font-weight-bold'>Payment</Nav.Link>
            </LinkContainer>
            <i className="fas fa-long-arrow-alt-right"></i>
          </>
        ) : ( 
          <>
            <Nav.Link disabled>Payment</Nav.Link>
            <i className="fas fa-long-arrow-alt-right arrowDisabled"></i>
          </>
        )}
      </Nav.Item>
      {/* Place Order */}
      <Nav.Item className='d-flex align-items-center mr-0'>
        {step4 ? (
          <LinkContainer to='/placeorder'>
            <Nav.Link className='font-weight-bold'>Place Order</Nav.Link>
          </LinkContainer>
        ) : ( 
          <Nav.Link disabled >Place Order</Nav.Link>
        )}
      </Nav.Item>
    </Nav>
  )
}

export default CheckoutSteps;
