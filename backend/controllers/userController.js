import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import generateToken from '../utils/generateToken.js';
import mongoose from 'mongoose'; // for the id varification below

//============================
//    Error Handling
//============================
// Notice that you don't see a bunch of try-catch blocks in our routes. For effenciency and ease-of-use, we instead use a 3rd party
// library called 'express-async-handler' found @ https://www.npmjs.com/package/express-async-handler
// Then we created our own custom error handling middleware. See 'errorMiddleware.js' file in the 'middleware' folder.
// see 'thow New Error()' uses below for how we throw some errors to that custom middleware


// @desc   Auth user & get a token
// @route  POST /api/users/login
// @access Public
const authUser = asyncHandler(async(req, res) => {
  const { email, password } = req.body;
  //findOne finds one document
  const user = await User.findOne({ email: email })
  //Password verification - .matchPassword is a method we created in the userModel.js file (the user model). Alternatively, we could have imported
  //bcrypt and encrypted the password here and compared it to the hash in our database
  if(user && (await user.matchPassword(password))){
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id)
    })
  } else {
    res.status(401); //401 is unauthorized
    throw new Error('Invalid email or password');
  }
});

// @desc   Register a new user
// @route  POST /api/users
// @access Public
const registerUser = asyncHandler(async(req, res) => {
  const { name, email, password } = req.body;
  //findOne finds one document
  const userExists = await User.findOne({ email: email })

  if(userExists){
    res.status(400); //400 is a bad request
    throw new Error('User already exists');
  }
  //calling the .create() method on our User model
  const user = await User.create({
    name, //name: name
    email,
    password //we've set up the user model to encrypt the user password for us automatically when the user is created. See userModel.js
  })

  if(user){
    res.status(201).json({ //201 status means something was created
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id)
    })
  } else {
    res.status(400); //invalid user data
    throw new Error('Invalid user data');
  }
});

// @desc   Get user profile
// @route  GET /api/users/profile
// @access Private
const getUserProfile = asyncHandler(async(req, res) => {
  //Video has us fetch user data again, which seems redundant b/c we've already done it in the auth middleware
  const user = await User.findById(req.user._id);
  if(user){
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin
    })
  } else {
    res.status(404);
    throw new Error('User not found');
  }

  //We could just use the req.user we passed to this controller function with the auth middleware?
  // console.log(req.user)
}); 


// @desc   Update user profile
// @route  PUT /api/users/profile
// @access Private
const updateUserProfile = asyncHandler(async(req, res) => {
  //Video has us fetch user data again, which seems redundant b/c we've already done it in the auth middleware
  const user = await User.findById(req.user._id);
  if(user){
    user.name = req.body.name || user.name; //if they've updated the name, change it, otherwise keep it as is
    user.email = req.body.email || user.email;
    //afaik we use this if block b/c if we did the password like we did name and email above it would unecessarily rehash the password
    if(req.body.password){
      user.password = req.body.password;
    }
    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      token: generateToken(updatedUser._id)
    })
  } else {
    res.status(404);
    throw new Error('User not found');
  }

  //We could just use the req.user we passed to this controller function with the auth middleware?
  // console.log(req.user)
}); 

// @desc   Get all users - Admin only
// @route  GET /api/users/profile
// @access Private/Admin
const getUsers = asyncHandler(async(req, res) => {
  //Video has us fetch user data again, which seems redundant b/c we've already done it in the auth middleware
  const users = await User.find({});
  res.json(users);
}); 

// @desc   Delete a User - Admin only
// @route  GET /api/users/:id
// @access Private/Admin
const deleteUser = asyncHandler(async(req, res) => {
  //Video has us fetch user data again, which seems redundant b/c we've already done it in the auth middleware
  const user = await User.findById(req.params.id);
  if(user){
    await user.remove();
    res.json({ message: 'User removed' })
  } else {
    res.status(404);
    throw new Error('User not found');
  }
}); 


//=============================================================================================================
//                                        Admin User Profile Editing
//=============================================================================================================
// @desc   Get a user by ID - Admin only - used on the user edit screen for the admin
// @route  GET /api/users/:id
// @access Private/Admin
const getUserById = asyncHandler(async(req, res) => {
  //Video has us fetch user data again, which seems redundant b/c we've already done it in the auth middleware
  const user = await User.findById(req.params.id).select('-password');
  if(user){
    res.json(user);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
}); 

// @desc   Update user - Admin only
// @route  PUT /api/users/:id
// @access Private/Admin
const updateUser = asyncHandler(async(req, res) => {

  const user = await User.findById(req.params.id);

  if(user){
    user.name = req.body.name || user.name; //if they've updated the name, change it, otherwise keep it as is
    user.email = req.body.email || user.email;
    // user.isAdmin = req.body.isAdmin;
    // see https://www.udemy.com/course/mern-ecommerce/learn/lecture/22497796#questions/12750139 for more info on below
    user.isAdmin = req.body.isAdmin === undefined ? user.isAdmin : req.body.isAdmin

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    })
  } else {
    res.status(404);
    throw new Error('User not found');
  }

  //We could just use the req.user we passed to this controller function with the auth middleware?
  // console.log(req.user)
}); 

export { authUser, registerUser, getUserProfile, updateUserProfile, getUsers, deleteUser, getUserById, updateUser }