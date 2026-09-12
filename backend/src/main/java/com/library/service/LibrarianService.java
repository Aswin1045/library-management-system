package com.library.service;

import com.library.model.Librarian;
import com.library.repository.LibrarianRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

import org.springframework.security.crypto.password.PasswordEncoder;

@Service
public class LibrarianService {

    @Autowired
    private LibrarianRepository librarianRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // Login librarian
    public Librarian loginLibrarian(String username, String password) {
        Optional<Librarian> librarianOpt = librarianRepository.findByUsername(username);
        if (librarianOpt.isPresent() && passwordEncoder.matches(password, librarianOpt.get().getPassword())) {
            return librarianOpt.get();
        }
        return null;
    }
}
