package com.library.controller;

import com.library.model.Book;
import com.library.service.BookService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
public class BookController {

    @Autowired
    private BookService bookService;

    // View all books (public page)
    @GetMapping("/books")
    public String viewBooks(@RequestParam(required = false) String search, Model model, HttpSession session) {
        if (search != null && !search.trim().isEmpty()) {
            model.addAttribute("books", bookService.searchBooks(search));
            model.addAttribute("search", search);
        } else {
            model.addAttribute("books", bookService.getAllBooks());
        }
        // Check if student is logged in for borrow button
        model.addAttribute("isStudentLoggedIn", session.getAttribute("studentId") != null);
        return "books";
    }

    // Show add book form (librarian)
    @GetMapping("/librarian/books/add")
    public String showAddBookForm(HttpSession session, Model model) {
        if (session.getAttribute("librarianId") == null) {
            return "redirect:/librarian/login";
        }
        model.addAttribute("book", new Book());
        return "add-book";
    }

    // Handle add book (librarian)
    @PostMapping("/librarian/books/add")
    public String addBook(@ModelAttribute Book book, HttpSession session, RedirectAttributes redirectAttributes) {
        if (session.getAttribute("librarianId") == null) {
            return "redirect:/librarian/login";
        }
        bookService.addBook(book);
        redirectAttributes.addFlashAttribute("success", "Book added successfully!");
        return "redirect:/librarian/books";
    }

    // Manage books (librarian)
    @GetMapping("/librarian/books")
    public String manageBooks(HttpSession session, Model model) {
        if (session.getAttribute("librarianId") == null) {
            return "redirect:/librarian/login";
        }
        model.addAttribute("books", bookService.getAllBooks());
        return "manage-books";
    }

    // Show edit book form (librarian)
    @GetMapping("/librarian/books/edit/{id}")
    public String showEditBookForm(@PathVariable Long id, HttpSession session, Model model) {
        if (session.getAttribute("librarianId") == null) {
            return "redirect:/librarian/login";
        }
        Book book = bookService.getBookById(id);
        if (book == null) {
            return "redirect:/librarian/books";
        }
        model.addAttribute("book", book);
        return "edit-book";
    }

    // Handle edit book (librarian)
    @PostMapping("/librarian/books/edit/{id}")
    public String updateBook(@PathVariable Long id, @ModelAttribute Book book,
                             HttpSession session, RedirectAttributes redirectAttributes) {
        if (session.getAttribute("librarianId") == null) {
            return "redirect:/librarian/login";
        }
        String result = bookService.updateBook(id, book);
        if ("success".equals(result)) {
            redirectAttributes.addFlashAttribute("success", "Book updated successfully!");
        } else {
            redirectAttributes.addFlashAttribute("error", result);
        }
        return "redirect:/librarian/books";
    }

    // Delete book (librarian)
    @GetMapping("/librarian/books/delete/{id}")
    public String deleteBook(@PathVariable Long id, HttpSession session, RedirectAttributes redirectAttributes) {
        if (session.getAttribute("librarianId") == null) {
            return "redirect:/librarian/login";
        }
        String result = bookService.deleteBook(id);
        if ("success".equals(result)) {
            redirectAttributes.addFlashAttribute("success", "Book deleted successfully!");
        } else {
            redirectAttributes.addFlashAttribute("error", result);
        }
        return "redirect:/librarian/books";
    }
}
