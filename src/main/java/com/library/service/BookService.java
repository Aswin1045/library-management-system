package com.library.service;

import com.library.model.Book;
import com.library.repository.BookRepository;
import com.library.repository.BorrowRecordRepository;
import com.library.model.BorrowRecord;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BookService {

    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private BorrowRecordRepository borrowRecordRepository;

    // Add a new book
    public String addBook(Book book) {
        book.setAvailableQuantity(book.getQuantity());
        bookRepository.save(book);
        return "success";
    }

    // Get all books
    public List<Book> getAllBooks() {
        return bookRepository.findAll();
    }

    // Get book by ID
    public Book getBookById(Long id) {
        return bookRepository.findById(id).orElse(null);
    }

    // Search books by keyword
    public List<Book> searchBooks(String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            return getAllBooks();
        }
        return bookRepository.searchBooks(keyword.trim());
    }

    // Update a book
    public String updateBook(Long id, Book updatedBook) {
        Book book = bookRepository.findById(id).orElse(null);
        if (book == null) {
            return "Book not found";
        }
        book.setTitle(updatedBook.getTitle());
        book.setAuthor(updatedBook.getAuthor());
        book.setCategory(updatedBook.getCategory());
        book.setIsbn(updatedBook.getIsbn());

        // Calculate how many are currently borrowed
        int currentlyBorrowed = book.getQuantity() - book.getAvailableQuantity();
        book.setQuantity(updatedBook.getQuantity());
        book.setAvailableQuantity(updatedBook.getQuantity() - currentlyBorrowed);

        if (book.getAvailableQuantity() < 0) {
            return "Cannot set quantity lower than currently borrowed count";
        }

        bookRepository.save(book);
        return "success";
    }

    // Delete a book
    public String deleteBook(Long id) {
        Book book = bookRepository.findById(id).orElse(null);
        if (book == null) {
            return "Book not found";
        }
        // Check for active borrow records
        if (borrowRecordRepository.existsByBookAndStatus(book, BorrowRecord.BorrowStatus.BORROWED)) {
            return "Cannot delete book with active borrow records";
        }
        bookRepository.delete(book);
        return "success";
    }
}
