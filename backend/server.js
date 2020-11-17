// const express = require('express');
import express from 'express';
// const dotenv = require('dotenv');
import dotenv from 'dotenv';
import path from 'path';
import colors from 'colors';
import morgan from 'morgan';
import connectDB from './config/db.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

// NOTE: the file extension is needed when importing files this way in the backend - not needed on the frontend
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';

dotenv.config();

connectDB(); // connect to our database!

const app = express();
// Run morgan middleware in development mode only
if(process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//===============================================
//         Parse JSON from Body
//===============================================
app.use(express.json()); //this will allow us to accept JSON data in the body


// app.get('/', (req, res) => {
//   res.send('API is running...');
// })

//=====================================================================
//                   Routes - also referred to as endpoints
//=====================================================================
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoutes);
//Get the Paypal Client Id for our business account
app.get('/api/config/paypal', (req, res) => res.send(process.env.PAYPAL_CLIENT_ID))

//=====================================================
//          Set Up the 'uploads' Folder for Use
//=====================================================
// We need to make this a static folder otherwise it won't be accessible
// We need the path module for this, too
// __dirname points to the current directory
//normally, __dirname is not available using ES Modules - the import syntax above - but it is using Common JS - the const require way
//we can get around that using path.resolve()
const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

//=====================================================================
//                   Hosting - Production mode
//=====================================================================
//if we are in production, make the build folder a static folder
if(process.env.NODE_ENV === 'production'){
  app.use(express.static(path.join(__dirname, '/frontend/build')));
  //Any route that is not an api route defined above, go to the index.html in the build folder
  app.get('*', (req, res) => res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html')));
} else {
  app.get('/', (req, res) => {
    res.send('API is running...');
  })
}

//===============================================
//          ERROR handling middleware
//===============================================
//If we try to go to a route that does not exist:
app.use(notFound)
//Our General Error Handling MiddleWare
app.use(errorHandler);

//===============================================
//               Start the Server
//===============================================
//get the port from our .env file
const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}` .yellow.bold));




//====================
//MIDDLEWARE Example
//====================
// app.use((req, res, next) => {
//   console.log('Hello! This is middleware!');
//   console.log(req.originalUrl); //req.originalUrl is part of express. It tells us the URL that made the request. see https://expressjs.com/en/api.html
//   next();
// })
