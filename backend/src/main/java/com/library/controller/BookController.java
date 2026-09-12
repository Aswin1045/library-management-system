package com.library.controller;

import com.library.model.Book;
import com.library.service.BookService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

@Controller
public class BookController {

    @Autowired
    private BookService bookService;

    // View all books (public page)
    @GetMapping("/books")
    public String viewBooks(
            @RequestParam(required = false) String search, 
            @RequestParam(required = false) String category,
            @RequestParam(required = false, defaultValue = "false") boolean availableOnly,
            @RequestParam(defaultValue = "0") int page,
            Model model, HttpSession session) {
            
        Pageable pageable = PageRequest.of(page, 12); // 12 books per page for grid
        
        Page<Book> bookPage = bookService.searchBooks(search, category, availableOnly, pageable);
        
        model.addAttribute("books", bookPage.getContent());
        model.addAttribute("bookPage", bookPage);
        model.addAttribute("search", search);
        model.addAttribute("category", category);
        model.addAttribute("availableOnly", availableOnly);
        model.addAttribute("categories", bookService.getAllCategories());
        
        // Check if student is logged in for borrow button
        model.addAttribute("isStudentLoggedIn", session.getAttribute("studentId") != null);
        return "books";
    }

    // Show add book form (librarian)
    @GetMapping("/librarian/books/add")
    public String showAddBookForm(HttpSession session, Model model) {
        model.addAttribute("book", new Book());
        return "add-book";
    }

    // Handle add book (librarian)
    @PostMapping("/librarian/books/add")
    public String addBook(@jakarta.validation.Valid @ModelAttribute Book book, org.springframework.validation.BindingResult bindingResult, HttpSession session, RedirectAttributes redirectAttributes) {
        if (bindingResult.hasErrors()) {
            return "add-book";
        }
        bookService.addBook(book);
        redirectAttributes.addFlashAttribute("success", "Book added successfully!");
        return "redirect:/librarian/books";
    }

    // Manage books (librarian)
    @GetMapping("/librarian/books")
    public String manageBooks(@RequestParam(defaultValue = "0") int page, HttpSession session, Model model) {
        Pageable pageable = PageRequest.of(page, 10);
        Page<Book> bookPage = bookService.getAllBooks(pageable);
        model.addAttribute("books", bookPage.getContent());
        model.addAttribute("bookPage", bookPage);
        return "manage-books";
    }

    // Show edit book form (librarian)
    @GetMapping("/librarian/books/edit/{id}")
    public String showEditBookForm(@PathVariable Long id, HttpSession session, Model model) {
        Book book = bookService.getBookById(id);
        if (book == null) {
            return "redirect:/librarian/books";
        }
        model.addAttribute("book", book);
        return "edit-book";
    }

    // Handle edit book (librarian)
    @PostMapping("/librarian/books/edit/{id}")
    public String updateBook(@PathVariable Long id, @jakarta.validation.Valid @ModelAttribute Book book,
                             org.springframework.validation.BindingResult bindingResult, HttpSession session, RedirectAttributes redirectAttributes) {
        if (bindingResult.hasErrors()) {
            return "edit-book";
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
        String result = bookService.deleteBook(id);
        if ("success".equals(result)) {
            redirectAttributes.addFlashAttribute("success", "Book deleted successfully!");
        } else {
            redirectAttributes.addFlashAttribute("error", result);
        }
        return "redirect:/librarian/books";
    }
}
