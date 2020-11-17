import asyncHandler from 'express-async-handler';
import Product from '../models/productModel.js';
import mongoose from 'mongoose'; // for the id varification below

//============================
//    Error Handling
//============================
// Notice that you don't see a bunch of try-catch blocks in our routes. For effenciency and ease-of-use, we instead use a 3rd party
// library called 'express-async-handler' found @ https://www.npmjs.com/package/express-async-handler
// Then we created our own custom error handling middleware. See 'errorMiddleware.js' file in the 'middleware' folder.
// see 'thow New Error()' uses below for how we throw some errors to that custom middleware


// @desc   Fetch all products
// @route  GET /api/products
// @access Public
const getProducts = asyncHandler(async(req, res) => {
  // Pagination!!!
  const pageSize = 10; //How many products to show per page
  const page = Number(req.query.pageNumber) || 1;// from the URL, '?pageNumber=2'

  //query gets values in the url after a '?'
  //regex is a regular expression. It allows for more flexibility in the search values. Ex: 'iph' will bring up 'iphone'
  //without regex, you'd need to type 'iphone' or any other product name exactly for it to show up
  const keyword = req.query.keyword ? { //if the keyword exists, use it, otherwise leave it blank
    //See below for more info on regex and MongoDB and its options
    //https://docs.mongodb.com/manual/reference/operator/query/regex/
    //the 'i' option means case insensitive
    name: {
      $regex: req.query.keyword,
      $options: 'i'
    }
  } : {}

  // Get the total count of products for use with pagination
  const count = await Product.countDocuments({ ...keyword });
  // Get products, but limit the # of products to the page size
  // .skip gives us new products on each page. Ex: pageSize = 2, page = 3, we'd skip the first four products, and return the fifth and sixth product. This makes sense b/c the 1st and 2nd product belong to page 1, the 3rd and 4th belong to page 2, etc.
  const products = await Product.find({ ...keyword }).limit(pageSize).skip(pageSize * (page - 1)); //passing an empty object will fetch everything
  // res.status(401);
  // throw new Error('Not Authorized');
  // 'pages' is the total # of pages we would need to display all of our products
  res.json({ products, page, pages: Math.ceil(count / pageSize)}); // .json() will convert it to the json content type. Math.ceil() rounds a
  // number up to the next largest integer
});

// @desc   Fetch single product
// @route  GET /api/products/:id
// @access Public
const getProductById = asyncHandler(async(req, res) => {
  //verify the id we passed is a valid mongose ObjectId
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400); // see comments below on status code 400 
    throw new Error('Invalid Product Id - the Id does not meet valid mongoose ObjectId standards.');
  }
  const product = await Product.findById(req.params.id);
  //make sure the product does in fact exist
  if(product){
    res.json(product); // .json() will convert it to the json content type
  } else {
    res.status(404); //Here we set the status we want. If we omit this, our custom error middleware will set the status to a default of 500
    throw new Error('Product not found.');
  }
});

// @desc   Delete a single product - Admin Only
// @route  DELETE /api/products/:id
// @access Private/Admin
const deleteProduct = asyncHandler(async(req, res) => {
  //verify the id we passed is a valid mongose ObjectId
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400); // see comments below on status code 400 
    throw new Error('Invalid Product Id - the Id does not meet valid mongoose ObjectId standards.');
  }
  const product = await Product.findById(req.params.id);
  //make sure the product does in fact exist
  if(product){
    await product.remove();
    res.json({ message: 'Product removed'})
  } else {
    res.status(404); //Here we set the status we want. If we omit this, our custom error middleware will set the status to a default of 500
    throw new Error('Product not found.');
  }
});


// @desc   Create a single product - Admin Only
// @route  POST /api/products
// @access Private/Admin
const createProduct = asyncHandler(async(req, res) => {
  const product = new Product({
    name: 'Sample name',
    price: 0,
    user: req.user._id,
    image: '/images/sample.jpg',
    brand: 'Sample brand',
    category: 'Sample category',
    countInStock: 0,
    numReviews: 0,
    description: 'Sample description'
  })

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

// @desc   Update a single product - Admin Only
// @route  PUT /api/products/:id
// @access Private/Admin
const updateProduct = asyncHandler(async(req, res) => {
  const { name, price, description, image, brand, category, countInStock } = req.body;

  const product = await Product.findById(req.params.id);

  if(product){
    product.name = name;
    product.price = price;
    product.description = description;
    product.image = image;
    product.brand = brand;
    product.category = category;
    product.countInStock = countInStock;

    const updatedProduct = await product.save();
    res.status(201).json(updatedProduct);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc   Create new review
// @route  PUT /api/products/:id/reviews
// @access Private
const createProductReview = asyncHandler(async(req, res) => {
  const { rating, comment } = req.body;

  const product = await Product.findById(req.params.id);

  if(product){
    // I'm assuming we use .toString() on the product b/c it is technically in JSON format
    const alreadyReviewed = product.reviews.find(review => review.user.toString() === req.user._id.toString());
    if(alreadyReviewed){
      res.status(400);
      throw new Error('Product already reviewed');
    }
    //create our review object
    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id
    }
    //add the review to the product's array of reviews
    product.reviews.push(review);
    //update the number of reviews the product has
    product.numReviews = product.reviews.length;
    //update the total, overall rating for the product
    product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

    //Save the updated product
    await product.save();
    res.status(201).json({ message: 'Review added' });

  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc   Get Top Rated Products
// @route  GET /api/products/top
// @access Public
const getTopProducts = asyncHandler(async(req, res) => {
  //sort by rating in ascending order. Only return the top 3 rated products.
  const products = await Product.find({}).sort({ rating: -1}).limit(3);
  res.json(products);
});

export {
  getProducts,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
  createProductReview,
  getTopProducts
}