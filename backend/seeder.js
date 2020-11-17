// NOTE: This is completely seperate from our server! Hence why we have to reimport everything.

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import colors from 'colors';

//Local data
import users from './data/users.js';
import products from './data/products.js';

//Models
import User from './models/userModel.js';
import Product from './models/productModel.js';
import Order from './models/orderModel.js';

import connectDB from './config/db.js';

dotenv.config(); //load our environmental files
connectDB(); //connect to our database

//This will seed the database with our users and products data. NOTE: we don't seed orders, b/c users themselves will create orders that will
//be added to the database
const importData = async () => {
  try {
    //Clear any existing data in the database
    await Order.deleteMany(); //By not passing any arguments it defaults to deleting the whole table (collection)
    await Product.deleteMany();
    await User.deleteMany();

    //We need to add our admin as the user for each product in addition to importing the data. We do that below:
    const createdUsers = await User.insertMany(users); //Add our users to the database, and create an array of those users for later use

    const adminUser = createdUsers[0]._id; //Get the admin from those users. We know the admin is at index 0. We want their id b/c we've set up
    //a relationship in our models between the products and the admin that made those products, and we used 
    //'type: mongoose.Schema.Types.ObjectId' - se the product model file

    //Now we add the admin user and the user to each product. We map through each existing product, copy what's already there using the spread
    //operator, and add user information to each one
    const sampleProducts = products.map(product => {
      return{ ...product, user: adminUser }
    })

    await Product.insertMany(sampleProducts); //Add all the products to the database
    console.log('Data Imported!' .green.inverse)
    process.exit(); //exit with success
  } catch (error) {
    console.log('Error while seeding the database:' .red.inverse);
    console.log(`${error}` .red.inverse);
    process.exit(1); //exit with failure
  }
}


const destroyData = async () => {
  try {
    //Clear any existing data in the database
    await Order.deleteMany(); //By not passing any arguments it defaults to deleting the whole table (collection)
    await Product.deleteMany();
    await User.deleteMany();

    console.log('Data Destroyed!' .red.inverse)
    process.exit(); //exit with success
  } catch (error) {
    console.log('Error trying to destroy all data in database:' .red.inverse);
    console.log(`${error}` .red.inverse);
    process.exit(1); //exit with failure
  }
}

// How to run the seeder file!
// in console, type 'node backend/seeder' to seed data
// in console, type 'node backend/seeder -d' to delete data. See below:

//OR

//in console, type "npm run data:import" or "npm run data:destroy". See the package.json in the root for these scripts
if(process.argv[2] === '-d'){
  destroyData();
} else {
  importData();
}