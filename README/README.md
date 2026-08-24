# Library Management System

## OOAD Lab Project

### Aim
To design and implement a simple Library Management System using Object-Oriented Analysis and Design principles with Spring Boot and MySQL.

### Description
A web-based Library Management System that allows students to browse, borrow, and return books, while librarians can manage the book collection and view borrowing records. The application demonstrates core OOAD concepts including encapsulation, separation of concerns, and layered architecture.

### Technologies Used
| Technology | Purpose |
|---|---|
| Java 21 | Programming Language |
| Spring Boot 3.2.5 | Backend Framework |
| Spring Data JPA | Database Access (ORM) |
| Thymeleaf | Server-side HTML Templating |
| H2 / MySQL | Database (H2 default, MySQL optional) |
| Maven | Build Tool |
| HTML/CSS | Frontend |

### Features

**Student Features:**
- Student Registration
- Student Login
- View Available Books
- Search Books (by title, author, category)
- Borrow a Book
- View Borrowed Books
- Return a Book

**Librarian Features:**
- Librarian Login
- Add New Book
- View All Books
- Edit Book Details
- Delete Book
- View Registered Students
- View All Borrow Records

### Database Setup

**Default (H2 In-Memory Database):**
- No setup needed! The application uses H2 by default and works out of the box.
- Sample data is automatically loaded on startup.

**To switch to MySQL:**
1. Install MySQL and start the MySQL server.
2. Edit `src/main/resources/application.properties`:
   - Comment out the H2 lines
   - Uncomment the MySQL lines
   - Set your MySQL username and password

### How to Run

1. Make sure **MySQL** is running.

2. Update MySQL credentials in `application.properties` if needed.

3. Open a terminal in the project root and run:
   ```bash
   mvn spring-boot:run
   ```

4. Open your browser and go to:
   ```
   http://localhost:9090
   ```

5. Use the application!

### Sample Login Credentials

| Role | Username/Email | Password |
|---|---|---|
| **Librarian** | `admin` | `admin123` |
| **Student** | `rahul@email.com` | `password123` |
| **Student** | `priya@email.com` | `password123` |
| **Student** | `arun@email.com` | `password123` |

### Project Structure

```
src/main/java/com/library/
├── LibraryManagementApplication.java    (Main Application)
├── DataInitializer.java                  (Sample Data Loader)
├── controller/
│   ├── HomeController.java
│   ├── StudentController.java
│   ├── LibrarianController.java
│   ├── BookController.java
│   └── BorrowController.java
├── service/
│   ├── StudentService.java
│   ├── LibrarianService.java
│   ├── BookService.java
│   └── BorrowService.java
├── repository/
│   ├── StudentRepository.java
│   ├── LibrarianRepository.java
│   ├── BookRepository.java
│   └── BorrowRecordRepository.java
└── model/
    ├── Student.java
    ├── Librarian.java
    ├── Book.java
    └── BorrowRecord.java

src/main/resources/
├── templates/              (Thymeleaf HTML pages)
│   ├── index.html
│   ├── register.html
│   ├── student-login.html
│   ├── student-home.html
│   ├── librarian-login.html
│   ├── librarian-home.html
│   ├── books.html
│   ├── borrowed-books.html
│   ├── add-book.html
│   ├── manage-books.html
│   ├── edit-book.html
│   ├── students.html
│   └── borrow-records.html
├── static/css/style.css
└── application.properties
```

### OOAD Concepts Demonstrated

- **Encapsulation**: Private fields with getters/setters in model classes
- **Separation of Concerns**: Controller → Service → Repository → Model layers
- **Relationships**: Student ↔ BorrowRecord ↔ Book (One-to-Many)
- **Single Responsibility**: Each class has a clear, focused purpose
