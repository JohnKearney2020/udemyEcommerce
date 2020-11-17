import { createStore, combineReducers, applyMiddleware } from 'redux'; //applyMiddleware is needed for Thunk
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import { 
  productListReducer, 
  productDetailsReducer, 
  productDeleteReducer, 
  productCreateReducer, 
  productUpdateReducer,
  productReviewCreateReducer,
  productTopRatedReducer 
} from './reducers/productReducers';

import { cartReducer } from './reducers/cartReducers';

import { 
  userLoginReducer, 
  userRegisterReducer, 
  userDetailsReducer,
  userUpdateProfileReducer,
  userListReducer,
  userDeleteReducer,
  userUpdateReducer
} from './reducers/userReducers';

import { 
  orderCreateReducer, 
  orderDetailsReducer, 
  orderPayReducer,
  orderDeliverReducer, 
  orderListMyReducer, 
  orderAdminGetAllReducer
} from './reducers/orderReducers';

const reducer = combineReducers({
  productList: productListReducer,
  productDetails: productDetailsReducer,
  productDelete: productDeleteReducer,
  productCreate: productCreateReducer,
  productUpdate: productUpdateReducer,
  productReviewCreate: productReviewCreateReducer,
  productTopRated: productTopRatedReducer,
  cart: cartReducer,
  userLogin: userLoginReducer,
  userRegister: userRegisterReducer,
  userDetails: userDetailsReducer,
  userUpdateProfile: userUpdateProfileReducer,
  userList: userListReducer,
  userDelete: userDeleteReducer,
  userUpdate: userUpdateReducer,
  orderCreate: orderCreateReducer,
  orderDetails: orderDetailsReducer,
  orderPay: orderPayReducer,
  orderDeliver: orderDeliverReducer,
  orderMyList: orderListMyReducer,
  orderAllAdmin: orderAdminGetAllReducer
});

//Check our local storage for any items in the cart. We need to use JSON.parse() b/c all local storage items are stored as strings
const cartItemsFromStorage = localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')) : [];
//Check local storage to see if a user is logged in
const userInfoFromStorage = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null;
//Check local storage to see if a shipping address is present
const shippingAddressFromStorage = localStorage.getItem('shippingAddress') ? JSON.parse(localStorage.getItem('shippingAddress')) : {};


const initialState = {
  cart: { 
    cartItems: cartItemsFromStorage,
    shippingAddress: shippingAddressFromStorage
  },
  userLogin: { userInfo: userInfoFromStorage }
};

const middleware = [thunk]; //we can put all our redux related middleware in this array

//composeWithDevTools eliminates the need for the line of code we've used on other projects to get the redux dev tools working
const store = createStore(reducer, initialState, composeWithDevTools(applyMiddleware(...middleware)));

export default store;