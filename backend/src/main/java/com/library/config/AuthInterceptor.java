package com.library.config;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
public class AuthInterceptor implements HandlerInterceptor {

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        String uri = request.getRequestURI();
        HttpSession session = request.getSession();

        if (uri.startsWith("/librarian") && !uri.equals("/librarian/login")) {
            if (session.getAttribute("librarianId") == null) {
                response.sendRedirect("/librarian/login");
                return false;
            }
        }

        if (uri.startsWith("/student") && !uri.equals("/student/login")) {
            if (session.getAttribute("studentId") == null) {
                response.sendRedirect("/student/login");
                return false;
            }
        }

        return true;
    }
}
