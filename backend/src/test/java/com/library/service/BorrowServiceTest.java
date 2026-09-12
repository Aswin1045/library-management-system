package com.library.service;

import com.library.model.Book;
import com.library.model.BorrowRecord;
import com.library.model.Student;
import com.library.repository.BookRepository;
import com.library.repository.BorrowRecordRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class BorrowServiceTest {

    @Mock
    private BorrowRecordRepository borrowRecordRepository;

    @Mock
    private BookRepository bookRepository;

    @InjectMocks
    private BorrowService borrowService;

    private Student testStudent;
    private Book testBook;
    private BorrowRecord testRecord;

    @BeforeEach
    void setUp() {
        testStudent = new Student();
        testStudent.setId(1L);

        testBook = new Book();
        testBook.setId(1L);
        testBook.setAvailableQuantity(5);

        testRecord = new BorrowRecord();
        testRecord.setId(1L);
        testRecord.setStudent(testStudent);
        testRecord.setBook(testBook);
        testRecord.setStatus(BorrowRecord.BorrowStatus.BORROWED);
    }

    @Test
    void testBorrowBook_Success() {
        when(bookRepository.findById(1L)).thenReturn(Optional.of(testBook));
        when(borrowRecordRepository.findByStudentAndBookAndStatus(testStudent, testBook, BorrowRecord.BorrowStatus.BORROWED))
                .thenReturn(Optional.empty());

        String result = borrowService.borrowBook(testStudent, 1L);
        
        assertEquals("success", result);
        assertEquals(4, testBook.getAvailableQuantity());
        verify(borrowRecordRepository).save(any(BorrowRecord.class));
        verify(bookRepository).save(testBook);
    }

    @Test
    void testBorrowBook_NoAvailableQuantity() {
        testBook.setAvailableQuantity(0);
        when(bookRepository.findById(1L)).thenReturn(Optional.of(testBook));

        String result = borrowService.borrowBook(testStudent, 1L);
        
        assertEquals("Book is currently unavailable", result);
        verify(borrowRecordRepository, never()).save(any(BorrowRecord.class));
    }

    @Test
    void testBorrowBook_AlreadyBorrowed() {
        when(bookRepository.findById(1L)).thenReturn(Optional.of(testBook));
        when(borrowRecordRepository.findByStudentAndBookAndStatus(testStudent, testBook, BorrowRecord.BorrowStatus.BORROWED))
                .thenReturn(Optional.of(testRecord));

        String result = borrowService.borrowBook(testStudent, 1L);
        
        assertEquals("You have already borrowed this book", result);
        verify(borrowRecordRepository, never()).save(any(BorrowRecord.class));
    }

    @Test
    void testReturnBook_Success() {
        when(borrowRecordRepository.findById(1L)).thenReturn(Optional.of(testRecord));

        String result = borrowService.returnBook(1L);
        
        assertEquals("success", result);
        assertEquals(BorrowRecord.BorrowStatus.RETURNED, testRecord.getStatus());
        assertNotNull(testRecord.getReturnDate());
        assertEquals(6, testBook.getAvailableQuantity());
        verify(borrowRecordRepository).save(testRecord);
        verify(bookRepository).save(testBook);
    }

    @Test
    void testReturnBook_AlreadyReturned() {
        testRecord.setStatus(BorrowRecord.BorrowStatus.RETURNED);
        when(borrowRecordRepository.findById(1L)).thenReturn(Optional.of(testRecord));

        String result = borrowService.returnBook(1L);
        
        assertEquals("Book already returned", result);
        verify(borrowRecordRepository, never()).save(any(BorrowRecord.class));
    }
}
