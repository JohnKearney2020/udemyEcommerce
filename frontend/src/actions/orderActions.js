import axios from 'axios';

import { ORDER_CREATE_REQUEST, ORDER_CREATE_SUCCESS, ORDER_CREATE_FAIL } from '../constants/orderConstants';
import { ORDER_DETAILS_REQUEST, ORDER_DETAILS_SUCCESS, ORDER_DETAILS_FAIL } from '../constants/orderConstants';
import { ORDER_PAY_REQUEST, ORDER_PAY_SUCCESS, ORDER_PAY_FAIL } from '../constants/orderConstants';
import { ORDER_LIST_MY_REQUEST, ORDER_LIST_MY_SUCCESS, ORDER_LIST_MY_FAIL } from '../constants/orderConstants';
import { ORDER_ADMIN_ALL_REQUEST, ORDER_ADMIN_ALL_SUCCESS, ORDER_ADMIN_ALL_FAIL } from '../constants/orderConstants';
import { ORDER_DELIVER_REQUEST, ORDER_DELIVER_SUCCESS, ORDER_DELIVER_FAIL } from '../constants/orderConstants';

// export const ORDER_DELIVER_RESET = 'ORDER_ADMIN_ALL_RESET';


//===============================================
//                  Create a New Order
//===============================================
export const createOrder = (order) => async (dispatch, getState) => {
  console.log(`order in the create order action:`)
  console.log(order)
  try {
    dispatch({
      type: ORDER_CREATE_REQUEST
    })
    //Destructuring - Two Levels Deep - getting userInfo from the global state
    const { userLogin: { userInfo }} = getState();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}` //the JSON Web Token
      }
    }
    console.log('about to get data')
    const { data } = await axios.post(`/api/orders`, order, config);

    dispatch({
      type: ORDER_CREATE_SUCCESS,
      payload: data
    });

  } catch (error) {
    dispatch({
      type: ORDER_CREATE_FAIL,
      payload: error.response && error.response.data.message ? error.response.data.message : error.message
    })
  }
}


//===============================================
//            Get Order Details
//===============================================
export const getOrderDetails = (id) => async (dispatch, getState) => {

  try {
    dispatch({
      type: ORDER_DETAILS_REQUEST
    })
    //Destructuring - Two Levels Deep - getting userInfo from the global state
    const { userLogin: { userInfo }} = getState();

    const config = {
      headers: {
        // Don't need content type on a get request
        // 'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}` //the JSON Web Token
      }
    }
    console.log('about to get data')
    const { data } = await axios.get(`/api/orders/${id}`, config);

    dispatch({
      type: ORDER_DETAILS_SUCCESS,
      payload: data
    });

  } catch (error) {
    dispatch({
      type: ORDER_DETAILS_FAIL,
      payload: error.response && error.response.data.message ? error.response.data.message : error.message
    })
  }
}


//===============================================
//            Pay for Order
//===============================================
export const payOrder = (orderId, paymentResult) => async (dispatch, getState) => {

  try {
    dispatch({
      type: ORDER_PAY_REQUEST
    })
    //Destructuring - Two Levels Deep - getting userInfo from the global state
    const { userLogin: { userInfo }} = getState();

    const config = {
      headers: {
        // Don't need content type on a get request
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}` //the JSON Web Token
      }
    }

    const { data } = await axios.put(`/api/orders/${orderId}/pay`, paymentResult, config);

    dispatch({
      type: ORDER_PAY_SUCCESS,
      payload: data
    });

  } catch (error) {
    dispatch({
      type: ORDER_PAY_FAIL,
      payload: error.response && error.response.data.message ? error.response.data.message : error.message
    })
  }
}


//==============================================================
//            Update Order to Delivered - Admin Only
//==============================================================
export const deliverOrder = (order) => async (dispatch, getState) => {

  try {
    dispatch({
      type: ORDER_DELIVER_REQUEST
    })
    //Destructuring - Two Levels Deep - getting userInfo from the global state
    const { userLogin: { userInfo }} = getState();

    const config = {
      headers: {
        // Don't need content type on a get request
        // 'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}` //the JSON Web Token
      }
    }

    const { data } = await axios.put(`/api/orders/${order._id}/deliver`, {}, config);

    dispatch({
      type: ORDER_DELIVER_SUCCESS,
      payload: data
    });

  } catch (error) {
    dispatch({
      type: ORDER_DELIVER_FAIL,
      payload: error.response && error.response.data.message ? error.response.data.message : error.message
    })
  }
}

//===================================================
//            List a Logged In User's Orders
//===================================================
export const listMyOrders = () => async (dispatch, getState) => {

  try {
    dispatch({
      type: ORDER_LIST_MY_REQUEST
    })
    //Destructuring - Two Levels Deep - getting userInfo from the global state
    const { userLogin: { userInfo }} = getState();

    const config = {
      headers: {
        // Don't need content type on a get request
        // 'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}` //the JSON Web Token
      }
    }

    const { data } = await axios.get(`/api/orders/myorders`, config);

    dispatch({
      type: ORDER_LIST_MY_SUCCESS,
      payload: data
    });

  } catch (error) {
    dispatch({
      type: ORDER_LIST_MY_FAIL,
      payload: error.response && error.response.data.message ? error.response.data.message : error.message
    })
  }
}

//===================================================
//            List all Orders - Admin Only
//===================================================
export const listAllOrders = () => async (dispatch, getState) => {

  try {
    dispatch({
      type: ORDER_ADMIN_ALL_REQUEST
    })
    //Destructuring - Two Levels Deep - getting userInfo from the global state
    const { userLogin: { userInfo }} = getState();

    const config = {
      headers: {
        // Don't need content type on a get request
        // 'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}` //the JSON Web Token
      }
    }

    const { data } = await axios.get(`/api/orders`, config);

    dispatch({
      type: ORDER_ADMIN_ALL_SUCCESS,
      payload: data
    });

  } catch (error) {
    dispatch({
      type: ORDER_ADMIN_ALL_FAIL,
      payload: error.response && error.response.data.message ? error.response.data.message : error.message
    })
  }
}

