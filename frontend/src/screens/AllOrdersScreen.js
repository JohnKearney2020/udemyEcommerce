// import React, { useState, useEffect } from 'react';
import React, { useEffect } from 'react';
// import axios from 'axios';
// import { PayPalButton } from 'react-paypal-button-v2';
// import { Link } from 'react-router-dom';
import { Table, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
// import CheckoutSteps from '../components/CheckoutSteps';
import Loader from '../components/Loader';
import { listAllOrders } from '../actions/orderActions';
// import { ORDER_ADMIN_ALL_RESET } from '../constants/orderConstants';

const AllOrdersScreen = ( { history }) => {
  
  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  //Get order details from the global state
  const orderAllAdmin = useSelector(state => state.orderAllAdmin);
  // eslint-disable-next-line
  const { orders, loading, error } = orderAllAdmin; //error gives us a warning even though we use it below



  //Destructuring - Two Levels Deep - getting userInfo from the global state
  // const { userLogin: { userInfo }} = getState();
  // const { allOrders: { _id }}

  // useEffect(() => {
  //   if(!order || order._id !== orderId) {
  //       dispatch(getOrderDetails(orderId))
  //   }
  // }, [dispatch, order, orderId])

  useEffect(() => {
    if(userInfo && userInfo.isAdmin){
      //The next dispatch is necessary otherwise the pay button just keeps refreshing
      // dispatch({ type: ORDER_ADMIN_ALL_RESET });
      dispatch(listAllOrders());      
    } else {
      history.push('/login');
    }
  }, [dispatch, history, userInfo]) //End of useEffect()

  // const deleteHandler = () => {
  //   console.log('delete order');
  // }


  return (
    <>
      <h1>Orders</h1>
      {/* <Row className='align-items-center'>
        <Col>
          <h1>Orders</h1>
        </Col>
      </Row> */}
      {loading ? <Loader /> : error ? <Message variant='danger'>{error}</Message> : (
        <Table striped bordered hover responsive className='table-sm'>
          <thead>
            <tr>
              <th>ID</th>
              <th>USER</th>
              <th>DATE</th>
              <th>TOTAL</th>
              <th>PAID</th>
              <th>DELIVERED</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order._id}>
                {/* <td><Image src={product.image} alt={product.name} className="img-rounded adminProductListImage"/></td> */}
                <td>{order._id}</td>
                <td>{order.user && order.user.name}</td>
                <td>{order.createdAt.substring(0, 10)}</td>
                <td>${order.totalPrice}</td>
                {/* Icon for Paid */}
                {/* <td>{order.isPaid ? (<i className='fas fa-check' style={{color: 'green'}}></i>) 
                  : (<i className='fas fa-times' style={{color: 'red'}}></i>)}
                </td> */}
                {/* Date for paid */}
                <td>{order.isPaid ? (order.paidAt.substring(0, 10)) 
                  : (<i className='fas fa-times' style={{color: 'red'}}></i>)}
                </td>
                {/* Icon for is delivered */}
                {/* <td>{order.isDelivered ? (<i className='fas fa-check' style={{color: 'green'}}></i>) 
                  : (<i className='fas fa-times' style={{color: 'red'}}></i>)}
                </td> */}
                <td>{order.isDelivered ? (order.deliveredAt.substring(0, 10)) 
                  : (<i className='fas fa-times' style={{color: 'red'}}></i>)}
                </td>
                <td>
                  <LinkContainer to={`/order/${order._id}`}>
                    <Button variant='light' className='btn-sm'>
                      {/* <i className='fas fa-edit'></i> */}
                      Details
                    </Button>
                  </LinkContainer>
                  {/* <Button variant='danger' className='btn-sm' onClick={() => deleteHandler(order._id)}>
                    <i className='fas fa-trash'></i>
                  </Button> */}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      {/* {successDelete && <Message variant='success'>User successfully deleted</Message>} */}
    </>
  )
}

export default AllOrdersScreen;
