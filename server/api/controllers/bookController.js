const Book = require('../models/bookModel');
const SortingAlgorithms = require('../../utils/algorithms/SortingAlgorithms');
const SearchAlgorithms = require('../../utils/algorithms/SearchAlgorithms');

// @desc    Get all books with sorting and search options
// @route   GET /api/books
exports.getBooks = async (req, res) => {
    try {
        const { 
            sortBy = 'title', 
            sortAlgorithm = 'quick', 
            order = 'asc',
            search,
            searchType = 'title'
        } = req.query;
        
        let books = await Book.find({});
        
        let searchResult = null;
        
        // Apply search if provided
        if (search) {
            switch (searchType) {
                case 'title':
                    searchResult = SearchAlgorithms.fuzzySearch(
                        books, 
                        search, 
                        book => book.title,
                        2
                    );
                    if (searchResult.found) {
                        books = searchResult.matches.map(match => match.element);
                    } else {
                        books = [];
                    }
                    break;
                case 'author':
                    searchResult = SearchAlgorithms.fuzzySearch(
                        books,
                        search,
                        book => book.author,
                        2
                    );
                    if (searchResult.found) {
                        books = searchResult.matches.map(match => match.element);
                    } else {
                        books = [];
                    }
                    break;
                default:
                    searchResult = SearchAlgorithms.textSearch(
                        books.map(book => `${book.title} ${book.author} ${book.description || ''}`).join(' '),
                        search
                    );
                    if (searchResult.found) {
                        // For text search, we need to return all books since we searched the combined text
                        // This is a simplified approach - in production you'd want more sophisticated matching
                        books = books;
                    } else {
                        books = [];
                    }
            }
        }
        
        // Apply sorting
        if (books.length > 1) {
            const compareFunction = (a, b) => {
                let aValue = a[sortBy];
                let bValue = b[sortBy];
                
                // Handle string comparison
                if (typeof aValue === 'string') {
                    aValue = aValue.toLowerCase();
                    bValue = bValue.toLowerCase();
                }
                
                if (order === 'desc') {
                    return aValue < bValue;
                } else {
                    return aValue > bValue;
                }
            };
            
            let sortingResult;
            switch (sortAlgorithm) {
                case 'insertion':
                    sortingResult = SortingAlgorithms.insertionSort(books, compareFunction);
                    break;
                case 'selection':
                    sortingResult = SortingAlgorithms.selectionSort(books, compareFunction);
                    break;
                case 'merge':
                    sortingResult = SortingAlgorithms.mergeSort(books, compareFunction);
                    break;
                default:
                    sortingResult = SortingAlgorithms.quickSort(books, compareFunction);
            }
            
            res.json({
                books: sortingResult.sortedArray,
                algorithmInfo: {
                    sorting: {
                        algorithm: sortingResult.algorithm,
                        executionTime: sortingResult.executionTime,
                        comparisons: sortingResult.comparisons,
                        sortBy,
                        order
                    },
                    search: search ? {
                        searchTerm: search,
                        searchType,
                        found: searchResult?.found || false,
                        matchCount: searchResult?.matches?.length || 0
                    } : null
                }
            });
        } else {
            res.json({ books, algorithmInfo: null });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get a single book
// @route   GET /api/books/:id
exports.getBookById = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (book) {
            res.json(book);
        } else {
            res.status(404).json({ message: 'Book not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Create a new book
// @route   POST /api/books
exports.createBook = async (req, res) => {
    try {
        const { title, author, description, price, stock, imageUrl } = req.body;
        
        const book = new Book({
            title,
            author,
            description,
            price,
            stock,
            imageUrl
        });
        
        const savedBook = await book.save();
        res.status(201).json(savedBook);
    } catch (error) {
        console.error('Create book error:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Update a book
// @route   PUT /api/books/:id
exports.updateBook = async (req, res) => {
    try {
        const { title, author, description, price, stock, imageUrl } = req.body;
        const book = await Book.findById(req.params.id);
        
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        book.title = title;
        book.author = author;
        book.description = description;
        book.price = price;
        book.stock = stock;
        book.imageUrl = imageUrl;

        const updatedBook = await book.save();
        res.json(updatedBook);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Delete a book
// @route   DELETE /api/books/:id
exports.deleteBook = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);

        if (book) {
            await Book.findByIdAndDelete(req.params.id);
            res.json({ message: 'Book removed' });
        } else {
            res.status(404).json({ message: 'Book not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
