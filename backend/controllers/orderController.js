import asyncHandler from 'express-async-handler';
import Order from '../models/orderModel.js';

// @desc   Create new order
// @route  POST /api/orders
// @access Private
const addOrderItems = asyncHandler(async (req, res) => {
  const { orderItems, shippingAddress, paymentMethod, itemsPrice, taxPrice, shippingPrice, totalPrice } = req.body;

  if(orderItems && orderItems.length === 0){
    res.status(400);
    throw new Error('No order items')
    return
  } else {
    const order = new Order({
      orderItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice
    })
    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  }

});

// @desc   Get order by ID
// @route  POST /api/orders/:id
// @access Private
const getOrderById = asyncHandler(async (req, res) => {
  //We get the order that matches the user's id. Then, using .populate, we look for that same user's name and email in the 'users' collection
  //We are able to do this b/c we set up the relationship in the order model. See orderModel.js for the relationship between user id's in each
  const order = await Order.findById(req.params.id).populate('user', 'name email');
  //make sure the person trying to get the order is either an Admin, or their user ID matches the user ID on the order
  // if (order && (req.user.isAdmin || order.user._id.equals(req.user._id))) {
  //   res.json(order)
  // } else {
  //   res.status(404)
  //   throw new Error('Order not found')
  // }
  if(order){
    res.json(order);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc   Update order to paid
// @route  POST /api/orders/:id/pay
// @access Private
const updateOrderToPaid = asyncHandler(async (req, res) => {

  const order = await Order.findById(req.params.id);
  //make sure the person trying to get the order is either an Admin, or their user ID matches the user ID on the order
  // if (order && (req.user.isAdmin || order.user._id.equals(req.user._id))) {
  //   res.json(order)
  // } else {
  //   res.status(404)
  //   throw new Error('Order not found')
  // }
  if(order){
    order.isPaid = true,
    order.paidAt = Date.now();
    //The values for the object below all come from Paypal
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.payer.email_address
    }
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});



// @desc   Get logged in user orders
// @route  POST /api/orders/myorders
// @access Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id} );
  res.json(orders);
});


// @desc   Get all orders - Admin Only
// @route  GET /api/orders
// @access Private/Admin
const getOrders = asyncHandler(async (req, res) => {
  //we use .populate() to get the id and name of the coressponding user of that order
  const orders = await Order.find({}).populate('user', 'id name');
  res.json(orders);
});


// @desc   Update order to delivered
// @route  POST /api/orders/:id/deliver
// @access Private/Admin
const updateOrderToDelivered = asyncHandler(async (req, res) => {

  const order = await Order.findById(req.params.id);

  if(order){
    order.isDelivered = true,
    order.deliveredAt = Date.now();
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});


export {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getMyOrders,
  getOrders
}