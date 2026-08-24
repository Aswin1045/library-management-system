package com.library.service;

import com.library.model.Librarian;
import com.library.repository.LibrarianRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class LibrarianService {

    @Autowired
    private LibrarianRepository librarianRepository;

    // Login librarian
    public Librarian loginLibrarian(String username, String password) {
        Optional<Librarian> librarian = librarianRepository.findByUsernameAndPassword(username, password);
        return librarian.orElse(null);
    }
}
