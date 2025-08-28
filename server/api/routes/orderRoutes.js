const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { auth, authorize } = require('../../middleware/auth');

router.get('/', orderController.getAllOrders);
router.get('/my-orders', auth, orderController.getMyOrders);
router.get('/search', auth, authorize(['admin']), orderController.searchOrders);
router.get('/queue-status', auth, authorize(['admin']), orderController.getQueueStatus);
router.get('/track/:orderNumber', orderController.trackOrder);
router.get('/:id', auth, authorize(['admin']), orderController.getOrderById);
router.post('/', auth, orderController.createOrder);
router.post('/promote-admin', auth, orderController.promoteToAdmin);
router.post('/process-next', auth, authorize(['admin']), orderController.processNextOrder);
router.put('/:id/status', auth, authorize(['admin']), orderController.updateOrderStatus);
router.route('/processing-history').get(auth, authorize(['admin']), orderController.getProcessingHistory);

module.exports = router;