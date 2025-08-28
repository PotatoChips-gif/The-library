const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Will be hashed
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  fullName: { type: String }, // Optional full name for orders
  email: { type: String }, // Optional email
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('User', userSchema);
