/**
 * Search Algorithms Implementation
 * Contains various search algorithms with complexity analysis
 * Used for finding books, orders, and users in the bookstore system
 */

class SearchAlgorithms {
    
    /**
     * Linear Search Algorithm
     * Time Complexity: O(n)
     * Space Complexity: O(1)
     * Best for: Unsorted data, small datasets
     */
    static linearSearch(arr, target, keyFunction = null) {
        const startTime = performance.now();
        let comparisons = 0;
        
        const getKey = keyFunction || (item => item);
        
        for (let i = 0; i < arr.length; i++) {
            comparisons++;
            if (getKey(arr[i]) === target) {
                const endTime = performance.now();
                return {
                    found: true,
                    index: i,
                    element: arr[i],
                    algorithm: 'Linear Search',
                    timeComplexity: 'O(n)',
                    spaceComplexity: 'O(1)',
                    executionTime: endTime - startTime,
                    comparisons
                };
            }
        }
        
        const endTime = performance.now();
        return {
            found: false,
            index: -1,
            element: null,
            algorithm: 'Linear Search',
            timeComplexity: 'O(n)',
            spaceComplexity: 'O(1)',
            executionTime: endTime - startTime,
            comparisons
        };
    }

    /**
     * Binary Search Algorithm
     * Time Complexity: O(log n)
     * Space Complexity: O(1)
     * Prerequisite: Array must be sorted
     * Best for: Large sorted datasets
     */
    static binarySearch(sortedArr, target, keyFunction = null) {
        const startTime = performance.now();
        let comparisons = 0;
        
        const getKey = keyFunction || (item => item);
        let left = 0;
        let right = sortedArr.length - 1;
        
        while (left <= right) {
            const mid = Math.floor((left + right) / 2);
            const midValue = getKey(sortedArr[mid]);
            
            comparisons++;
            if (midValue === target) {
                const endTime = performance.now();
                return {
                    found: true,
                    index: mid,
                    element: sortedArr[mid],
                    algorithm: 'Binary Search',
                    timeComplexity: 'O(log n)',
                    spaceComplexity: 'O(1)',
                    executionTime: endTime - startTime,
                    comparisons
                };
            } else if (midValue < target) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
        
        const endTime = performance.now();
        return {
            found: false,
            index: -1,
            element: null,
            algorithm: 'Binary Search',
            timeComplexity: 'O(log n)',
            spaceComplexity: 'O(1)',
            executionTime: endTime - startTime,
            comparisons
        };
    }

    /**
     * Hash-based Search using JavaScript Map
     * Time Complexity: O(1) average case, O(n) worst case
     * Space Complexity: O(n)
     * Best for: Frequent lookups, key-value pairs
     */
    static hashSearch(data, target, keyFunction = null) {
        const startTime = performance.now();
        let comparisons = 0;
        
        // Build hash table if not already provided
        const hashTable = new Map();
        const getKey = keyFunction || (item => item.id || item);
        
        // Build hash table
        for (let i = 0; i < data.length; i++) {
            const key = getKey(data[i]);
            hashTable.set(key, { index: i, element: data[i] });
        }
        
        // Search in hash table
        comparisons = 1;
        const result = hashTable.get(target);
        
        const endTime = performance.now();
        
        if (result) {
            return {
                found: true,
                index: result.index,
                element: result.element,
                algorithm: 'Hash Search',
                timeComplexity: 'O(1) avg, O(n) worst',
                spaceComplexity: 'O(n)',
                executionTime: endTime - startTime,
                comparisons
            };
        } else {
            return {
                found: false,
                index: -1,
                element: null,
                algorithm: 'Hash Search',
                timeComplexity: 'O(1) avg, O(n) worst',
                spaceComplexity: 'O(n)',
                executionTime: endTime - startTime,
                comparisons
            };
        }
    }

    /**
     * Text Search Algorithm (Boyer-Moore inspired)
     * Time Complexity: O(n + m) where n is text length, m is pattern length
     * Space Complexity: O(m)
     * Best for: Text searching in book titles, descriptions
     */
    static textSearch(text, pattern, caseSensitive = false) {
        const startTime = performance.now();
        let comparisons = 0;
        let matches = [];
        
        if (!pattern || pattern.length === 0) {
            return {
                found: false,
                matches: [],
                algorithm: 'Text Search',
                timeComplexity: 'O(n + m)',
                spaceComplexity: 'O(m)',
                executionTime: 0,
                comparisons: 0
            };
        }
        
        const searchText = caseSensitive ? text : text.toLowerCase();
        const searchPattern = caseSensitive ? pattern : pattern.toLowerCase();
        
        for (let i = 0; i <= searchText.length - searchPattern.length; i++) {
            let match = true;
            for (let j = 0; j < searchPattern.length; j++) {
                comparisons++;
                if (searchText[i + j] !== searchPattern[j]) {
                    match = false;
                    break;
                }
            }
            
            if (match) {
                matches.push({
                    index: i,
                    text: text.substring(i, i + searchPattern.length)
                });
            }
        }
        
        const endTime = performance.now();
        
        return {
            found: matches.length > 0,
            matches,
            algorithm: 'Text Search',
            timeComplexity: 'O(n + m)',
            spaceComplexity: 'O(m)',
            executionTime: endTime - startTime,
            comparisons
        };
    }

    /**
     * Fuzzy Search Algorithm (Levenshtein Distance based)
     * Time Complexity: O(n * m) where n is text length, m is pattern length
     * Space Complexity: O(m)
     * Best for: Approximate matching, typo tolerance
     */
    static fuzzySearch(data, query, keyFunction = null, threshold = 2) {
        const startTime = performance.now();
        let comparisons = 0;
        
        const getKey = keyFunction || (item => item.toString());
        const results = [];
        
        function levenshteinDistance(str1, str2) {
            const matrix = [];
            
            for (let i = 0; i <= str2.length; i++) {
                matrix[i] = [i];
            }
            
            for (let j = 0; j <= str1.length; j++) {
                matrix[0][j] = j;
            }
            
            for (let i = 1; i <= str2.length; i++) {
                for (let j = 1; j <= str1.length; j++) {
                    comparisons++;
                    if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
                        matrix[i][j] = matrix[i - 1][j - 1];
                    } else {
                        matrix[i][j] = Math.min(
                            matrix[i - 1][j - 1] + 1,
                            matrix[i][j - 1] + 1,
                            matrix[i - 1][j] + 1
                        );
                    }
                }
            }
            
            return matrix[str2.length][str1.length];
        }
        
        for (let i = 0; i < data.length; i++) {
            const text = getKey(data[i]).toLowerCase();
            const distance = levenshteinDistance(query.toLowerCase(), text);
            
            if (distance <= threshold) {
                results.push({
                    index: i,
                    element: data[i],
                    distance,
                    similarity: 1 - (distance / Math.max(query.length, text.length))
                });
            }
        }
        
        // Sort by similarity (highest first)
        results.sort((a, b) => b.similarity - a.similarity);
        
        const endTime = performance.now();
        
        return {
            found: results.length > 0,
            matches: results,
            algorithm: 'Fuzzy Search',
            timeComplexity: 'O(n * m)',
            spaceComplexity: 'O(m)',
            executionTime: endTime - startTime,
            comparisons,
            threshold
        };
    }

    /**
     * Compare search algorithms performance
     * @param {Array} data - Data to search
     * @param {*} target - Target to find
     * @param {Function} keyFunction - Key extraction function
     * @returns {Object} Performance comparison results
     */
    static compareSearchAlgorithms(data, target, keyFunction = null) {
        const results = [];
        
        // Linear search (works on any data)
        results.push(this.linearSearch(data, target, keyFunction));
        
        // Binary search (requires sorted data)
        const sortedData = [...data].sort((a, b) => {
            const getKey = keyFunction || (item => item);
            const aKey = getKey(a);
            const bKey = getKey(b);
            return aKey < bKey ? -1 : aKey > bKey ? 1 : 0;
        });
        results.push(this.binarySearch(sortedData, target, keyFunction));
        
        // Hash search
        results.push(this.hashSearch(data, target, keyFunction));
        
        return {
            dataSize: data.length,
            target,
            results,
            fastest: results.reduce((min, current) => 
                current.executionTime < min.executionTime ? current : min
            ),
            summary: {
                averageTime: results.reduce((sum, r) => sum + r.executionTime, 0) / results.length,
                totalComparisons: results.reduce((sum, r) => sum + r.comparisons, 0),
                foundCount: results.filter(r => r.found).length
            }
        };
    }
}

module.exports = SearchAlgorithms;
