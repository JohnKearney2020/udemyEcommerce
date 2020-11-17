import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PayPalButton } from 'react-paypal-button-v2';
import { Link } from 'react-router-dom';
import { Row, Col, ListGroup, Card, Image, Button} from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
// import CheckoutSteps from '../components/CheckoutSteps';
import Loader from '../components/Loader';
import { getOrderDetails, payOrder, deliverOrder } from '../actions/orderActions';
import { ORDER_PAY_RESET, ORDER_DELIVER_RESET } from '../constants/orderConstants';

const OrderScreen = ( { match, history }) => {
  const orderId = match.params.id;

  const [sdkReady, setSdkReady] = useState(false);

  const dispatch = useDispatch();

  //Get order details from the global state
  const orderDetails = useSelector(state => state.orderDetails);
  // eslint-disable-next-line
  const { order, loading, error } = orderDetails; //error gives us a warning even though we use it below

  //Get User Info from the global state
  const userLogin = useSelector(state => state.userLogin);
  const { userInfo } = userLogin;
  
  const orderDeliver = useSelector(state => state.orderDeliver);
  const { loading:loadingDeliver, success:successDeliver } = orderDeliver; //error gives us a warning even though we use it below

  //Get order details from the global state
  const orderPay = useSelector(state => state.orderPay);
  //Below we locally rename the loading and success keys from the global state
  // eslint-disable-next-line
  const { loading:loadingPay, success:successPay } = orderPay; //error gives us a warning even though we use it below

  // useEffect(() => {
  //   if(!order || order._id !== orderId) {
  //       dispatch(getOrderDetails(orderId))
  //   }
  // }, [dispatch, order, orderId]) 
  useEffect(() => {
    // This will kick someone to the login screen if they log out while on the orderScreen. I should see if instead, we could add functionality
    // to the logout that automatically redirects users to the login screen
    if(!userInfo){
      history.push('/login');
    }
    //add the paypal script to the top of the page
    const addPaypalScript = async () => {
      console.log(`add paypal script called`)
      const { data: clientId } =  await axios.get('/api/config/paypal');
      console.log(`client id: ${clientId}`)
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`
      script.async = true;
      //Update the local state to show the script has been loaded
      script.onload = () => {
        console.log('sdk ready set to true with script onload')
        setSdkReady(true);
      }
      //Mount the script onto the body of the page
      document.body.appendChild(script);
    }
    //Call the addPaypalScript function so the script gets added to the page
    // addPaypalScript();

    //This will load the order again, but this time it should be paid OR it will load the order is it hasn't been loaded at all yet.
    //orderId comes from the url, order._id comes from the global state.
    if(!order || successPay || successDeliver || order._id !== orderId){
      //The next dispatch is necessary otherwise the pay button just keeps refreshing
      dispatch({ type: ORDER_PAY_RESET });
      dispatch({ type: ORDER_DELIVER_RESET });
      dispatch(getOrderDetails(orderId));      
    } else if(!order.isPaid){ //If the order is not yet paid AND we haven't loaded the Paypal script yet, load the script
      if(!window.paypal){
        addPaypalScript();
      } else {
        console.log('sdk ready set to true')
        setSdkReady(true);
      }
    }
  }, [dispatch, orderId, order, successPay, successDeliver, history, userInfo]) //End of useEffect()

  //================================================
  //              Paypal Button Handler
  //================================================
  //paymentResult actually comes from Paypal itself
  const successPaymentHandler = (paymentResult) => {
    console.log(paymentResult);
    dispatch(payOrder(orderId, paymentResult));
  }

  const deliverHandler = () => {
    dispatch(deliverOrder(order));
  }

  return loading ? <Loader /> : error ? <Message variant='danger'>{error}</Message> : (
    <>
      <h1>Order: {order._id}</h1>
      {/* <CheckoutSteps step1 step2 step3 step4 /> */}
      <Row>
        {/* ---------------------------- LEFT SIDE OF SCREEN ---------------------------------------------------*/}
        <Col md={8}>
          <ListGroup variant='flush'>
            {/* Shipping Address */}
            <ListGroup.Item>
              <h2>Shipping</h2>
              <strong className="font-weight-bold">Name: </strong> {order.user.name} <br/>
              <strong className="font-weight-bold">Email: </strong> <a href={`mailto: ${order.user.email}`}>{order.user.email}</a>
              <p>
                <strong>Address: </strong>
                {order.shippingAddress.address},{' '} 
                {order.shippingAddress.city},{' '}{order.shippingAddress.postalCode}{' '}
                {order.shippingAddress.country}
              </p>
              {order.isDelivered ? <Message variant='success'>Delivered on {order.deliveredAt}</Message> : <Message variant='danger'>Not Delivered</Message>}
            </ListGroup.Item>
            {/* Payment Method */}
            <ListGroup.Item>
              <h2>Payment Method</h2>
              <p>
                <strong>Method: </strong>
                {order.paymentMethod}
              </p>
              {order.isPaid ? <Message variant='success'>Paid on {order.paidAt}</Message> : <Message variant='danger'>Not Paid</Message>}
            </ListGroup.Item>
            {/* Order Items */}
            <ListGroup.Item>
              <h2>Order Items</h2>
              {order.orderItems.length === 0 ? <Message>Order is empty</Message>
              : (
                <ListGroup variant='flush'>
                  {order.orderItems.map((item, index) => (
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
                          {item.qty} x ${item.price} = ${item.qty * item.price}
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
                  <Col>${order.itemsPrice}</Col>
                </Row>
              </ListGroup.Item>
              {/* Shipping */}
              <ListGroup.Item>
                <Row>
                  <Col>Shipping</Col>
                  <Col>${order.shippingPrice}</Col>
                </Row>
              </ListGroup.Item>
              {/* Tax Price */}
              <ListGroup.Item>
                <Row>
                  <Col>Tax:</Col>
                  <Col>${order.taxPrice}</Col>
                </Row>
              </ListGroup.Item>
              {/* Total Price */}
              <ListGroup.Item>
                <Row>
                  <Col>Total:</Col>
                  <Col>${order.totalPrice}</Col>
                </Row>
              </ListGroup.Item>
              {/* ====================================== */}
              {/*             Paypal Button              */}
              {/* ====================================== */}
              {!order.isPaid && (
                <ListGroup.Item>
                  {loadingPay && <Loader />}
                  {!sdkReady ? <Loader /> : <PayPalButton amount={order.totalPrice} onSuccess={successPaymentHandler} />}
                </ListGroup.Item>
              )}
              {loadingDeliver && <Loader />}
              {/* NOTE - if we don't check for userInfo first it can give use an error when it checks for userInfo.isAdmin */}
              {/* b/c if userInfo does not exist, i.e. someone logs out from the order screen, userInfo.isAdmin won't exist at all */}
              {/* and it will give use an error */}
              {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
                <ListGroup.Item>
                  <Button type='button' className='btn btn-block' onClick = {deliverHandler}>
                    Mark As Delivered
                  </Button>
                </ListGroup.Item>
              )}
            </ListGroup>
          </Card>
        </Col> {/* End of Col md={4}*/}
      </Row>
    </>
  )
}

export default OrderScreen;
