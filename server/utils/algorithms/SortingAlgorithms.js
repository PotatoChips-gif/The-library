/**
 * Sorting Algorithms Implementation
 * Contains various sorting algorithms with complexity analysis
 * Used for sorting books and orders in the bookstore system
 */

class SortingAlgorithms {
    
    /**
     * Insertion Sort Algorithm
     * Time Complexity: O(n²) worst/average case, O(n) best case
     * Space Complexity: O(1)
     * Stable: Yes
     * Best for: Small datasets or nearly sorted data
     */
    static insertionSort(arr, compareFunction = null) {
        const startTime = performance.now();
        let comparisons = 0;
        let swaps = 0;
        
        const compare = compareFunction || ((a, b) => a > b);
        const result = [...arr]; // Create copy to avoid mutation
        
        for (let i = 1; i < result.length; i++) {
            let key = result[i];
            let j = i - 1;
            
            while (j >= 0 && (comparisons++, compare(result[j], key))) {
                result[j + 1] = result[j];
                swaps++;
                j--;
            }
            result[j + 1] = key;
        }
        
        const endTime = performance.now();
        
        return {
            sortedArray: result,
            algorithm: 'Insertion Sort',
            timeComplexity: 'O(n²)',
            spaceComplexity: 'O(1)',
            executionTime: endTime - startTime,
            comparisons,
            swaps,
            stable: true
        };
    }

    /**
     * Selection Sort Algorithm
     * Time Complexity: O(n²) all cases
     * Space Complexity: O(1)
     * Stable: No
     * Best for: Small datasets where memory is limited
     */
    static selectionSort(arr, compareFunction = null) {
        const startTime = performance.now();
        let comparisons = 0;
        let swaps = 0;
        
        const compare = compareFunction || ((a, b) => a > b);
        const result = [...arr];
        
        for (let i = 0; i < result.length - 1; i++) {
            let minIndex = i;
            
            for (let j = i + 1; j < result.length; j++) {
                comparisons++;
                if (compare(result[minIndex], result[j])) {
                    minIndex = j;
                }
            }
            
            if (minIndex !== i) {
                [result[i], result[minIndex]] = [result[minIndex], result[i]];
                swaps++;
            }
        }
        
        const endTime = performance.now();
        
        return {
            sortedArray: result,
            algorithm: 'Selection Sort',
            timeComplexity: 'O(n²)',
            spaceComplexity: 'O(1)',
            executionTime: endTime - startTime,
            comparisons,
            swaps,
            stable: false
        };
    }

    /**
     * Quick Sort Algorithm
     * Time Complexity: O(n log n) average, O(n²) worst case
     * Space Complexity: O(log n) average
     * Stable: No
     * Best for: Large datasets, general purpose
     */
    static quickSort(arr, compareFunction = null) {
        const startTime = performance.now();
        let comparisons = 0;
        let swaps = 0;
        
        const compare = compareFunction || ((a, b) => a > b);
        const result = [...arr];
        
        function quickSortHelper(arr, low, high) {
            if (low < high) {
                const pivotIndex = partition(arr, low, high);
                quickSortHelper(arr, low, pivotIndex - 1);
                quickSortHelper(arr, pivotIndex + 1, high);
            }
        }
        
        function partition(arr, low, high) {
            const pivot = arr[high];
            let i = low - 1;
            
            for (let j = low; j < high; j++) {
                comparisons++;
                if (!compare(arr[j], pivot)) {
                    i++;
                    if (i !== j) {
                        [arr[i], arr[j]] = [arr[j], arr[i]];
                        swaps++;
                    }
                }
            }
            
            if (i + 1 !== high) {
                [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
                swaps++;
            }
            
            return i + 1;
        }
        
        quickSortHelper(result, 0, result.length - 1);
        
        const endTime = performance.now();
        
        return {
            sortedArray: result,
            algorithm: 'Quick Sort',
            timeComplexity: 'O(n log n) avg, O(n²) worst',
            spaceComplexity: 'O(log n)',
            executionTime: endTime - startTime,
            comparisons,
            swaps,
            stable: false
        };
    }

    /**
     * Merge Sort Algorithm
     * Time Complexity: O(n log n) all cases
     * Space Complexity: O(n)
     * Stable: Yes
     * Best for: Large datasets, when stability is required
     */
    static mergeSort(arr, compareFunction = null) {
        const startTime = performance.now();
        let comparisons = 0;
        let merges = 0;
        
        const compare = compareFunction || ((a, b) => a > b);
        
        function mergeSortHelper(arr) {
            if (arr.length <= 1) {
                return arr;
            }
            
            const mid = Math.floor(arr.length / 2);
            const left = mergeSortHelper(arr.slice(0, mid));
            const right = mergeSortHelper(arr.slice(mid));
            
            return merge(left, right);
        }
        
        function merge(left, right) {
            const result = [];
            let leftIndex = 0;
            let rightIndex = 0;
            
            while (leftIndex < left.length && rightIndex < right.length) {
                comparisons++;
                if (!compare(left[leftIndex], right[rightIndex])) {
                    result.push(left[leftIndex]);
                    leftIndex++;
                } else {
                    result.push(right[rightIndex]);
                    rightIndex++;
                }
                merges++;
            }
            
            while (leftIndex < left.length) {
                result.push(left[leftIndex]);
                leftIndex++;
                merges++;
            }
            
            while (rightIndex < right.length) {
                result.push(right[rightIndex]);
                rightIndex++;
                merges++;
            }
            
            return result;
        }
        
        const result = mergeSortHelper([...arr]);
        const endTime = performance.now();
        
        return {
            sortedArray: result,
            algorithm: 'Merge Sort',
            timeComplexity: 'O(n log n)',
            spaceComplexity: 'O(n)',
            executionTime: endTime - startTime,
            comparisons,
            merges,
            stable: true
        };
    }

    /**
     * Compare sorting algorithms performance
     * @param {Array} data - Data to sort
     * @param {Function} compareFunction - Comparison function
     * @returns {Object} Performance comparison results
     */
    static compareAlgorithms(data, compareFunction = null) {
        const algorithms = [
            this.insertionSort,
            this.selectionSort,
            this.quickSort,
            this.mergeSort
        ];
        
        const results = algorithms.map(algorithm => 
            algorithm(data, compareFunction)
        );
        
        return {
            dataSize: data.length,
            results,
            fastest: results.reduce((min, current) => 
                current.executionTime < min.executionTime ? current : min
            ),
            summary: {
                averageTime: results.reduce((sum, r) => sum + r.executionTime, 0) / results.length,
                totalComparisons: results.reduce((sum, r) => sum + (r.comparisons || 0), 0),
                stableAlgorithms: results.filter(r => r.stable).length
            }
        };
    }
}

module.exports = SortingAlgorithms;
