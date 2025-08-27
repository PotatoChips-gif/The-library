/**
 * Queue ADT Implementation - First In First Out (FIFO)
 * Used for order processing in the bookstore system
 * 
 * Time Complexities:
 * - Enqueue: O(1)
 * - Dequeue: O(1)
 * - Peek: O(1)
 * - Size: O(1)
 * - isEmpty: O(1)
 * 
 * Space Complexity: O(n) where n is the number of elements
 */

class Queue {
    constructor() {
        this.items = [];
        this.front = 0;
        this.rear = 0;
    }

    /**
     * Add an element to the rear of the queue
     * @param {*} element - Element to add
     * @returns {number} New size of queue
     */
    enqueue(element) {
        this.items[this.rear] = element;
        this.rear++;
        return this.size();
    }

    /**
     * Remove and return the front element
     * @returns {*} The front element or undefined if empty
     */
    dequeue() {
        if (this.isEmpty()) {
            return undefined;
        }
        
        const item = this.items[this.front];
        delete this.items[this.front];
        this.front++;
        
        // Reset pointers when queue becomes empty
        if (this.front === this.rear) {
            this.front = 0;
            this.rear = 0;
            this.items = [];
        }
        
        return item;
    }

    /**
     * View the front element without removing it
     * @returns {*} The front element or undefined if empty
     */
    peek() {
        if (this.isEmpty()) {
            return undefined;
        }
        return this.items[this.front];
    }

    /**
     * Check if queue is empty
     * @returns {boolean} True if empty, false otherwise
     */
    isEmpty() {
        return this.rear === this.front;
    }

    /**
     * Get the number of elements in queue
     * @returns {number} Size of queue
     */
    size() {
        return this.rear - this.front;
    }

    /**
     * Get all elements in queue (for debugging)
     * @returns {Array} Array of queue elements
     */
    toArray() {
        const result = [];
        for (let i = this.front; i < this.rear; i++) {
            result.push(this.items[i]);
        }
        return result;
    }

    /**
     * Clear all elements from queue
     */
    clear() {
        this.items = [];
        this.front = 0;
        this.rear = 0;
    }

    /**
     * Get string representation of queue
     * @returns {string} String representation
     */
    toString() {
        return `Queue(${this.size()}): [${this.toArray().join(', ')}]`;
    }
}

module.exports = Queue;
