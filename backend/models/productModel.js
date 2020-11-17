import mongoose from 'mongoose';

const reviewSchema = mongoose.Schema({
  name: { type: String, required: true },
  rating: { type: Number, required: true }, //each individual rating
  comment: { type: String, required: true },
  user: { // RELATIONSHIP
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  }
}, {
  timestamps: true
});

const productSchema = mongoose.Schema({
  //We want a relationship between the product and the user so we know who created the product
  //We do that with type: mongoose.Schema.Types.ObjectId AND the ref: 'User' key
  user: { // RELATIONSHIP
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  name: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true,
  },
  brand: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  reviews: [reviewSchema],
  rating: { // average of all review ratings
    type: Number,
    required: true,
    default: 0
  },
  numReviews: {
    type: Number,
    required: true,
    default: 0
  },
  price: {
    type: Number,
    required: true,
    default: 0
  },
  countInStock: {
    type: Number,
    required: true,
    default: 0
  }
}, { //the timestamps option automatically creates a 'createdAt' and 'updatedAt' field for us automatically
  timestamps: true
});

const Product = mongoose.model('Product', productSchema);

export default Product;