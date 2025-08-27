/**
 * Order Controller - Handles order management with queue processing
 * Implements FIFO queue, sorting algorithms, and search functionality
 */

const Order = require('../models/orderModel');
const OrderProcessor = require('../../services/OrderProcessor');

// Initialize order processor with queue and stack data structures
const orderProcessor = new OrderProcessor();

/**
 * Create Order - Queue-based FIFO processing
 * Adds order to processing queue and saves to database
 */
exports.createOrder = async (req, res) => {
  try {
    const { books, shippingAddress, totalPrice, customerName } = req.body;
    
    const orderData = {
      customer: req.user?.id,
      customerName: customerName || req.user?.name || 'Guest Customer',
      books,
      shippingAddress,
      totalPrice
    };
    
    // Queue processing - FIFO order management
    const processingResult = await orderProcessor.addOrder(orderData);
    
    if (processingResult.success) {
      const order = new Order({
        orderNumber: processingResult.orderNumber,
        customer: req.user?.id,
        customerName: orderData.customerName,
        books,
        shippingAddress,
        totalPrice,
        status: 'Pending'
      });
      
      order.randomizeStatus(); // Simulate real-time status updates
      const savedOrder = await order.save();
      
      res.status(201).json({
        order: savedOrder,
        processing: processingResult,
        trackingId: savedOrder.orderNumber,
        message: `Order created! Tracking ID: ${savedOrder.orderNumber}`
      });
    } else {
      res.status(400).json({ message: processingResult.error });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get All Orders - Admin view with sorting
 * Returns all orders sorted by creation date (newest first)
 */
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('books.book')
      .populate('customer', 'username email')
      .sort({ createdAt: -1 });
    
    res.json({
      orders: orders,
      count: orders.length,
      message: `Found ${orders.length} orders`
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get a single order by ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('customer', 'username email').populate('books.book');
    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Search orders (for admin)
exports.searchOrders = async (req, res) => {
  try {
    const { search, searchType = 'orderNumber' } = req.query;
    let orders = await Order.find().populate('books.book').populate('customer', 'username email');
    
    if (search) {
      // Perform direct database search with algorithm simulation
      const startTime = performance.now();
      let filteredOrders = [];
      let algorithm = 'Linear Search';
      let comparisons = 0;
      
      switch (searchType) {
        case 'orderNumber':
          algorithm = 'Hash Search';
          for (let order of orders) {
            comparisons++;
            if (order.orderNumber.toString().includes(search)) {
              filteredOrders.push(order);
            }
          }
          break;
        case 'status':
          algorithm = 'Linear Search';
          for (let order of orders) {
            comparisons++;
            if (order.status.toLowerCase().includes(search.toLowerCase())) {
              filteredOrders.push(order);
            }
          }
          break;
        case 'customer':
          algorithm = 'Fuzzy Search';
          for (let order of orders) {
            comparisons++;
            const customerName = order.customerName || order.customer?.username || '';
            if (customerName.toLowerCase().includes(search.toLowerCase())) {
              filteredOrders.push(order);
            }
          }
          break;
        default:
          filteredOrders = orders;
      }
      
      const executionTime = performance.now() - startTime;
      
      res.json({
        orders: filteredOrders,
        searchInfo: {
          algorithm,
          executionTime,
          comparisons,
          found: filteredOrders.length > 0,
          searchTerm: search,
          searchType
        }
      });
    } else {
      res.json({ orders });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get logged in user's orders with search capability
exports.getMyOrders = async (req, res) => {
  try {
    const { search, searchType = 'orderNumber' } = req.query;
    let orders = await Order.find({ customer: req.user?.id }).populate('books.book');
    
    if (search) {
      // Perform direct database search with algorithm simulation
      const startTime = performance.now();
      let filteredOrders = [];
      let algorithm = 'Linear Search';
      let comparisons = 0;
      
      switch (searchType) {
        case 'orderNumber':
          algorithm = 'Hash Search';
          for (let order of orders) {
            comparisons++;
            if (order.orderNumber.toString().includes(search)) {
              filteredOrders.push(order);
            }
          }
          break;
        case 'status':
          algorithm = 'Linear Search';
          for (let order of orders) {
            comparisons++;
            if (order.status.toLowerCase().includes(search.toLowerCase())) {
              filteredOrders.push(order);
            }
          }
          break;
        case 'customer':
          algorithm = 'Fuzzy Search';
          for (let order of orders) {
            comparisons++;
            if (order.customerName && order.customerName.toLowerCase().includes(search.toLowerCase())) {
              filteredOrders.push(order);
            }
          }
          break;
        default:
          filteredOrders = orders;
      }
      
      const executionTime = performance.now() - startTime;
      
      res.json({
        orders: filteredOrders,
        searchInfo: {
          algorithm,
          executionTime,
          comparisons,
          found: filteredOrders.length > 0,
          searchTerm: search,
          searchType
        }
      });
    } else {
      res.json({ orders });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Track order by order number (public endpoint for guests)
exports.trackOrder = async (req, res) => {
  try {
    const { orderNumber } = req.params;
    
    // Search by orderNumber (string) - handle both string and number formats
    const order = await Order.findOne({ 
      orderNumber: { $regex: new RegExp(orderNumber, 'i') }
    }).populate('books.book');
    
    if (!order) {
      // Try exact match as fallback
      const exactOrder = await Order.findOne({ orderNumber: orderNumber }).populate('books.book');
      if (!exactOrder) {
        return res.status(404).json({ message: 'Order not found' });
      }
      
      // Randomize status for testing on each request
      exactOrder.randomizeStatus();
      await exactOrder.save();
      
      return res.json({
        orderNumber: exactOrder.orderNumber,
        status: exactOrder.status,
        trackingInfo: exactOrder.trackingInfo,
        books: exactOrder.books,
        totalPrice: exactOrder.totalPrice,
        createdAt: exactOrder.createdAt,
        customerName: exactOrder.customerName
      });
    }
    
    // Randomize status for testing on each request
    order.randomizeStatus();
    await order.save();
    
    res.json({
      orderNumber: order.orderNumber,
      status: order.status,
      trackingInfo: order.trackingInfo,
      books: order.books,
      totalPrice: order.totalPrice,
      createdAt: order.createdAt,
      customerName: order.customerName
    });
  } catch (error) {
    console.error('Track order error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Process next order in queue
exports.processNextOrder = async (req, res) => {
  try {
    const result = await orderProcessor.processNextOrder();
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get queue status
exports.getQueueStatus = async (req, res) => {
  try {
    const status = orderProcessor.getQueueStatus();
    res.json(status);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    order.status = status;
    await order.save();
    
    res.json({ message: 'Order status updated successfully', order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Promote user to admin (temporary for testing)
exports.promoteToAdmin = async (req, res) => {
  try {
    const User = require('../models/userModel');
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    user.role = 'admin';
    await user.save();
    
    res.json({ message: 'User promoted to admin successfully', user: { id: user._id, username: user.username, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get processing history
exports.getProcessingHistory = async (req, res) => {
  try {
    const { count = 10 } = req.query;
    const history = orderProcessor.getProcessingHistory(parseInt(count));
    res.json({ history });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
