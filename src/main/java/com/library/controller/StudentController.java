package com.library.controller;

import com.library.model.Student;
import com.library.service.StudentService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
public class StudentController {

    @Autowired
    private StudentService studentService;

    // Show registration form
    @GetMapping("/register")
    public String showRegisterForm(Model model) {
        model.addAttribute("student", new Student());
        return "register";
    }

    // Handle registration
    @PostMapping("/register")
    public String registerStudent(@ModelAttribute Student student, Model model, RedirectAttributes redirectAttributes) {
        String result = studentService.registerStudent(student);
        if ("success".equals(result)) {
            redirectAttributes.addFlashAttribute("success", "Registration Successful! Please login.");
            return "redirect:/student/login";
        } else {
            model.addAttribute("error", result);
            model.addAttribute("student", student);
            return "register";
        }
    }

    // Show student login form
    @GetMapping("/student/login")
    public String showLoginForm() {
        return "student-login";
    }

    // Handle student login
    @PostMapping("/student/login")
    public String loginStudent(@RequestParam String email, @RequestParam String password,
                               HttpSession session, Model model) {
        Student student = studentService.loginStudent(email, password);
        if (student != null) {
            session.setAttribute("studentId", student.getId());
            session.setAttribute("studentName", student.getName());
            return "redirect:/student/home";
        } else {
            model.addAttribute("error", "Invalid email or password");
            return "student-login";
        }
    }

    // Student home page
    @GetMapping("/student/home")
    public String studentHome(HttpSession session, Model model) {
        if (session.getAttribute("studentId") == null) {
            return "redirect:/student/login";
        }
        model.addAttribute("studentName", session.getAttribute("studentName"));
        return "student-home";
    }

    // Student logout
    @GetMapping("/student/logout")
    public String logout(HttpSession session) {
        session.removeAttribute("studentId");
        session.removeAttribute("studentName");
        return "redirect:/";
    }
}
