const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, required: true, unique: true },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  customerName: { type: String, required: true },
  shippingAddress: { type: String, required: true },
  books: [{
    book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book' },
    quantity: { type: Number, required: true, min: 1 }
  }],
  totalPrice: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Pending' 
  },
  trackingInfo: {
    estimatedDelivery: Date,
    currentLocation: String,
    lastUpdate: Date
  },
  createdAt: { type: Date, default: Date.now }
});

// Add method to randomize status for testing
orderSchema.methods.randomizeStatus = function() {
  const statuses = ['Pending', 'Processing', 'Shipped', 'Delivered'];
  const locations = ['Warehouse', 'In Transit - City A', 'In Transit - City B', 'Local Facility', 'Out for Delivery'];
  
  this.status = statuses[Math.floor(Math.random() * statuses.length)];
  this.trackingInfo = {
    estimatedDelivery: new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000), // Random 1-7 days
    currentLocation: locations[Math.floor(Math.random() * locations.length)],
    lastUpdate: new Date()
  };
};

module.exports = mongoose.model('Order', orderSchema);
