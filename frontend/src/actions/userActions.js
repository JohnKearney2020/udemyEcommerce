import axios from 'axios';
import { 
  USER_LOGIN_REQUEST, 
  USER_LOGIN_SUCCESS, 
  USER_LOGIN_FAIL, 
  USER_LOGOUT,
  USER_REGISTER_REQUEST, 
  USER_REGISTER_SUCCESS, 
  USER_REGISTER_FAIL,
  USER_DETAILS_REQUEST, 
  USER_DETAILS_SUCCESS, 
  USER_DETAILS_FAIL,
  USER_DETAILS_RESET,
  USER_UPDATE_PROFILE_REQUEST, 
  USER_UPDATE_PROFILE_SUCCESS, 
  USER_UPDATE_PROFILE_FAIL,
  USER_UPDATE_PROFILE_RESET_SUCCESS,
  USER_LIST_REQUEST,
  USER_LIST_SUCCESS,
  USER_LIST_FAIL,
  USER_LIST_RESET,
  USER_DELETE_REQUEST,
  USER_DELETE_SUCCESS,
  USER_DELETE_FAIL,
  USER_UPDATE_REQUEST,
  USER_UPDATE_SUCCESS,
  USER_UPDATE_FAIL
} from '../constants/userConstants';
import { ORDER_LIST_MY_RESET } from '../constants/orderConstants'; //For resetting the order list when a user logs out


//===============================================
//                  Login
//===============================================
export const login = (email, password) => async (dispatch) => {
  try {
    dispatch({
      type: USER_LOGIN_REQUEST
    })

    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    }

    const { data } = await axios.post('/api/users/login', { email, password }, config);

    dispatch({
      type: USER_LOGIN_SUCCESS,
      payload: data
    });
    //Save user to local storage
    localStorage.setItem('userInfo', JSON.stringify(data));
  } catch (error) {
    dispatch({
      type: USER_LOGIN_FAIL,
      payload: error.response && error.response.data.message ? error.response.data.message : error.message
    })
  }
}

//===============================================
//                  Register
//===============================================
export const register = (name, email, password) => async (dispatch) => {
  try {
    dispatch({
      type: USER_REGISTER_REQUEST
    })

    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    }
    // IMO it'd make more sense for this to post to 'api/users/register'
    const { data } = await axios.post('/api/users', { name, email, password }, config);

    dispatch({
      type: USER_REGISTER_SUCCESS,
      payload: data
    });

    //If the user registers sucessfully, login the user automatically
    dispatch({
      type: USER_LOGIN_SUCCESS,
      payload: data
    });

    //Save user to local storage
    localStorage.setItem('userInfo', JSON.stringify(data));
  } catch (error) {
    dispatch({
      type: USER_REGISTER_FAIL,
      payload: error.response && error.response.data.message ? error.response.data.message : error.message
    })
  }
}

//===============================================
//                  Get User Details
//===============================================
export const getUserDetails = (id) => async (dispatch, getState) => {
  try {
    dispatch({
      type: USER_DETAILS_REQUEST
    })
    //Destructuring - Two Levels Deep - getting userInfo from the global state
    const { userLogin: { userInfo }} = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}` //the JSON Web Token
      }
    }
    // IMO it'd make more sense for this to post to 'api/users/register'
    const { data } = await axios.get(`/api/users/${id}`, config);

    dispatch({
      type: USER_DETAILS_SUCCESS,
      payload: data
    });
  } catch (error) {
    dispatch({
      type: USER_DETAILS_FAIL,
      payload: error.response && error.response.data.message ? error.response.data.message : error.message
    })
  }
}

//===============================================
//                  Update User Profile
//===============================================
export const updateUserProfile = (user) => async (dispatch, getState) => {
  try {
    dispatch({
      type: USER_UPDATE_PROFILE_REQUEST
    })
    //Destructuring - Two Levels Deep - getting userInfo from the global state
    const { userLogin: { userInfo }} = getState();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}` //the JSON Web Token
      }
    }
    // IMO it'd make more sense for this to post to 'api/users/register'
    const { data } = await axios.put(`/api/users/profile`, user, config);
    console.log(`data after profile update:`);
    console.log(data);
    dispatch({
      type: USER_UPDATE_PROFILE_SUCCESS,
      payload: data
    });
  } catch (error) {
    dispatch({
      type: USER_UPDATE_PROFILE_FAIL,
      payload: error.response && error.response.data.message ? error.response.data.message : error.message
    })
  }
}

export const successReset = () => async (dispatch) => {
  dispatch({
    type: USER_UPDATE_PROFILE_RESET_SUCCESS
  });
}

//===============================================
//                  Logout
//===============================================
export const logout = () => (dispatch) => {
  localStorage.removeItem('userInfo');
  // localeStorage.removeItem('cartItem');
  dispatch({ type: USER_LOGOUT });
  dispatch({ type: USER_DETAILS_RESET });
  dispatch({ type: ORDER_LIST_MY_RESET });
  dispatch({ type: USER_LIST_RESET });
}


//===============================================
//              Get All Users - Admin Only
//===============================================
export const listUsers = () => async (dispatch, getState) => {
  try {
    dispatch({
      type: USER_LIST_REQUEST
    })
    //Destructuring - Two Levels Deep - getting userInfo from the global state
    const { userLogin: { userInfo }} = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}` //the JSON Web Token
      }
    }
    // IMO it'd make more sense for this to post to 'api/users/register'
    const { data } = await axios.get(`/api/users`, config);
    dispatch({
      type: USER_LIST_SUCCESS,
      payload: data
    });
  } catch (error) {
    dispatch({
      type: USER_LIST_FAIL,
      payload: error.response && error.response.data.message ? error.response.data.message : error.message
    })
  }
}


//===============================================
//              Delete a User - Admin Only
//===============================================
export const deleteUser = (id) => async (dispatch, getState) => {
  try {
    dispatch({
      type: USER_DELETE_REQUEST
    })
    //Destructuring - Two Levels Deep - getting userInfo from the global state
    const { userLogin: { userInfo }} = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}` //the JSON Web Token
      }
    }
    // IMO it'd make more sense for this to post to 'api/users/register'
    await axios.delete(`/api/users/${id}`, config);
    dispatch({ type: USER_DELETE_SUCCESS });

  } catch (error) {
    dispatch({
      type: USER_DELETE_FAIL,
      payload: error.response && error.response.data.message ? error.response.data.message : error.message
    })
  }
}


//===============================================
//              Update a User - Admin Only
//===============================================
export const updateUser = (user) => async (dispatch, getState) => {
  try {
    dispatch({
      type: USER_UPDATE_REQUEST
    })
    //Destructuring - Two Levels Deep - getting userInfo from the global state
    const { userLogin: { userInfo }} = getState();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}` //the JSON Web Token
      }
    }
    // IMO it'd make more sense for this to post to 'api/users/register'
    const { data } = await axios.put(`/api/users/${user._id}`, user, config);
    dispatch({ type: USER_UPDATE_SUCCESS });
     //add the just updated user to the global state
    dispatch({ type: USER_DETAILS_SUCCESS, payload: data }); //data is the updated user

  } catch (error) {
    dispatch({
      type: USER_UPDATE_FAIL,
      payload: error.response && error.response.data.message ? error.response.data.message : error.message
    })
  }
}
