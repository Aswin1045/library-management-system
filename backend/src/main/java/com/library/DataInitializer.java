package com.library;

import com.library.model.Book;
import com.library.model.Librarian;
import com.library.model.Student;
import com.library.repository.BookRepository;
import com.library.repository.LibrarianRepository;
import com.library.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private LibrarianRepository librarianRepository;

    @Autowired
    private org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        // Only insert sample data if database is empty
        if (bookRepository.count() == 0) {
            // Sample Books
            bookRepository.save(new Book("Java Programming", "Herbert Schildt", "Programming", "978-0071809252", 5));
            bookRepository.save(new Book("Python Programming", "Mark Lutz", "Programming", "978-1449355739", 4));
            bookRepository.save(new Book("Database Management Systems", "Raghu Ramakrishnan", "Database", "978-0072465631", 3));
            bookRepository.save(new Book("Computer Networks", "Andrew S. Tanenbaum", "Networking", "978-0132126953", 4));
            bookRepository.save(new Book("Operating System Concepts", "Abraham Silberschatz", "Operating Systems", "978-1118063330", 3));
            bookRepository.save(new Book("Data Structures and Algorithms", "Thomas H. Cormen", "Programming", "978-0262033848", 5));
            bookRepository.save(new Book("Software Engineering", "Ian Sommerville", "Software Engineering", "978-0133943030", 3));
            bookRepository.save(new Book("Artificial Intelligence", "Stuart Russell", "AI & ML", "978-0136042594", 2));

            System.out.println(">>> Sample books inserted successfully!");
        }

        if (studentRepository.count() == 0) {
            // Sample Students
            studentRepository.save(new Student("Rahul Kumar", "rahul@email.com", passwordEncoder.encode("password123"), "Computer Science"));
            studentRepository.save(new Student("Priya Sharma", "priya@email.com", passwordEncoder.encode("password123"), "Information Technology"));
            studentRepository.save(new Student("Arun Nair", "arun@email.com", passwordEncoder.encode("password123"), "Electronics"));

            System.out.println(">>> Sample students inserted successfully!");
        }

        if (librarianRepository.count() == 0) {
            // Sample Librarian
            librarianRepository.save(new Librarian("admin", passwordEncoder.encode("admin123")));

            System.out.println(">>> Sample librarian inserted successfully!");
        }
    }
}
