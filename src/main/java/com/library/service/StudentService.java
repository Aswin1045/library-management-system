package com.library.service;

import com.library.model.Student;
import com.library.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class StudentService {

    @Autowired
    private StudentRepository studentRepository;

    // Register a new student
    public String registerStudent(Student student) {
        if (studentRepository.existsByEmail(student.getEmail())) {
            return "Email already registered";
        }
        studentRepository.save(student);
        return "success";
    }

    // Login student
    public Student loginStudent(String email, String password) {
        Optional<Student> student = studentRepository.findByEmailAndPassword(email, password);
        return student.orElse(null);
    }

    // Get all students
    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    // Get student by ID
    public Student getStudentById(Long id) {
        return studentRepository.findById(id).orElse(null);
    }
}
