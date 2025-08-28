const mongoose = require('mongoose');
const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  stock: { type: Number, default: 0 },
  imageUrl: String
});
module.exports = mongoose.model('Book', bookSchema);
