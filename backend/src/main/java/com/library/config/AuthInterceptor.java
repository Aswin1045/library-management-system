package com.library.config;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
public class AuthInterceptor implements HandlerInterceptor {

    @Override
    public boolean preHandle(@org.springframework.lang.NonNull HttpServletRequest request, @org.springframework.lang.NonNull HttpServletResponse response, @org.springframework.lang.NonNull Object handler) throws Exception {
        String uri = request.getRequestURI();
        HttpSession session = request.getSession(false);
        boolean isStudent = session != null && session.getAttribute("studentId") != null;
        boolean isLibrarian = session != null && session.getAttribute("librarianId") != null;

        // API Routes Auth handling
        if (uri.startsWith("/api/")) {
            // Public API routes — no auth required
            if (uri.startsWith("/api/auth/")
                    || uri.startsWith("/api/stats/public")
                    || (uri.equals("/api/books") && request.getMethod().equals("GET"))) {
                return true;
            }

            // Define librarian-only routes
            boolean requiresLibrarian = uri.startsWith("/api/dashboard") || 
                                        uri.equals("/api/students") || 
                                        uri.startsWith("/api/borrow/records") ||
                                        (uri.startsWith("/api/books") && !request.getMethod().equals("GET"));

            // Define student-only routes
            boolean requiresStudent = uri.startsWith("/api/borrow/") && !uri.startsWith("/api/borrow/records") ||
                                      uri.startsWith("/api/return/");

            if (requiresLibrarian && !isLibrarian) {
                return rejectApiRequest(response);
            }
            if (requiresStudent && !isStudent) {
                return rejectApiRequest(response);
            }
            if (!requiresLibrarian && !requiresStudent && !isStudent && !isLibrarian) {
                return rejectApiRequest(response); // Requires at least one role
            }
            return true;
        }

        // Existing Thymeleaf MVC Routes
        if (uri.startsWith("/librarian") && !uri.equals("/librarian/login")) {
            if (!isLibrarian) {
                response.sendRedirect("/librarian/login");
                return false;
            }
        }

        if (uri.startsWith("/student") && !uri.equals("/student/login")) {
            if (!isStudent) {
                response.sendRedirect("/student/login");
                return false;
            }
        }

        return true;
    }

    private boolean rejectApiRequest(HttpServletResponse response) throws Exception {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType("application/json");
        response.getWriter().write("{\"error\": \"Unauthorized - Please log in with appropriate role.\"}");
        return false;
    }
}
