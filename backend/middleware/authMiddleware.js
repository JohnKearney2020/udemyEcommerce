import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';

const protect = asyncHandler(async(req, res, next) => {
  let token;
  //we set up an authorization header key with a value in Postman
  if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
    try {
      //token is of the format 'Bearer 234sdhsladgj...' see the split below for just the token
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // console.log(decoded);
      //Get user info minus the password field
      req.user = await User.findById(decoded.id).select('-password');
      // console.log('req.user:');
      // console.log(req.user);
      next(); //send the req.user data to ANY protected route that we want
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  };

  if(!token){
    res.status(401);
    throw new Error('Not authorized, no token');
  }
  // next();
});

const admin = (req, res, next) => {
  if(req.user && req.user.isAdmin){
    next();
  } else {
    res.status(401);
    throw new Error('Not authorized as an admin');
  }
}
export { protect, admin };