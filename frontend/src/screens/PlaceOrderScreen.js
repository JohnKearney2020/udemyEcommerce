import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button, Row, Col, ListGroup, Card, Image } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import CheckoutSteps from '../components/CheckoutSteps';
import { createOrder } from '../actions/orderActions';

const PlaceOrderScreen = ( { history }) => {

  const cart = useSelector(state => state.cart);
  const dispatch = useDispatch();

  const addDecimals = (num) => {
    return (Math.round(num*100) / 100).toFixed(2);
  }

  //Calculate Prices
  cart.itemsPrice = addDecimals(cart.cartItems.reduce((acc, item) => acc + item.price*item.qty, 0));
  cart.shippingPrice = addDecimals(cart.itemsPrice > 100 ? 0 : 100);
  cart.taxPrice = addDecimals(Number((0.15*cart.itemsPrice)));
  cart.totalPrice = addDecimals(Number(cart.itemsPrice) + Number(cart.shippingPrice) + Number(cart.taxPrice));

  const orderCreate = useSelector(state => state.orderCreate);
  // eslint-disable-next-line
  const { order, success, error } = orderCreate; //error gives us a warning even though we use it below

  const placeOrderHandler = () => {
    // console.log(`place order button clicked!`);
    dispatch(createOrder({
      orderItems: cart.cartItems,
      shippingAddress: cart.shippingAddress,
      paymentMethod: cart.paymentMethod,
      itemsPrice: cart.itemsPrice,
      shippingPrice: cart.shippingPrice,
      taxPrice: cart.taxPrice,
      totalPrice: cart.totalPrice
    }))
  }

  useEffect(() => {
    if(success) {
      //Give the success message time to display. It displays right above the submit button
      setTimeout(() => {
        history.push(`/order/${order._id}`);
      }, 1500);
    }
    //w/o the line below we will get warnings about order._id, which doesn't exist until an order is placed
    //eslint-disable-next-line
  }, [history, success])

  return (
    <>
      <CheckoutSteps step1 step2 step3 step4 />
      <Row>
        {/* ---------------------------- LEFT SIDE OF SCREEN ---------------------------------------------------*/}
        <Col md={8}>
          <ListGroup variant='flush'>
            {/* Shipping Address */}
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>Address: </strong>
                {cart.shippingAddress.address},{' '} 
                {cart.shippingAddress.city},{' '}{cart.shippingAddress.postalCode}{' '}
                {cart.shippingAddress.country}
              </p>
            </ListGroup.Item>
            {/* Payment Method */}
            <ListGroup.Item>
              <h2>Payment Method</h2>
              <p>
                <strong>Method: </strong>
                {cart.paymentMethod}
              </p>
            </ListGroup.Item>
            {/* Order Items */}
            <ListGroup.Item>
              <h2>Order Items</h2>
              {cart.cartItems.length === 0 ? <Message>Your cart is empty</Message>
              : (
                <ListGroup variant='flush'>
                  {cart.cartItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col md={1}>
                          <Image src={item.image} alt={item.name} fluid rounded />
                        </Col>
                        <Col>
                          <Link to={`/product/${item.product}`}>
                              {item.name}
                          </Link>
                        </Col>
                        <Col md={4}>
                          {item.qty} x ${item.price} = ${addDecimals(item.qty * item.price)}
                        </Col>
                      </Row>
                    </ListGroup.Item>))
                  }
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        {/* ---------------------------- RIGHT SIDE OF SCREEN ---------------------------------------------------*/}
        <Col md={4}>
          <Card>
            <ListGroup variant='flush'>
              <ListGroup.Item>
                <h2>Order Summary</h2>
              </ListGroup.Item>
              {/* Items */}
              <ListGroup.Item>
                <Row>
                  <Col>Items</Col>
                  <Col>${cart.itemsPrice}</Col>
                </Row>
              </ListGroup.Item>
              {/* Shipping */}
              <ListGroup.Item>
                <Row>
                  <Col>Shipping</Col>
                  <Col>${cart.shippingPrice}</Col>
                </Row>
              </ListGroup.Item>
              {/* Tax Price */}
              <ListGroup.Item>
                <Row>
                  <Col>Tax:</Col>
                  <Col>${cart.taxPrice}</Col>
                </Row>
              </ListGroup.Item>
              {/* Total Price */}
              <ListGroup.Item>
                <Row>
                  <Col>Total:</Col>
                  <Col>${cart.totalPrice}</Col>
                </Row>
              </ListGroup.Item>
              {/* { error && (
                <ListGroup.Item>
                  <Message variant='danger'>{error}</Message>
                </ListGroup.Item>)
              } */}
              {/* { success && (
                <ListGroup.Item>
                  <Message variant='success'>Order Successfully Submitted!</Message>
                </ListGroup.Item>)
              } */}
              <ListGroup.Item>
                {/* { error && <Message variant='danger'>{error}</Message> } */}
                { success && <Message variant='success'>Order Successfully Submitted!</Message> }
              </ListGroup.Item>
              <ListGroup.Item>
                <Button type='button' className='btn-block' disabled={cart.cartItems === 0} onClick={placeOrderHandler}>
                  Place Order
                </Button>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col> {/* End of Col md={4}*/}
      </Row>
    </>
  )
}

export default PlaceOrderScreen;
