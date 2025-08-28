const Queue = require('../utils/dataStructures/Queue');
const Stack = require('../utils/dataStructures/Stack');
const SortingAlgorithms = require('../utils/algorithms/SortingAlgorithms');
const SearchAlgorithms = require('../utils/algorithms/SearchAlgorithms');
const Order = require('../api/models/orderModel');

class OrderProcessor {
    constructor() {
        // Queue for pending orders (FIFO)
        this.pendingOrders = new Queue();

        // Stack for processing history (LIFO for undo operations)
        this.processingHistory = new Stack();

        // Queue for completed orders
        this.completedOrders = new Queue();

        // Processing statistics
        this.stats = {
            totalProcessed: 0,
            averageProcessingTime: 0,
            algorithmsUsed: {
                sorting: {},
                searching: {}
            }
        };
    }

    /**
     * Add a new order to the processing queue
     * @param {Object} orderData - Order information
     * @returns {Object} Processing result
     */
    async addOrder(orderData) {
        try {
            // Create order with unique order number
            const orderNumber = this.generateOrderNumber();
            const order = {
                ...orderData,
                orderNumber,
                status: 'Pending',
                createdAt: new Date(),
                processingSteps: []
            };

            // Add to pending queue
            this.pendingOrders.enqueue(order);

            // Log the action
            this.processingHistory.push({
                action: 'ORDER_ADDED',
                orderNumber,
                timestamp: new Date(),
                queueSize: this.pendingOrders.size()
            });

            console.log(`Order ${orderNumber} added to processing queue. Queue size: ${this.pendingOrders.size()}`);

            return {
                success: true,
                orderNumber,
                queuePosition: this.pendingOrders.size(),
                message: 'Order added to processing queue'
            };

        } catch (error) {
            console.error('Error adding order:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Process the next order in the queue
     * @returns {Object} Processing result
     */
    async processNextOrder() {
        if (this.pendingOrders.isEmpty()) {
            return {
                success: false,
                message: 'No orders in queue to process'
            };
        }

        const startTime = performance.now();
        const order = this.pendingOrders.dequeue();

        try {
            // Step 1: Validate order
            order.processingSteps.push('Order validation started');
            await this.validateOrder(order);

            // Step 2: Check book availability
            order.processingSteps.push('Book availability check');
            await this.checkBookAvailability(order);

            // Step 3: Sort books in order using different algorithms
            order.processingSteps.push('Sorting books in order');
            const sortedBooks = await this.sortBooksInOrder(order);
            order.books = sortedBooks.sortedArray;
            order.sortingAlgorithm = sortedBooks.algorithm;

            // Step 4: Calculate total and update inventory
            order.processingSteps.push('Calculating total and updating inventory');
            await this.calculateTotalAndUpdateInventory(order);

            // Step 5: Update order status
            order.status = 'Processing';
            order.processedAt = new Date();

            // Add to processing history
            this.processingHistory.push({
                action: 'ORDER_PROCESSED',
                orderNumber: order.orderNumber,
                timestamp: new Date(),
                processingTime: performance.now() - startTime,
                algorithm: order.sortingAlgorithm
            });

            // Move to completed queue
            this.completedOrders.enqueue(order);

            // Update statistics
            this.updateProcessingStats(performance.now() - startTime, order.sortingAlgorithm);

            console.log(`Order ${order.orderNumber} processed successfully using ${order.sortingAlgorithm}`);

            return {
                success: true,
                order,
                processingTime: performance.now() - startTime,
                remainingInQueue: this.pendingOrders.size()
            };

        } catch (error) {
            // If processing fails, add back to queue or move to error handling
            order.status = 'Error';
            order.error = error.message;

            this.processingHistory.push({
                action: 'ORDER_ERROR',
                orderNumber: order.orderNumber,
                timestamp: new Date(),
                error: error.message
            });

            console.error(`Error processing order ${order.orderNumber}:`, error);

            return {
                success: false,
                orderNumber: order.orderNumber,
                error: error.message
            };
        }
    }

    /**
     * Search for an order using different search algorithms
     * @param {string} searchTerm - Order number or search term
     * @param {string} searchType - Type of search (orderNumber, customer, status)
     * @returns {Object} Search results
     */
    async searchOrder(searchTerm, searchType = 'orderNumber') {
        const startTime = performance.now();

        // Combine all orders for searching
        const allOrders = [
            ...this.pendingOrders.toArray(),
            ...this.completedOrders.toArray()
        ];

        let searchResult;
        let keyFunction;

        switch (searchType) {
            case 'orderNumber':
                keyFunction = order => order.orderNumber;
                searchResult = SearchAlgorithms.linearSearch(allOrders, searchTerm, keyFunction);
                break;
            case 'customer':
                keyFunction = order => order.customer?.username || order.customer;
                searchResult = SearchAlgorithms.fuzzySearch(allOrders, searchTerm, keyFunction, 2);
                break;
            case 'status':
                keyFunction = order => order.status;
                searchResult = SearchAlgorithms.linearSearch(allOrders, searchTerm, keyFunction);
                break;
            default:
                // Use hash search for order numbers (most common case)
                searchResult = SearchAlgorithms.hashSearch(allOrders, searchTerm, order => order.orderNumber);
        }

        // Update search statistics
        if (!this.stats.algorithmsUsed.searching[searchResult.algorithm]) {
            this.stats.algorithmsUsed.searching[searchResult.algorithm] = 0;
        }
        this.stats.algorithmsUsed.searching[searchResult.algorithm]++;

        console.log(`Search completed using ${searchResult.algorithm} in ${searchResult.executionTime.toFixed(2)}ms`);

        return {
            ...searchResult,
            searchTerm,
            searchType,
            totalOrders: allOrders.length
        };
    }

    /**
     * Sort books in an order using different algorithms based on criteria
     * @param {Object} order - Order object
     * @returns {Object} Sorting result
     */
    async sortBooksInOrder(order) {
        if (!order.books || order.books.length <= 1) {
            return {
                sortedArray: order.books || [],
                algorithm: 'No sorting needed',
                executionTime: 0
            };
        }

        // Choose sorting algorithm based on data size and requirements
        let sortingResult;
        const bookCount = order.books.length;

        if (bookCount <= 10) {
            // Use insertion sort for small datasets
            sortingResult = SortingAlgorithms.insertionSort(
                order.books,
                (a, b) => a.book?.title > b.book?.title
            );
        } else if (bookCount <= 50) {
            // Use quick sort for medium datasets
            sortingResult = SortingAlgorithms.quickSort(
                order.books,
                (a, b) => a.book?.title > b.book?.title
            );
        } else {
            // Use merge sort for large datasets (stable sort)
            sortingResult = SortingAlgorithms.mergeSort(
                order.books,
                (a, b) => a.book?.title > b.book?.title
            );
        }

        // Update sorting statistics
        if (!this.stats.algorithmsUsed.sorting[sortingResult.algorithm]) {
            this.stats.algorithmsUsed.sorting[sortingResult.algorithm] = 0;
        }
        this.stats.algorithmsUsed.sorting[sortingResult.algorithm]++;

        return sortingResult;
    }

    /**
     * Get processing queue status
     * @returns {Object} Queue status information
     */
    getQueueStatus() {
        return {
            pendingOrders: this.pendingOrders.size(),
            completedOrders: this.completedOrders.size(),
            processingHistorySize: this.processingHistory.size(),
            nextOrder: this.pendingOrders.peek(),
            lastProcessed: this.processingHistory.peek(),
            statistics: this.stats
        };
    }

    /**
     * Get processing history (last N operations)
     * @param {number} count - Number of history items to return
     * @returns {Array} Processing history
     */
    getProcessingHistory(count = 10) {
        const history = [];
        const tempStack = new Stack();

        // Get last N items from history stack
        for (let i = 0; i < count && !this.processingHistory.isEmpty(); i++) {
            const item = this.processingHistory.pop();
            history.push(item);
            tempStack.push(item);
        }

        // Restore the history stack
        while (!tempStack.isEmpty()) {
            this.processingHistory.push(tempStack.pop());
        }

        return history;
    }

    /**
     * Undo last processing operation
     * @returns {Object} Undo result
     */
    undoLastOperation() {
        if (this.processingHistory.isEmpty()) {
            return {
                success: false,
                message: 'No operations to undo'
            };
        }

        const lastOperation = this.processingHistory.pop();

        // Handle different types of undo operations
        switch (lastOperation.action) {
            case 'ORDER_PROCESSED':
                // Move order back to pending queue
                // This is a simplified implementation
                return {
                    success: true,
                    message: `Undid processing of order ${lastOperation.orderNumber}`,
                    operation: lastOperation
                };
            default:
                return {
                    success: false,
                    message: 'Cannot undo this type of operation'
                };
        }
    }

    // Helper methods
    generateOrderNumber() {
        return `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
    }

    async validateOrder(order) {
        // Order validation logic
        if (!order.books || order.books.length === 0) {
            throw new Error('Order must contain at least one book');
        }
        if (!order.customer) {
            throw new Error('Order must have customer information');
        }
        return true;
    }

    async checkBookAvailability(order) {
        // Book availability check logic
        // This would typically check against inventory
        return true;
    }

    async calculateTotalAndUpdateInventory(order) {
        // Calculate total price and update inventory
        let total = 0;
        for (const item of order.books) {
            total += (item.book?.price || 0) * (item.quantity || 1);
        }
        order.totalPrice = total;
        return total;
    }

    updateProcessingStats(processingTime, algorithm) {
        this.stats.totalProcessed++;
        this.stats.averageProcessingTime =
            (this.stats.averageProcessingTime * (this.stats.totalProcessed - 1) + processingTime) /
            this.stats.totalProcessed;
    }
}

module.exports = OrderProcessor;
