package com.library.controller;

import com.library.model.Student;
import com.library.service.BorrowService;
import com.library.service.StudentService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
public class BorrowController {

    @Autowired
    private BorrowService borrowService;

    @Autowired
    private StudentService studentService;

    // Borrow a book
    @GetMapping("/student/borrow/{bookId}")
    public String borrowBook(@PathVariable Long bookId, HttpSession session, RedirectAttributes redirectAttributes) {
        Long studentId = (Long) session.getAttribute("studentId");

        Student student = studentService.getStudentById(studentId);
        if (student == null) {
            return "redirect:/student/login";
        }

        String result = borrowService.borrowBook(student, bookId);
        if ("success".equals(result)) {
            redirectAttributes.addFlashAttribute("success", "Book borrowed successfully!");
        } else {
            redirectAttributes.addFlashAttribute("error", result);
        }
        return "redirect:/books";
    }

    // View borrowed books
    @GetMapping("/student/borrowed-books")
    public String borrowedBooks(HttpSession session, Model model) {
        Long studentId = (Long) session.getAttribute("studentId");
        model.addAttribute("records", borrowService.getStudentBorrowedBooks(studentId));
        model.addAttribute("studentName", session.getAttribute("studentName"));
        return "borrowed-books";
    }

    // Return a book
    @GetMapping("/student/return/{recordId}")
    public String returnBook(@PathVariable Long recordId, HttpSession session, RedirectAttributes redirectAttributes) {
        String result = borrowService.returnBook(recordId);
        if ("success".equals(result)) {
            redirectAttributes.addFlashAttribute("success", "Book returned successfully!");
        } else {
            redirectAttributes.addFlashAttribute("error", result);
        }
        return "redirect:/student/borrowed-books";
    }
}
