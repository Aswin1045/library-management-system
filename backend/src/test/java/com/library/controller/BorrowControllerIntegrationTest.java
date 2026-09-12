package com.library.controller;

import com.library.model.Student;
import com.library.service.BorrowService;
import com.library.service.StudentService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class BorrowControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private BorrowService borrowService;

    @MockBean
    private StudentService studentService;

    @Test
    void testBorrowBook_Success() throws Exception {
        MockHttpSession session = new MockHttpSession();
        session.setAttribute("studentId", 1L);

        Student mockStudent = new Student();
        mockStudent.setId(1L);

        when(studentService.getStudentById(1L)).thenReturn(mockStudent);
        when(borrowService.borrowBook(any(Student.class), eq(10L))).thenReturn("success");

        mockMvc.perform(get("/student/borrow/10").session(session))
                .andExpect(status().is3xxRedirection())
                .andExpect(redirectedUrl("/books"))
                .andExpect(flash().attributeExists("success"));
    }

    @Test
    void testBorrowBook_FailsWhenNotLoggedIn() throws Exception {
        // No session attached, intercepted by AuthInterceptor (if configured) or handled manually
        // But the controller checks for null studentId.
        
        mockMvc.perform(get("/student/borrow/10"))
                .andExpect(status().is3xxRedirection());
                // Depending on the interceptor, it redirects to /student/login
    }

    @Test
    void testBorrowBook_FailsWhenBookUnavailable() throws Exception {
        MockHttpSession session = new MockHttpSession();
        session.setAttribute("studentId", 1L);

        Student mockStudent = new Student();
        mockStudent.setId(1L);

        when(studentService.getStudentById(1L)).thenReturn(mockStudent);
        when(borrowService.borrowBook(any(Student.class), eq(10L))).thenReturn("Book is currently unavailable");

        mockMvc.perform(get("/student/borrow/10").session(session))
                .andExpect(status().is3xxRedirection())
                .andExpect(redirectedUrl("/books"))
                .andExpect(flash().attributeExists("error"));
    }
}
