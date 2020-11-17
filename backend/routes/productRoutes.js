import express from 'express';
const router = express.Router();
import { getProducts, getProductById, deleteProduct, createProduct, updateProduct, createProductReview, getTopProducts } from '../controllers/productController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

//=======================================
//Path that leads here: "/api/products"
//=======================================

//================================
//    Product Route Controllers
//================================
// Get top rated products for the home screen. No need for any protection middleware
router.get('/top', getTopProducts);
router.route('/').get(getProducts).post(protect, admin, createProduct);
router.route('/:id/reviews').post(protect, createProductReview);
router.route('/:id').get(getProductById).delete(protect, admin, deleteProduct).put(protect, admin, updateProduct);


export default router;








//=========================================
//      Status Code 400 - Client Error
//=========================================
// The HyperText Transfer Protocol (HTTP) 400 Bad Request response status code indicates that the server cannot or will not process the request due to something that is perceived to be a client error (e.g., malformed request syntax, invalid request message framing, or deceptive request routing).

// Error Handling - Example if we weren't using the custom error handling middleware we created
  // if (!mongoose.Types.ObjectId.isValid(req.params.id)) {//Check that our MongoDB id is valid
  //   res.status(400).json({ message: 'Invalid MongoDB ObjectId. Cannot find matching products with an invalid ObjectId.' });  
  //   // throw new Error('Invalid object ID.'); 
  // } else {
  //   const product = await Product.findById(req.params.id);
  //   if(product){
  //     res.json(product); // .json() will convert it to the json content type
  //   } else {
  //     res.status(404).json({ message: 'Product not found' });
  //   }
  // }