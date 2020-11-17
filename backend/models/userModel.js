import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  isAdmin: {
    type: Boolean,
    required: true,
    default: false
  }
}, { //the timestamps option automatically creates a 'createdAt' and 'updatedAt' field for us automatically
  timestamps: true
});

//================================================================================
//                      Password Authentication Method
//================================================================================
//here we are adding a method to the userSchema that we can call to authenticate user passwords
//One place where we use this is in the userController.js file
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
}

//================================================================================
//                      Encrypt User Passwords
//================================================================================
//during user registration this will encrypt the user's password
//this will be skipped unless the password itself has been modified, i.e. it won't trigger if the user updates their email
//the methods you are seeing used here are all part of Mongoose
userSchema.pre('save', async function(next){
  if(!this.isModified('password')){
    next(); //skip encrypting the password
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
})

const User = mongoose.model('User', userSchema);

export default User;