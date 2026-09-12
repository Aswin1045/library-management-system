package com.library.service;

import com.library.model.Book;
import com.library.repository.BookRepository;
import com.library.repository.BorrowRecordRepository;
import com.library.model.BorrowRecord;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@SuppressWarnings("null")
class BookServiceTest {

    @Mock
    private BookRepository bookRepository;

    @Mock
    private BorrowRecordRepository borrowRecordRepository;

    @InjectMocks
    private BookService bookService;

    private Book testBook;

    @BeforeEach
    void setUp() {
        testBook = new Book();
        testBook.setId(1L);
        testBook.setTitle("Spring Boot Action");
        testBook.setAuthor("Craig Walls");
        testBook.setQuantity(5);
        testBook.setAvailableQuantity(5);
    }

    @Test
    void testAddBook() {
        when(bookRepository.save(any(Book.class))).thenReturn(testBook);
        String result = bookService.addBook(testBook);
        
        assertEquals("success", result);
        verify(bookRepository).save(testBook);
    }

    @Test
    void testUpdateBook_Success() {
        Book updatedBook = new Book();
        updatedBook.setTitle("Updated Title");
        updatedBook.setQuantity(10);
        
        when(bookRepository.findById(1L)).thenReturn(Optional.of(testBook));
        when(bookRepository.save(any(Book.class))).thenReturn(testBook);

        String result = bookService.updateBook(1L, updatedBook);
        
        assertEquals("success", result);
        assertEquals(10, testBook.getQuantity());
        // Since currently borrowed was 0, available should become 10
        assertEquals(10, testBook.getAvailableQuantity());
    }

    @Test
    void testUpdateBook_FailsWhenQuantityLowerThanBorrowed() {
        testBook.setQuantity(5);
        testBook.setAvailableQuantity(0); // All 5 are borrowed

        Book updatedBook = new Book();
        updatedBook.setQuantity(4); // Trying to set lower than currently borrowed (5)

        when(bookRepository.findById(1L)).thenReturn(Optional.of(testBook));

        String result = bookService.updateBook(1L, updatedBook);
        
        assertEquals("Cannot set quantity lower than currently borrowed count", result);
        verify(bookRepository, never()).save(any(Book.class));
    }

    @Test
    void testDeleteBook_FailsWithActiveBorrows() {
        when(bookRepository.findById(1L)).thenReturn(Optional.of(testBook));
        when(borrowRecordRepository.existsByBookAndStatus(testBook, BorrowRecord.BorrowStatus.BORROWED)).thenReturn(true);

        String result = bookService.deleteBook(1L);
        
        assertEquals("Cannot delete book with active borrow records", result);
        verify(bookRepository, never()).delete(any(Book.class));
    }
}
