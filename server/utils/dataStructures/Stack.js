/**
 * Stack ADT Implementation - Last In First Out (LIFO)
 * Used for order processing history and undo operations
 * 
 * Time Complexities:
 * - Push: O(1)
 * - Pop: O(1)
 * - Peek: O(1)
 * - Size: O(1)
 * - isEmpty: O(1)
 * 
 * Space Complexity: O(n) where n is the number of elements
 */

class Stack {
    constructor() {
        this.items = [];
        this.top = -1;
    }

    /**
     * Add an element to the top of the stack
     * @param {*} element - Element to add
     * @returns {number} New size of stack
     */
    push(element) {
        this.top++;
        this.items[this.top] = element;
        return this.size();
    }

    /**
     * Remove and return the top element
     * @returns {*} The top element or undefined if empty
     */
    pop() {
        if (this.isEmpty()) {
            return undefined;
        }
        
        const item = this.items[this.top];
        delete this.items[this.top];
        this.top--;
        return item;
    }

    /**
     * View the top element without removing it
     * @returns {*} The top element or undefined if empty
     */
    peek() {
        if (this.isEmpty()) {
            return undefined;
        }
        return this.items[this.top];
    }

    /**
     * Check if stack is empty
     * @returns {boolean} True if empty, false otherwise
     */
    isEmpty() {
        return this.top === -1;
    }

    /**
     * Get the number of elements in stack
     * @returns {number} Size of stack
     */
    size() {
        return this.top + 1;
    }

    /**
     * Get all elements in stack (for debugging)
     * @returns {Array} Array of stack elements from bottom to top
     */
    toArray() {
        const result = [];
        for (let i = 0; i <= this.top; i++) {
            result.push(this.items[i]);
        }
        return result;
    }

    /**
     * Clear all elements from stack
     */
    clear() {
        this.items = [];
        this.top = -1;
    }

    /**
     * Get string representation of stack
     * @returns {string} String representation
     */
    toString() {
        return `Stack(${this.size()}): [${this.toArray().join(', ')}]`;
    }

    /**
     * Check if stack contains an element
     * @param {*} element - Element to search for
     * @returns {boolean} True if found, false otherwise
     */
    contains(element) {
        for (let i = 0; i <= this.top; i++) {
            if (this.items[i] === element) {
                return true;
            }
        }
        return false;
    }
}

module.exports = Stack;
