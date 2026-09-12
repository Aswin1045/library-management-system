package com.library.controller;

import com.library.model.Librarian;
import com.library.service.LibrarianService;
import com.library.service.StudentService;
import com.library.service.BorrowService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/librarian")
public class LibrarianController {

    @Autowired
    private LibrarianService librarianService;

    @Autowired
    private StudentService studentService;

    @Autowired
    private BorrowService borrowService;

    // Show librarian login form
    @GetMapping("/login")
    public String showLoginForm() {
        return "librarian-login";
    }

    @Autowired
    private com.library.repository.LibrarianRepository librarianRepository;

    private static final org.slf4j.Logger logger = org.slf4j.LoggerFactory.getLogger(LibrarianController.class);

    // Handle librarian login
    @PostMapping("/login")
    public String loginLibrarian(@RequestParam String username, @RequestParam String password,
                                 HttpSession session, Model model) {
        logger.info("Login attempt for librarian username: {}", username);
        
        Librarian librarian = librarianService.loginLibrarian(username, password);
        if (librarian != null) {
            logger.info("Login successful for librarian username: {}", username);
            session.setAttribute("librarianId", librarian.getId());
            session.setAttribute("librarianName", librarian.getUsername());
            return "redirect:/librarian/home";
        } else {
            logger.warn("Login failed for librarian username: {}", username);
            model.addAttribute("error", "Invalid username or password");
            model.addAttribute("enteredUsername", username);
            return "librarian-login";
        }
    }

    @Autowired
    private com.library.repository.BookRepository bookRepository;

    @Autowired
    private com.library.repository.BorrowRecordRepository borrowRecordRepository;

    // Librarian home/dashboard
    @GetMapping("/home")
    public String librarianHome(HttpSession session, Model model) {
        model.addAttribute("librarianName", session.getAttribute("librarianName"));
        
        long totalBooks = bookRepository.count();
        long currentlyBorrowed = borrowRecordRepository.findAll().stream()
                .filter(r -> r.getStatus() == com.library.model.BorrowRecord.BorrowStatus.BORROWED)
                .count();
        long lowStock = bookRepository.findAll().stream()
                .filter(b -> b.getAvailableQuantity() <= 1)
                .count();
        long overdue = borrowRecordRepository.findAll().stream()
                .filter(r -> r.getStatus() == com.library.model.BorrowRecord.BorrowStatus.BORROWED)
                .filter(r -> r.getBorrowDate().plusDays(14).isBefore(java.time.LocalDate.now()))
                .count();
        
        model.addAttribute("totalBooks", totalBooks);
        model.addAttribute("currentlyBorrowed", currentlyBorrowed);
        model.addAttribute("lowStock", lowStock);
        model.addAttribute("overdue", overdue);

        return "librarian-home";
    }

    // View all students
    @GetMapping("/students")
    public String viewStudents(@RequestParam(defaultValue = "0") int page, HttpSession session, Model model) {
        org.springframework.data.domain.Pageable pageable = org.springframework.data.domain.PageRequest.of(page, 10);
        org.springframework.data.domain.Page<com.library.model.Student> studentPage = studentService.getAllStudents(pageable);
        model.addAttribute("students", studentPage.getContent());
        model.addAttribute("studentPage", studentPage);
        return "students";
    }

    // View all borrow records
    @GetMapping("/borrow-records")
    public String viewBorrowRecords(@RequestParam(defaultValue = "0") int page, HttpSession session, Model model) {
        org.springframework.data.domain.Pageable pageable = org.springframework.data.domain.PageRequest.of(page, 10, org.springframework.data.domain.Sort.by("borrowDate").descending());
        org.springframework.data.domain.Page<com.library.model.BorrowRecord> recordPage = borrowService.getAllBorrowRecords(pageable);
        model.addAttribute("records", recordPage.getContent());
        model.addAttribute("recordPage", recordPage);
        return "borrow-records";
    }

    // Librarian logout
    @GetMapping("/logout")
    public String logout(HttpSession session) {
        session.removeAttribute("librarianId");
        session.removeAttribute("librarianName");
        return "redirect:/";
    }
}
