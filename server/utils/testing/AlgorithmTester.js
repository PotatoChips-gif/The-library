/**
 * Algorithm Performance Testing and Analysis Suite
 * Provides comprehensive testing and benchmarking for data structures and algorithms
 */

const SortingAlgorithms = require('../algorithms/SortingAlgorithms');
const SearchAlgorithms = require('../algorithms/SearchAlgorithms');
const Queue = require('../dataStructures/Queue');
const Stack = require('../dataStructures/Stack');

class AlgorithmTester {
    
    /**
     * Generate test data for algorithm testing
     * @param {number} size - Size of test data
     * @param {string} type - Type of data (random, sorted, reverse, books, orders)
     * @returns {Array} Test data
     */
    static generateTestData(size, type = 'random') {
        const data = [];
        
        switch (type) {
            case 'random':
                for (let i = 0; i < size; i++) {
                    data.push(Math.floor(Math.random() * size * 10));
                }
                break;
                
            case 'sorted':
                for (let i = 0; i < size; i++) {
                    data.push(i);
                }
                break;
                
            case 'reverse':
                for (let i = size; i > 0; i--) {
                    data.push(i);
                }
                break;
                
            case 'books':
                const titles = ['Algorithm Design', 'Data Structures', 'Computer Networks', 'Database Systems', 'Software Engineering'];
                const authors = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones'];
                for (let i = 0; i < size; i++) {
                    data.push({
                        id: i + 1,
                        title: `${titles[i % titles.length]} ${i + 1}`,
                        author: authors[i % authors.length],
                        price: 20 + Math.random() * 80,
                        stock: Math.floor(Math.random() * 100)
                    });
                }
                break;
                
            case 'orders':
                for (let i = 0; i < size; i++) {
                    data.push({
                        orderNumber: `ORD-${1000 + i}`,
                        customer: `customer${i + 1}`,
                        status: ['Pending', 'Processing', 'Completed'][i % 3],
                        totalPrice: 50 + Math.random() * 200,
                        createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
                    });
                }
                break;
        }
        
        return data;
    }

    /**
     * Test sorting algorithms with different data sizes and types
     * @param {Array} dataSizes - Array of data sizes to test
     * @returns {Object} Comprehensive sorting test results
     */
    static testSortingAlgorithms(dataSizes = [10, 100, 1000, 5000]) {
        const results = {
            testDate: new Date(),
            dataSizes,
            algorithms: ['Insertion Sort', 'Selection Sort', 'Quick Sort', 'Merge Sort'],
            results: {},
            analysis: {}
        };

        const dataTypes = ['random', 'sorted', 'reverse'];
        
        for (const size of dataSizes) {
            results.results[size] = {};
            
            for (const dataType of dataTypes) {
                const testData = this.generateTestData(size, dataType);
                results.results[size][dataType] = {};
                
                // Test each sorting algorithm
                const insertionResult = SortingAlgorithms.insertionSort(testData);
                const selectionResult = SortingAlgorithms.selectionSort(testData);
                const quickResult = SortingAlgorithms.quickSort(testData);
                const mergeResult = SortingAlgorithms.mergeSort(testData);
                
                results.results[size][dataType] = {
                    'Insertion Sort': {
                        executionTime: insertionResult.executionTime,
                        comparisons: insertionResult.comparisons,
                        swaps: insertionResult.swaps,
                        timeComplexity: insertionResult.timeComplexity,
                        stable: insertionResult.stable
                    },
                    'Selection Sort': {
                        executionTime: selectionResult.executionTime,
                        comparisons: selectionResult.comparisons,
                        swaps: selectionResult.swaps,
                        timeComplexity: selectionResult.timeComplexity,
                        stable: selectionResult.stable
                    },
                    'Quick Sort': {
                        executionTime: quickResult.executionTime,
                        comparisons: quickResult.comparisons,
                        swaps: quickResult.swaps,
                        timeComplexity: quickResult.timeComplexity,
                        stable: quickResult.stable
                    },
                    'Merge Sort': {
                        executionTime: mergeResult.executionTime,
                        comparisons: mergeResult.comparisons,
                        merges: mergeResult.merges,
                        timeComplexity: mergeResult.timeComplexity,
                        stable: mergeResult.stable
                    }
                };
            }
        }

        // Generate analysis
        results.analysis = this.analyzeSortingResults(results.results);
        
        return results;
    }

    /**
     * Test search algorithms with different data sizes and search patterns
     * @param {Array} dataSizes - Array of data sizes to test
     * @returns {Object} Comprehensive search test results
     */
    static testSearchAlgorithms(dataSizes = [100, 1000, 10000]) {
        const results = {
            testDate: new Date(),
            dataSizes,
            algorithms: ['Linear Search', 'Binary Search', 'Hash Search'],
            results: {},
            analysis: {}
        };

        for (const size of dataSizes) {
            const testData = this.generateTestData(size, 'random');
            const sortedData = [...testData].sort((a, b) => a - b);
            
            // Test different search scenarios
            const targetExists = testData[Math.floor(testData.length / 2)]; // Target that exists
            const targetNotExists = -1; // Target that doesn't exist
            
            results.results[size] = {
                targetExists: {},
                targetNotExists: {}
            };

            // Test with existing target
            const linearExistsResult = SearchAlgorithms.linearSearch(testData, targetExists);
            const binaryExistsResult = SearchAlgorithms.binarySearch(sortedData, targetExists);
            const hashExistsResult = SearchAlgorithms.hashSearch(testData, targetExists);

            results.results[size].targetExists = {
                'Linear Search': {
                    executionTime: linearExistsResult.executionTime,
                    comparisons: linearExistsResult.comparisons,
                    found: linearExistsResult.found,
                    timeComplexity: linearExistsResult.timeComplexity
                },
                'Binary Search': {
                    executionTime: binaryExistsResult.executionTime,
                    comparisons: binaryExistsResult.comparisons,
                    found: binaryExistsResult.found,
                    timeComplexity: binaryExistsResult.timeComplexity
                },
                'Hash Search': {
                    executionTime: hashExistsResult.executionTime,
                    comparisons: hashExistsResult.comparisons,
                    found: hashExistsResult.found,
                    timeComplexity: hashExistsResult.timeComplexity
                }
            };

            // Test with non-existing target
            const linearNotExistsResult = SearchAlgorithms.linearSearch(testData, targetNotExists);
            const binaryNotExistsResult = SearchAlgorithms.binarySearch(sortedData, targetNotExists);
            const hashNotExistsResult = SearchAlgorithms.hashSearch(testData, targetNotExists);

            results.results[size].targetNotExists = {
                'Linear Search': {
                    executionTime: linearNotExistsResult.executionTime,
                    comparisons: linearNotExistsResult.comparisons,
                    found: linearNotExistsResult.found,
                    timeComplexity: linearNotExistsResult.timeComplexity
                },
                'Binary Search': {
                    executionTime: binaryNotExistsResult.executionTime,
                    comparisons: binaryNotExistsResult.comparisons,
                    found: binaryNotExistsResult.found,
                    timeComplexity: binaryNotExistsResult.timeComplexity
                },
                'Hash Search': {
                    executionTime: hashNotExistsResult.executionTime,
                    comparisons: hashNotExistsResult.comparisons,
                    found: hashNotExistsResult.found,
                    timeComplexity: hashNotExistsResult.timeComplexity
                }
            };
        }

        // Generate analysis
        results.analysis = this.analyzeSearchResults(results.results);
        
        return results;
    }

    /**
     * Test data structure operations (Queue and Stack)
     * @param {Array} operationCounts - Array of operation counts to test
     * @returns {Object} Data structure performance results
     */
    static testDataStructures(operationCounts = [1000, 10000, 100000]) {
        const results = {
            testDate: new Date(),
            operationCounts,
            results: {
                queue: {},
                stack: {}
            },
            analysis: {}
        };

        for (const count of operationCounts) {
            // Test Queue operations
            const queue = new Queue();
            const queueStartTime = performance.now();
            
            // Enqueue operations
            for (let i = 0; i < count; i++) {
                queue.enqueue(i);
            }
            
            const queueEnqueueTime = performance.now();
            
            // Dequeue operations
            for (let i = 0; i < count; i++) {
                queue.dequeue();
            }
            
            const queueDequeueTime = performance.now();

            results.results.queue[count] = {
                enqueueTime: queueEnqueueTime - queueStartTime,
                dequeueTime: queueDequeueTime - queueEnqueueTime,
                totalTime: queueDequeueTime - queueStartTime,
                averageEnqueueTime: (queueEnqueueTime - queueStartTime) / count,
                averageDequeueTime: (queueDequeueTime - queueEnqueueTime) / count
            };

            // Test Stack operations
            const stack = new Stack();
            const stackStartTime = performance.now();
            
            // Push operations
            for (let i = 0; i < count; i++) {
                stack.push(i);
            }
            
            const stackPushTime = performance.now();
            
            // Pop operations
            for (let i = 0; i < count; i++) {
                stack.pop();
            }
            
            const stackPopTime = performance.now();

            results.results.stack[count] = {
                pushTime: stackPushTime - stackStartTime,
                popTime: stackPopTime - stackPushTime,
                totalTime: stackPopTime - stackStartTime,
                averagePushTime: (stackPushTime - stackStartTime) / count,
                averagePopTime: (stackPopTime - stackPushTime) / count
            };
        }

        // Generate analysis
        results.analysis = this.analyzeDataStructureResults(results.results);
        
        return results;
    }

    /**
     * Run comprehensive algorithm and data structure tests
     * @returns {Object} Complete test suite results
     */
    static runComprehensiveTests() {
        console.log('Starting comprehensive algorithm and data structure tests...');
        
        const startTime = performance.now();
        
        const sortingResults = this.testSortingAlgorithms();
        const searchResults = this.testSearchAlgorithms();
        const dataStructureResults = this.testDataStructures();
        
        const endTime = performance.now();
        
        const comprehensiveResults = {
            testSuite: 'Comprehensive Algorithm and Data Structure Analysis',
            testDate: new Date(),
            totalExecutionTime: endTime - startTime,
            results: {
                sorting: sortingResults,
                searching: searchResults,
                dataStructures: dataStructureResults
            },
            summary: {
                totalTests: Object.keys(sortingResults.results).length + 
                           Object.keys(searchResults.results).length + 
                           Object.keys(dataStructureResults.results.queue).length,
                recommendations: this.generateRecommendations(sortingResults, searchResults, dataStructureResults)
            }
        };

        console.log(`Comprehensive tests completed in ${(endTime - startTime).toFixed(2)}ms`);
        
        return comprehensiveResults;
    }

    // Analysis helper methods
    static analyzeSortingResults(results) {
        const analysis = {
            bestForSmallData: null,
            bestForLargeData: null,
            mostStable: [],
            leastComparisons: null,
            recommendations: {}
        };

        // Find best algorithms for different scenarios
        const algorithms = ['Insertion Sort', 'Selection Sort', 'Quick Sort', 'Merge Sort'];
        
        // Analyze small data performance (size 10)
        if (results[10] && results[10].random) {
            let fastest = null;
            let fastestTime = Infinity;
            
            for (const algo of algorithms) {
                const time = results[10].random[algo].executionTime;
                if (time < fastestTime) {
                    fastestTime = time;
                    fastest = algo;
                }
            }
            analysis.bestForSmallData = fastest;
        }

        // Find stable algorithms
        for (const algo of algorithms) {
            if (results[100] && results[100].random && results[100].random[algo].stable) {
                analysis.mostStable.push(algo);
            }
        }

        return analysis;
    }

    static analyzeSearchResults(results) {
        const analysis = {
            bestForSortedData: null,
            bestForUnsortedData: null,
            scalabilityAnalysis: {},
            recommendations: {}
        };

        // Analyze scalability
        const algorithms = ['Linear Search', 'Binary Search', 'Hash Search'];
        for (const algo of algorithms) {
            analysis.scalabilityAnalysis[algo] = {
                averageTimeIncrease: 0,
                comparisonGrowth: 'linear' // This would be calculated based on actual data
            };
        }

        return analysis;
    }

    static analyzeDataStructureResults(results) {
        const analysis = {
            queuePerformance: {
                averageEnqueueTime: 0,
                averageDequeueTime: 0,
                scalability: 'O(1)'
            },
            stackPerformance: {
                averagePushTime: 0,
                averagePopTime: 0,
                scalability: 'O(1)'
            },
            comparison: {
                fasterForInsertion: null,
                fasterForRemoval: null
            }
        };

        return analysis;
    }

    static generateRecommendations(sortingResults, searchResults, dataStructureResults) {
        return {
            sorting: {
                smallDatasets: 'Use Insertion Sort for datasets < 50 elements',
                largeDatasets: 'Use Quick Sort or Merge Sort for datasets > 1000 elements',
                stabilityRequired: 'Use Merge Sort when stability is important'
            },
            searching: {
                sortedData: 'Use Binary Search for sorted datasets',
                unsortedData: 'Use Hash Search for frequent lookups',
                textSearch: 'Use specialized text search algorithms for string matching'
            },
            dataStructures: {
                orderProcessing: 'Use Queue for FIFO order processing',
                undoOperations: 'Use Stack for undo/redo functionality',
                performance: 'Both Queue and Stack provide O(1) operations'
            }
        };
    }
}

module.exports = AlgorithmTester;
