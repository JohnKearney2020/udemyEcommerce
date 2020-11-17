import axios from 'axios';
import { PRODUCT_LIST_REQUEST, PRODUCT_LIST_SUCCESS, PRODUCT_LIST_FAIL } from '../constants/productConstants.js';
import { PRODUCT_DETAILS_REQUEST, PRODUCT_DETAILS_SUCCESS, PRODUCT_DETAILS_FAIL } from '../constants/productConstants.js';
import { PRODUCT_DELETE_REQUEST, PRODUCT_DELETE_SUCCESS, PRODUCT_DELETE_FAIL } from '../constants/productConstants.js';
import { PRODUCT_CREATE_REQUEST, PRODUCT_CREATE_SUCCESS, PRODUCT_CREATE_FAIL } from '../constants/productConstants.js';
import { PRODUCT_UPDATE_REQUEST, PRODUCT_UPDATE_SUCCESS, PRODUCT_UPDATE_FAIL } from '../constants/productConstants.js';
import { 
  PRODUCT_CREATE_REVIEW_REQUEST, 
  PRODUCT_CREATE_REVIEW_SUCCESS, 
  PRODUCT_CREATE_REVIEW_FAIL,
  PRODUCT_TOP_REQUEST,
  PRODUCT_TOP_SUCCESS,
  PRODUCT_TOP_FAIL
} from '../constants/productConstants.js';


//==========================================================================
//                          Action Creators
//==========================================================================
//think of these as action creators. The reducer contains the actual actions
//we dispatch actions to the reducer

//redux thunk is what allows us to put a function within a function and dispatch asynchronous actions
//Remember below is how you set a default value. We set keyword to be blank by default unless we pass an actual keyword
export const listProducts = (keyword = '', pageNumber = '') => async (dispatch) => {
  try {
    dispatch({type: PRODUCT_LIST_REQUEST}); //this will show loading
    //See productController.js for how we handled passing in a keyword and a page number
    //The first query string starts with '?'. Subsequent query strings after that are concatinated with '&'
    // 'data' includes not just the products, but the 'pages' and the 'page'. See 'productController.js'
    const { data } = await axios.get(`/api/products?keyword=${keyword}&pageNumber=${pageNumber}`); //this will fetch our data from the backend, which pulls it from our database
    dispatch({
      type: PRODUCT_LIST_SUCCESS,
      payload: data //the data we just fetched from the backend
    })
  } catch (error) {
    dispatch({
      type: PRODUCT_LIST_FAIL,
      payload: error.response && error.response.data.message ? error.response.data.message : error.message
    })
  }
}

export const listProductDetails = (id) => async (dispatch) => {
  try {
    dispatch({type: PRODUCT_DETAILS_REQUEST}); //this will show loading
    const { data } = await axios.get(`/api/products/${id}`); //this will fetch our data from the backend, which pulls it from our database
    dispatch({
      type: PRODUCT_DETAILS_SUCCESS,
      payload: data //the data we just fetched from the backend
    })
  } catch (error) {
    dispatch({
      type: PRODUCT_DETAILS_FAIL,
      payload: error.response && error.response.data.message ? error.response.data.message : error.message
    })
  }
}

//=============================================================
//            Delete a Specific Product - Admin Only
//=============================================================
export const deleteProduct = (id) => async (dispatch, getState) => {

  try {
    dispatch({
      type: PRODUCT_DELETE_REQUEST
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

    await axios.delete(`/api/products/${id}`, config);

    dispatch({
      type: PRODUCT_DELETE_SUCCESS
    });

  } catch (error) {
    dispatch({
      type: PRODUCT_DELETE_FAIL,
      payload: error.response && error.response.data.message ? error.response.data.message : error.message
    })
  }
}

//=============================================================
//            Create a Specific Product - Admin Only
//=============================================================
export const createProduct = () => async (dispatch, getState) => {

  try {
    dispatch({
      type: PRODUCT_CREATE_REQUEST
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
    // We are making a POST request, but not actually sending any data, hence the empty object
    const { data } = await axios.post(`/api/products/`, {}, config);

    dispatch({
      type: PRODUCT_CREATE_SUCCESS,
      payload: data
    });

  } catch (error) {
    dispatch({
      type: PRODUCT_CREATE_FAIL,
      payload: error.response && error.response.data.message ? error.response.data.message : error.message
    })
  }
}

//=============================================================
//            Update a Specific Product - Admin Only
//=============================================================
export const updateProduct = (product) => async (dispatch, getState) => {

  try {
    dispatch({
      type: PRODUCT_UPDATE_REQUEST
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

    const { data } = await axios.put(`/api/products/${product._id}`, product, config);

    dispatch({
      type: PRODUCT_UPDATE_SUCCESS,
      payload: data
    });

  } catch (error) {
    dispatch({
      type: PRODUCT_UPDATE_FAIL,
      payload: error.response && error.response.data.message ? error.response.data.message : error.message
    })
  }
}

//=============================================================
//            Create a Review for a product
//=============================================================

export const createProductReview = (productId, review) => async (dispatch, getState) => {

  try {
    dispatch({
      type: PRODUCT_CREATE_REVIEW_REQUEST
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

    await axios.post(`/api/products/${productId}/reviews`, review, config);

    dispatch({
      type: PRODUCT_CREATE_REVIEW_SUCCESS
    });

  } catch (error) {
    dispatch({
      type: PRODUCT_CREATE_REVIEW_FAIL,
      payload: error.response && error.response.data.message ? error.response.data.message : error.message
    })
  }
}

export const listTopProducts = () => async (dispatch) => {
  try {
    dispatch({type: PRODUCT_TOP_REQUEST}); //this will show loading
    const { data } = await axios.get(`/api/products/top`); //this will fetch our data from the backend, which pulls it from our database
    dispatch({
      type: PRODUCT_TOP_SUCCESS,
      payload: data //the data we just fetched from the backend
    })
  } catch (error) {
    dispatch({
      type: PRODUCT_TOP_FAIL,
      payload: error.response && error.response.data.message ? error.response.data.message : error.message
    })
  }
}
