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

### Database Setup & How to Run

This project uses Spring Profiles to manage database configurations: `dev` (H2 in-memory) and `prod` (MySQL with Flyway migrations).

#### Development Mode (Default)
The `dev` profile is active by default. It uses an H2 in-memory database with Hibernate `create-drop` to easily test without any setup.
1. Run the application:
   ```bash
   mvn spring-boot:run
   ```
   Or explicitly specify the dev profile:
   ```bash
   mvn spring-boot:run -Dspring-boot.run.profiles=dev
   ```
2. Open your browser and go to: `http://localhost:9090`
3. Sample data is automatically loaded on startup!

#### Production Mode (MySQL + Flyway)
The `prod` profile uses MySQL and disables Hibernate's `ddl-auto`. Instead, the database schema is managed via Flyway migrations (e.g., `V1__init.sql`).
No hardcoded credentials exist; you must provide environment variables.

1. **Start the local MySQL database** using the provided `docker-compose.yml`:
   ```bash
   docker-compose up -d
   ```
   This spins up a MySQL container listening on port 3306 with database `library_prod`, user `library_user`, and password `library_password`.

2. **Run the application with the `prod` profile and environment variables:**
   ```bash
   # Windows (PowerShell)
   $env:DB_URL="jdbc:mysql://localhost:3306/library_prod"
   $env:DB_USER="library_user"
   $env:DB_PASSWORD="library_password"
   mvn spring-boot:run -Dspring-boot.run.profiles=prod
   ```
   *(For Linux/Mac use `export DB_URL=...` instead of `$env:`)*

3. Open your browser and go to: `http://localhost:9090`

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
├── db/migration/
│   └── V1__init.sql        (Flyway DB Migration)
└── application.yml         (Profiles & App Config)

docker-compose.yml          (Local MySQL setup)
```

### OOAD Concepts Demonstrated

- **Encapsulation**: Private fields with getters/setters in model classes
- **Separation of Concerns**: Controller → Service → Repository → Model layers
- **Relationships**: Student ↔ BorrowRecord ↔ Book (One-to-Many)
- **Single Responsibility**: Each class has a clear, focused purpose
