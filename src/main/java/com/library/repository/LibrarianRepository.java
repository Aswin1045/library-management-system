package com.library.repository;

import com.library.model.Librarian;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LibrarianRepository extends JpaRepository<Librarian, Long> {

    Optional<Librarian> findByUsernameAndPassword(String username, String password);
}
