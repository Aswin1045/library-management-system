package com.library.service;

import com.library.model.Student;
import com.library.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

import org.springframework.security.crypto.password.PasswordEncoder;

@Service
public class StudentService {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // Register a new student
    public String registerStudent(Student student) {
        if (studentRepository.existsByEmail(student.getEmail())) {
            return "Email already registered";
        }
        student.setPassword(passwordEncoder.encode(student.getPassword()));
        studentRepository.save(student);
        return "success";
    }

    // Login student
    public Student loginStudent(String email, String password) {
        Optional<Student> studentOpt = studentRepository.findByEmail(email);
        if (studentOpt.isPresent() && passwordEncoder.matches(password, studentOpt.get().getPassword())) {
            return studentOpt.get();
        }
        return null;
    }

    // Get all students
    public org.springframework.data.domain.Page<Student> getAllStudents(org.springframework.data.domain.Pageable pageable) {
        return studentRepository.findAll(pageable);
    }

    // Get student by ID
    public Student getStudentById(Long id) {
        return studentRepository.findById(id).orElse(null);
    }
}
