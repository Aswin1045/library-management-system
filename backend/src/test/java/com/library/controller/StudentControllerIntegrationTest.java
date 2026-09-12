package com.library.controller;

import com.library.model.Student;
import com.library.service.StudentService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class StudentControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private StudentService studentService;

    @Test
    void testShowLoginForm() throws Exception {
        mockMvc.perform(get("/student/login"))
                .andExpect(status().isOk())
                .andExpect(view().name("student-login"));
    }

    @Test
    void testLoginStudent_Success() throws Exception {
        Student mockStudent = new Student();
        mockStudent.setId(1L);
        mockStudent.setName("John Doe");

        when(studentService.loginStudent("john@example.com", "password123")).thenReturn(mockStudent);

        mockMvc.perform(post("/student/login")
                .param("email", "john@example.com")
                .param("password", "password123"))
                .andExpect(status().is3xxRedirection())
                .andExpect(redirectedUrl("/student/home"))
                .andExpect(request().sessionAttribute("studentId", 1L))
                .andExpect(request().sessionAttribute("studentName", "John Doe"));
    }

    @Test
    void testLoginStudent_Failure() throws Exception {
        when(studentService.loginStudent(anyString(), anyString())).thenReturn(null);

        mockMvc.perform(post("/student/login")
                .param("email", "wrong@example.com")
                .param("password", "wrongpass"))
                .andExpect(status().isOk())
                .andExpect(view().name("student-login"))
                .andExpect(model().attributeExists("error"));
    }
}
