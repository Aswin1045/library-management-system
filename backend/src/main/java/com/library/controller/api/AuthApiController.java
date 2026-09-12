package com.library.controller.api;

import com.library.model.Librarian;
import com.library.model.Student;
import com.library.service.LibrarianService;
import com.library.service.StudentService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthApiController {

    @Autowired
    private StudentService studentService;

    @Autowired
    private LibrarianService librarianService;

    // Student Login
    @PostMapping("/student/login")
    public ResponseEntity<?> loginStudent(@RequestBody Map<String, String> credentials, HttpSession session) {
        Student student = studentService.loginStudent(credentials.get("email"), credentials.get("password"));
        if (student != null) {
            session.setAttribute("studentId", student.getId());
            session.setAttribute("studentName", student.getName());
            return ResponseEntity.ok(Map.of("message", "Login successful", "user", student));
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid email or password"));
    }

    // Student Register
    @PostMapping("/student/register")
    public ResponseEntity<?> registerStudent(@RequestBody Student student) {
        String result = studentService.registerStudent(student);
        if ("success".equals(result)) {
            return ResponseEntity.ok(Map.of("message", "Registration successful"));
        }
        return ResponseEntity.badRequest().body(Map.of("error", result));
    }

    // Librarian Login
    @PostMapping("/librarian/login")
    public ResponseEntity<?> loginLibrarian(@RequestBody Map<String, String> credentials, HttpSession session) {
        Librarian librarian = librarianService.loginLibrarian(credentials.get("username"), credentials.get("password"));
        if (librarian != null) {
            session.setAttribute("librarianId", librarian.getId());
            session.setAttribute("librarianName", librarian.getUsername());
            return ResponseEntity.ok(Map.of("message", "Login successful", "user", librarian));
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid username or password"));
    }

    // Logout
    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpSession session) {
        session.invalidate();
        return ResponseEntity.ok(Map.of("message", "Logged out successfully"));
    }

    // Get current user
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(HttpSession session) {
        if (session.getAttribute("studentId") != null) {
            Map<String, Object> response = new HashMap<>();
            response.put("role", "STUDENT");
            response.put("id", session.getAttribute("studentId"));
            response.put("name", session.getAttribute("studentName"));
            return ResponseEntity.ok(response);
        } else if (session.getAttribute("librarianId") != null) {
            Map<String, Object> response = new HashMap<>();
            response.put("role", "LIBRARIAN");
            response.put("id", session.getAttribute("librarianId"));
            response.put("name", session.getAttribute("librarianName"));
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Not authenticated"));
    }
}
