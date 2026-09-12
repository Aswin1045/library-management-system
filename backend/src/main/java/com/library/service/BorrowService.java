package com.library.service;

import com.library.model.Book;
import com.library.model.BorrowRecord;
import com.library.model.Student;
import com.library.repository.BookRepository;
import com.library.repository.BorrowRecordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@SuppressWarnings("null")
public class BorrowService {

    @Autowired
    private BorrowRecordRepository borrowRecordRepository;

    @Autowired
    private BookRepository bookRepository;

    // Borrow a book
    @Transactional
    public String borrowBook(Student student, Long bookId) {
        Book book = bookRepository.findById(bookId).orElse(null);

        if (book == null) {
            return "Book not found";
        }

        if (book.getAvailableQuantity() <= 0) {
            return "Book is currently unavailable";
        }

        // Check if student already has this book borrowed
        if (borrowRecordRepository.findByStudentAndBookAndStatus(student, book, BorrowRecord.BorrowStatus.BORROWED).isPresent()) {
            return "You have already borrowed this book";
        }

        // Create borrow record
        BorrowRecord record = new BorrowRecord();
        record.setStudent(student);
        record.setBook(book);
        record.setBorrowDate(LocalDate.now());
        record.setDueDate(LocalDate.now().plusDays(14));
        record.setStatus(BorrowRecord.BorrowStatus.BORROWED);
        borrowRecordRepository.save(record);

        // Decrease available quantity
        book.setAvailableQuantity(book.getAvailableQuantity() - 1);
        bookRepository.save(book);

        return "success";
    }

    // Return a book
    @Transactional
    public String returnBook(Long recordId) {
        BorrowRecord record = borrowRecordRepository.findById(recordId).orElse(null);

        if (record == null) {
            return "Borrow record not found";
        }

        if (record.getStatus() == BorrowRecord.BorrowStatus.RETURNED) {
            return "Book already returned";
        }

        // Update record
        record.setStatus(BorrowRecord.BorrowStatus.RETURNED);
        record.setReturnDate(LocalDate.now());
        borrowRecordRepository.save(record);

        // Increase available quantity
        Book book = record.getBook();
        book.setAvailableQuantity(book.getAvailableQuantity() + 1);
        bookRepository.save(book);

        return "success";
    }

    // Get borrowed books for a student
    public List<BorrowRecord> getStudentBorrowedBooks(Long studentId) {
        return borrowRecordRepository.findByStudentId(studentId);
    }

    // Get all borrow records
    public org.springframework.data.domain.Page<BorrowRecord> getAllBorrowRecords(org.springframework.data.domain.Pageable pageable) {
        return borrowRecordRepository.findAll(pageable);
    }
}
