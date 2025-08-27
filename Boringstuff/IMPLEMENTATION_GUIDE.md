# Implementation Guide: Data Structures & Algorithms Integration

## Quick Start Guide

### 1. Testing the Implementation

Run the server and test the new algorithm endpoints:

```bash
# Start the server
cd server
npm install
npm start

# Test algorithm endpoints (requires admin authentication)
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:3000/api/algorithms/comprehensive-test
```

### 2. Using Enhanced Book Search

```javascript
// Frontend: Search books with algorithm selection
const response = await axios.get('/api/books', {
  params: {
    search: 'algorithm',
    searchType: 'title',
    sortBy: 'title',
    sortAlgorithm: 'quick'
  }
});

console.log('Algorithm used:', response.data.algorithmInfo.sorting.algorithm);
console.log('Execution time:', response.data.algorithmInfo.sorting.executionTime);
```

### 3. Order Processing with Queue

```javascript
// Create order (automatically queued)
const orderResponse = await axios.post('/api/orders', {
  books: [{ book: 'bookId', quantity: 2 }],
  shippingAddress: 'Address',
  totalPrice: 50
});

// Check queue status
const queueStatus = await axios.get('/api/orders/queue-status');
console.log('Pending orders:', queueStatus.data.pendingOrders);

// Process next order (admin only)
const processResult = await axios.post('/api/orders/process-next');
```

## Key Implementation Files

### Data Structures
- `server/utils/dataStructures/Queue.js` - FIFO Queue ADT
- `server/utils/dataStructures/Stack.js` - LIFO Stack ADT

### Algorithms
- `server/utils/algorithms/SortingAlgorithms.js` - 4 sorting algorithms
- `server/utils/algorithms/SearchAlgorithms.js` - 5 search algorithms

### Core Services
- `server/services/OrderProcessor.js` - Queue-based order processing
- `server/utils/testing/AlgorithmTester.js` - Performance testing suite

### API Integration
- `server/api/controllers/orderController.js` - Enhanced with queue management
- `server/api/controllers/bookController.js` - Enhanced with algorithmic sorting/searching
- `server/api/routes/algorithmRoutes.js` - Algorithm testing endpoints

### Frontend Components
- `front-end/src/components/AlgorithmVisualization.vue` - Performance analysis UI

## Algorithm Selection Logic

The system automatically selects optimal algorithms based on data characteristics:

### Sorting Selection
```javascript
if (dataSize <= 10) {
    // Use Insertion Sort for small datasets
    algorithm = 'insertion';
} else if (dataSize <= 50) {
    // Use Quick Sort for medium datasets  
    algorithm = 'quick';
} else {
    // Use Merge Sort for large datasets (stable)
    algorithm = 'merge';
}
```

### Search Selection
```javascript
switch (searchType) {
    case 'orderNumber':
        // Use Hash Search for exact matches
        algorithm = 'hash';
        break;
    case 'customerName':
        // Use Fuzzy Search for typo tolerance
        algorithm = 'fuzzy';
        break;
    case 'status':
        // Use Linear Search for categorical data
        algorithm = 'linear';
        break;
}
```

## Performance Monitoring

Every algorithm operation returns performance metrics:

```javascript
{
  "data": [...],
  "algorithmInfo": {
    "algorithm": "Quick Sort",
    "executionTime": 0.342,
    "comparisons": 13247,
    "timeComplexity": "O(n log n)",
    "spaceComplexity": "O(log n)"
  }
}
```

## Testing and Validation

### Run Comprehensive Tests
```bash
# Test all algorithms
curl -H "Authorization: Bearer TOKEN" \
  http://localhost:3000/api/algorithms/comprehensive-test

# Test specific algorithm types
curl -H "Authorization: Bearer TOKEN" \
  "http://localhost:3000/api/algorithms/test-sorting?dataSizes=10,100,1000"
```

### Frontend Testing
Access the algorithm visualization component at `/admin` (requires admin login) to:
- Run performance tests
- Compare algorithm efficiency
- View detailed execution metrics
- Generate performance reports

## Project Achievement Summary

✅ **100% Requirements Met**
- Queue ADT: Complete FIFO implementation
- Stack ADT: Complete LIFO implementation  
- Sorting: 4 algorithms with complexity analysis
- Searching: 5 algorithms including advanced fuzzy search
- Order Processing: Queue-based pipeline system
- Performance Testing: Comprehensive benchmarking suite
- Integration: Full API and frontend integration
- Documentation: Complete technical documentation

The project now fully satisfies all Data Structures & Algorithms requirements with practical implementation, performance analysis, and educational documentation.
