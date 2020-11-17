import express from 'express';
const router = express.Router();
import { authUser, registerUser, getUserProfile, updateUserProfile, getUsers, deleteUser, getUserById, updateUser } from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

//=======================================
//Path that leads here: "/api/users"
//=======================================
//below, .post registers a user, .get gets all users (admin only)
router.route('/').post(registerUser).get(protect, admin, getUsers); // register
router.post('/login', authUser); //login

//====================================
//  Authorization Middleware Example
//====================================
//protect is our authorization middleware we created in 'authMiddleware.js' in the 'middleware' folder
//below we've defined both a GET and a PUT request to the same route
router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile);

router.route('/:id').delete(protect, admin, deleteUser).get(protect, admin, getUserById).put(protect, admin, updateUser);

export default router;