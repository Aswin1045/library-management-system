package com.library.service;

import com.library.model.Student;
import com.library.repository.StudentRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class StudentServiceTest {

    @Mock
    private StudentRepository studentRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private StudentService studentService;

    private Student testStudent;

    @BeforeEach
    void setUp() {
        testStudent = new Student();
        testStudent.setId(1L);
        testStudent.setEmail("student@example.com");
        testStudent.setPassword("plainPassword");
    }

    @Test
    void testRegisterStudent_Success() {
        when(studentRepository.existsByEmail(testStudent.getEmail())).thenReturn(false);
        when(passwordEncoder.encode("plainPassword")).thenReturn("hashedPassword");
        when(studentRepository.save(any(Student.class))).thenReturn(testStudent);

        String result = studentService.registerStudent(testStudent);
        
        assertEquals("success", result);
        assertEquals("hashedPassword", testStudent.getPassword());
        verify(studentRepository).save(testStudent);
    }

    @Test
    void testRegisterStudent_DuplicateEmail() {
        when(studentRepository.existsByEmail(testStudent.getEmail())).thenReturn(true);

        String result = studentService.registerStudent(testStudent);
        
        assertEquals("Email already registered", result);
        verify(studentRepository, never()).save(any(Student.class));
    }

    @Test
    void testLoginStudent_Success() {
        testStudent.setPassword("hashedPassword");
        when(studentRepository.findByEmail(testStudent.getEmail())).thenReturn(Optional.of(testStudent));
        when(passwordEncoder.matches("plainPassword", "hashedPassword")).thenReturn(true);

        Student result = studentService.loginStudent(testStudent.getEmail(), "plainPassword");
        
        assertNotNull(result);
        assertEquals(testStudent.getId(), result.getId());
    }

    @Test
    void testLoginStudent_InvalidPassword() {
        testStudent.setPassword("hashedPassword");
        when(studentRepository.findByEmail(testStudent.getEmail())).thenReturn(Optional.of(testStudent));
        when(passwordEncoder.matches("wrongPassword", "hashedPassword")).thenReturn(false);

        Student result = studentService.loginStudent(testStudent.getEmail(), "wrongPassword");
        
        assertNull(result);
    }
}
