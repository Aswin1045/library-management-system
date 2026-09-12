package com.library;

import com.library.model.Book;
import com.library.model.BorrowRecord;
import com.library.model.BorrowRecord.BorrowStatus;
import com.library.model.Librarian;
import com.library.model.Student;
import com.library.repository.BookRepository;
import com.library.repository.BorrowRecordRepository;
import com.library.repository.LibrarianRepository;
import com.library.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

/**
 * Seeds realistic demo data on first run only.
 * Each block is guarded by a count-check so restarts never duplicate rows.
 *
 * Demo credentials (keep out of public docs):
 *   Students  : alice@folio.dev / Demo1234!
 *               bob@folio.dev   / Demo1234!
 *               carol@folio.dev / Demo1234!
 *   Librarian : admin@folio.dev / Admin1234!
 */
@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired private BookRepository         bookRepo;
    @Autowired private StudentRepository      studentRepo;
    @Autowired private LibrarianRepository    librarianRepo;
    @Autowired private BorrowRecordRepository borrowRepo;
    @Autowired private PasswordEncoder        passwordEncoder;

    @Override
    public void run(String... args) {

        // ── 1. BOOKS ──────────────────────────────────────────────────────
        if (bookRepo.count() == 0) {
            List<Book> books = List.of(
                // Fiction (4 titles)
                new Book("To Kill a Mockingbird",        "Harper Lee",              "Fiction",           "978-0061935466-1",  5),
                new Book("1984",                         "George Orwell",           "Fiction",           "978-0451524935-2",  4),
                new Book("The Great Gatsby",             "F. Scott Fitzgerald",     "Fiction",           "978-0743273565-3",  3),
                new Book("One Hundred Years of Solitude","Gabriel Garcia Marquez",  "Fiction",           "978-0060883287-4",  4),

                // Science (3 titles)
                new Book("A Brief History of Time",      "Stephen Hawking",         "Science",           "978-0553380163-5",  4),
                new Book("The Selfish Gene",             "Richard Dawkins",         "Science",           "978-0199291151-6",  3),
                new Book("Cosmos",                       "Carl Sagan",              "Science",           "978-0345539434-7",  5),

                // History (3 titles)
                new Book("Sapiens",                      "Yuval Noah Harari",       "History",           "978-0062316097-8",  5),
                new Book("Guns, Germs, and Steel",       "Jared Diamond",           "History",           "978-0393354324-9",  3),
                new Book("The Story of Civilization",    "Will Durant",             "History",           "978-1567310238-10", 2),

                // Technology (4 titles)
                new Book("Clean Code",                   "Robert C. Martin",        "Technology",        "978-0132350884-11", 5),
                new Book("The Pragmatic Programmer",     "David Thomas",            "Technology",        "978-0135957059-12", 4),
                new Book("Design Patterns",              "Gang of Four",            "Technology",        "978-0201633610-13", 3),
                new Book("You Don't Know JS",            "Kyle Simpson",            "Technology",        "978-1491924464-14", 4),

                // Biography (3 titles)
                new Book("Steve Jobs",                   "Walter Isaacson",         "Biography",         "978-1451648539-15", 4),
                new Book("The Diary of a Young Girl",    "Anne Frank",              "Biography",         "978-0553577129-16", 3),
                new Book("Long Walk to Freedom",         "Nelson Mandela",          "Biography",         "978-0316548182-17", 2),

                // Philosophy (2 titles)
                new Book("Meditations",                  "Marcus Aurelius",         "Philosophy",        "978-0812968255-18", 4),
                new Book("The Republic",                 "Plato",                   "Philosophy",        "978-0872201361-19", 3)
            );
            bookRepo.saveAll(books);
        }

        // ── 2. STUDENTS ───────────────────────────────────────────────────
        if (studentRepo.count() == 0) {
            studentRepo.saveAll(List.of(
                new Student("Alice Menon",   "alice@folio.dev",  passwordEncoder.encode("Demo1234!"), "Computer Science"),
                new Student("Bob Rajan",     "bob@folio.dev",    passwordEncoder.encode("Demo1234!"), "Information Technology"),
                new Student("Carol Thomas",  "carol@folio.dev",  passwordEncoder.encode("Demo1234!"), "Electronics")
            ));
        }

        // ── 3. LIBRARIAN ──────────────────────────────────────────────────
        if (librarianRepo.count() == 0) {
            librarianRepo.save(new Librarian("admin@folio.dev", passwordEncoder.encode("Admin1234!")));
        }

        // ── 4. BORROW RECORDS ─────────────────────────────────────────────
        if (borrowRepo.count() == 0) {
            // Re-fetch managed entities so JPA relationships resolve properly
            List<Student>  students = studentRepo.findAll();
            List<Book>     allBooks = bookRepo.findAll();

            if (students.size() >= 2 && allBooks.size() >= 10) {
                Student alice = students.get(0);   // Alice Menon
                Student bob   = students.get(1);   // Bob Rajan

                Book cleanCode   = allBooks.get(10);  // Clean Code
                Book sapiens     = allBooks.get(7);   // Sapiens
                Book cosmos      = allBooks.get(6);   // Cosmos
                Book gatsby      = allBooks.get(2);   // The Great Gatsby
                Book jobs        = allBooks.get(14);  // Steve Jobs

                LocalDate today = LocalDate.now();

                // Active loan 1 — Alice, due in 7 days
                BorrowRecord r1 = new BorrowRecord(alice, cleanCode, today.minusDays(7), today.plusDays(7), BorrowStatus.BORROWED);
                cleanCode.setAvailableQuantity(cleanCode.getAvailableQuantity() - 1);

                // Active loan 2 — Alice, due in 3 days
                BorrowRecord r2 = new BorrowRecord(alice, sapiens, today.minusDays(11), today.plusDays(3), BorrowStatus.BORROWED);
                sapiens.setAvailableQuantity(sapiens.getAvailableQuantity() - 1);

                // Active loan 3 — Bob, due in 10 days
                BorrowRecord r3 = new BorrowRecord(bob, cosmos, today.minusDays(4), today.plusDays(10), BorrowStatus.BORROWED);
                cosmos.setAvailableQuantity(cosmos.getAvailableQuantity() - 1);

                // OVERDUE loan — Bob, due 5 days ago (will show fine = $5)
                BorrowRecord r4 = new BorrowRecord(bob, gatsby, today.minusDays(19), today.minusDays(5), BorrowStatus.BORROWED);
                gatsby.setAvailableQuantity(gatsby.getAvailableQuantity() - 1);

                // Returned record 1 — Alice returned Steve Jobs
                BorrowRecord r5 = new BorrowRecord(alice, jobs, today.minusDays(30), today.minusDays(16), BorrowStatus.RETURNED);
                r5.setReturnDate(today.minusDays(18));

                // Returned record 2 — Bob returned Cosmos (previous borrow)
                Book history  = allBooks.get(8); // Guns, Germs and Steel
                BorrowRecord r6 = new BorrowRecord(bob, history, today.minusDays(45), today.minusDays(31), BorrowStatus.RETURNED);
                r6.setReturnDate(today.minusDays(33));

                // Persist updated availability counts
                bookRepo.saveAll(List.of(cleanCode, sapiens, cosmos, gatsby));
                borrowRepo.saveAll(List.of(r1, r2, r3, r4, r5, r6));
            }
        }

        // ── 5. SUMMARY LOG ────────────────────────────────────────────────
        long books     = bookRepo.count();
        long students  = studentRepo.count();
        long librarians= librarianRepo.count();
        long borrows   = borrowRepo.count();
        System.out.printf("%n╔══════════════════════════════════════════╗%n");
        System.out.printf("║  Folio — Demo data ready                 ║%n");
        System.out.printf("║  %3d books  |  %d students  |  %d librarian  ║%n", books, students, librarians);
        System.out.printf("║  %3d borrow records seeded               ║%n", borrows);
        System.out.printf("╚══════════════════════════════════════════╝%n%n");
    }
}