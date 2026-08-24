package com.library.repository;

import com.library.model.BorrowRecord;
import com.library.model.Student;
import com.library.model.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BorrowRecordRepository extends JpaRepository<BorrowRecord, Long> {

    List<BorrowRecord> findByStudent(Student student);

    List<BorrowRecord> findByStudentId(Long studentId);

    Optional<BorrowRecord> findByStudentAndBookAndStatus(Student student, Book book, BorrowRecord.BorrowStatus status);

    List<BorrowRecord> findByBookAndStatus(Book book, BorrowRecord.BorrowStatus status);

    boolean existsByBookAndStatus(Book book, BorrowRecord.BorrowStatus status);
}
