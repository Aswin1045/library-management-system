package com.library.controller.api;

import com.library.model.BorrowRecord;
import com.library.model.Student;
import com.library.service.BorrowService;
import com.library.service.StudentService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class BorrowApiController {

    @Autowired
    private BorrowService borrowService;

    @Autowired
    private StudentService studentService;

    // Borrow a book (Student only)
    @PostMapping("/borrow/{bookId}")
    public ResponseEntity<?> borrowBook(@PathVariable Long bookId, HttpSession session) {
        Long studentId = (Long) session.getAttribute("studentId");
        Student student = studentService.getStudentById(studentId);
        
        String result = borrowService.borrowBook(student, bookId);
        if ("success".equals(result)) {
            return ResponseEntity.ok(Map.of("message", "Book borrowed successfully"));
        }
        return ResponseEntity.badRequest().body(Map.of("error", result));
    }

    // Return a book (Student only)
    @PostMapping("/return/{recordId}")
    public ResponseEntity<?> returnBook(@PathVariable Long recordId, HttpSession session) {
        // Additional security check could verify the record belongs to the student
        String result = borrowService.returnBook(recordId);
        if ("success".equals(result)) {
            return ResponseEntity.ok(Map.of("message", "Book returned successfully"));
        }
        return ResponseEntity.badRequest().body(Map.of("error", result));
    }

    // Get my borrowed books (Student only)
    @GetMapping("/borrow/mine")
    public ResponseEntity<List<BorrowRecord>> getMyBorrowedBooks(HttpSession session) {
        Long studentId = (Long) session.getAttribute("studentId");
        return ResponseEntity.ok(borrowService.getStudentBorrowedBooks(studentId));
    }

    // Get all borrow records (Librarian only)
    @GetMapping("/borrow/records")
    public ResponseEntity<Page<BorrowRecord>> getAllBorrowRecords(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("borrowDate").descending());
        return ResponseEntity.ok(borrowService.getAllBorrowRecords(pageable));
    }
}
