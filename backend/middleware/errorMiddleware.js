//==========================
//ERROR handling middleware
//==========================

//If we try to go to a route that does not exist:
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
}

//======================================
//Our General Error Handling MiddleWare
//======================================
//Any errors that pop up b/c of express-async-handler will pop up as a message here
//if we want to overwrite the default error handling we need to take in the err parameter
const errorHandler = (err, req, res, next) => {
  //An error can still have a status code of 200 sometimes. 200 normally means good. So we set any errors w/ a status of 200 to 500
  //500 means an error with the server. It could be a lot of different things with a 500
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    //if we are in development mode, include the err.stack information
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
}

export { notFound, errorHandler };