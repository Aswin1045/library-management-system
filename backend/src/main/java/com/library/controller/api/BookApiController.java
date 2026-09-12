package com.library.controller.api;

import com.library.model.Book;
import com.library.service.BookService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/books")
public class BookApiController {

    @Autowired
    private BookService bookService;

    // Get all books (paginated, filtered, searched)
    @GetMapping
    public ResponseEntity<Page<Book>> getBooks(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String category,
            @RequestParam(required = false, defaultValue = "false") boolean availableOnly,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
            
        Pageable pageable = PageRequest.of(page, size);
        Page<Book> books = bookService.searchBooks(search, category, availableOnly, pageable);
        return ResponseEntity.ok(books);
    }

    // Add a book (Librarian only)
    @PostMapping
    public ResponseEntity<?> addBook(@RequestBody Book book) {
        String result = bookService.addBook(book);
        if ("success".equals(result)) {
            return ResponseEntity.ok(Map.of("message", "Book added successfully"));
        }
        return ResponseEntity.badRequest().body(Map.of("error", result));
    }

    // Update a book (Librarian only)
    @PutMapping("/{id}")
    public ResponseEntity<?> updateBook(@PathVariable Long id, @RequestBody Book book) {
        String result = bookService.updateBook(id, book);
        if ("success".equals(result)) {
            return ResponseEntity.ok(Map.of("message", "Book updated successfully"));
        }
        return ResponseEntity.badRequest().body(Map.of("error", result));
    }

    // Delete a book (Librarian only)
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBook(@PathVariable Long id) {
        String result = bookService.deleteBook(id);
        if ("success".equals(result)) {
            return ResponseEntity.ok(Map.of("message", "Book deleted successfully"));
        }
        return ResponseEntity.badRequest().body(Map.of("error", result));
    }
}
