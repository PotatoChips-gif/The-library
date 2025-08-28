/**
 * Algorithm Testing and Analysis Routes
 * Provides endpoints for testing and analyzing data structures and algorithms
 */

const express = require('express');
const router = express.Router();
const AlgorithmTester = require('../../utils/testing/AlgorithmTester');
const { auth, authorize } = require('../../middleware/auth');

// @route   GET /api/algorithms/test-sorting
// @desc    Test sorting algorithms performance
// @access  Admin only
router.get('/test-sorting', auth, authorize('admin'), async (req, res) => {
    try {
        const { dataSizes } = req.query;
        const sizes = dataSizes ? dataSizes.split(',').map(Number) : [10, 100, 1000, 5000];
        
        const results = AlgorithmTester.testSortingAlgorithms(sizes);
        
        res.json({
            success: true,
            testType: 'Sorting Algorithms',
            results
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/algorithms/test-searching
// @desc    Test search algorithms performance
// @access  Admin only
router.get('/test-searching', auth, authorize('admin'), async (req, res) => {
    try {
        const { dataSizes } = req.query;
        const sizes = dataSizes ? dataSizes.split(',').map(Number) : [100, 1000, 10000];
        
        const results = AlgorithmTester.testSearchAlgorithms(sizes);
        
        res.json({
            success: true,
            testType: 'Search Algorithms',
            results
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/algorithms/test-data-structures
// @desc    Test data structure operations performance
// @access  Admin only
router.get('/test-data-structures', auth, authorize('admin'), async (req, res) => {
    try {
        const { operationCounts } = req.query;
        const counts = operationCounts ? operationCounts.split(',').map(Number) : [1000, 10000, 100000];
        
        const results = AlgorithmTester.testDataStructures(counts);
        
        res.json({
            success: true,
            testType: 'Data Structures',
            results
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/algorithms/comprehensive-test
// @desc    Run comprehensive algorithm and data structure tests
// @access  Admin only
router.get('/comprehensive-test', auth, authorize('admin'), async (req, res) => {
    try {
        const results = AlgorithmTester.runComprehensiveTests();
        
        res.json({
            success: true,
            testType: 'Comprehensive Analysis',
            results
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   POST /api/algorithms/generate-test-data
// @desc    Generate test data for algorithm testing
// @access  Admin only
router.post('/generate-test-data', auth, authorize('admin'), async (req, res) => {
    try {
        const { size = 100, type = 'random' } = req.body;
        
        const testData = AlgorithmTester.generateTestData(size, type);
        
        res.json({
            success: true,
            dataType: type,
            size: testData.length,
            data: testData
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
