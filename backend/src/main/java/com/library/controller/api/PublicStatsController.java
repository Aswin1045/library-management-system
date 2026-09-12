package com.library.controller.api;

import com.library.repository.BookRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/stats")
public class PublicStatsController {

    @Autowired
    private BookRepository bookRepository;

    /**
     * Publicly accessible stats — safe to call without auth.
     * Returns only aggregate numbers (no student/librarian data).
     */
    @GetMapping("/public")
    public ResponseEntity<Map<String, Object>> getPublicStats() {
        long totalBooks = bookRepository.count();
        List<String> categories = bookRepository.findAllCategories();

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalBooks", totalBooks);
        stats.put("totalCategories", (long) categories.size());
        stats.put("categories", categories);

        return ResponseEntity.ok(stats);
    }
}
