package com.library.controller.api;

import com.library.model.BorrowRecord;
import com.library.repository.BookRepository;
import com.library.repository.BorrowRecordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardApiController {

    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private BorrowRecordRepository borrowRecordRepository;

    // Librarian-only stats
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Long>> getStats() {
        long totalBooks = bookRepository.count();
        long currentlyBorrowed = borrowRecordRepository.findAll().stream()
                .filter(r -> r.getStatus() == BorrowRecord.BorrowStatus.BORROWED)
                .count();
        long lowStock = bookRepository.findAll().stream()
                .filter(b -> b.getAvailableQuantity() <= 1)
                .count();
        long overdue = borrowRecordRepository.findAll().stream()
                .filter(r -> r.getStatus() == BorrowRecord.BorrowStatus.BORROWED)
                .filter(r -> r.getDueDate() != null && r.getDueDate().isBefore(LocalDate.now()))
                .count();

        Map<String, Long> stats = new HashMap<>();
        stats.put("totalBooks", totalBooks);
        stats.put("currentlyBorrowed", currentlyBorrowed);
        stats.put("lowStock", lowStock);
        stats.put("overdue", overdue);

        return ResponseEntity.ok(stats);
    }
}

