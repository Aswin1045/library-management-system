# Library Management System

A full-stack modern web application for managing library books, tracking loans, calculating fines, and managing student accounts. This project features a clean, responsive UI matching a "reading app" aesthetic and is built with a robust Spring Boot backend.

## 🚀 Tech Stack
*   **Backend:** Java 17, Spring Boot 3, Spring Data JPA, Hibernate, Flyway
*   **Database:** H2 (Development) / MySQL 8 (Production)
*   **Frontend:** Thymeleaf, Vanilla JS, HTML5, Custom CSS Variables
*   **Security:** BCrypt Password Hashing, Session-based Interceptors
*   **Build & Deploy:** Maven, Docker, GitHub Actions

## ✨ Features
*   **Role-based Access:** Dedicated portals and features for Students and Librarians.
*   **Book Management:** Add, edit, delete, and browse books with beautiful UI cards and availability badges.
*   **Smart Search & Pagination:** Fast, live-filtering book search with category and availability toggles. Fully paginated views.
*   **Loan Tracking & Due Dates:** Automatic 14-day due dates when borrowing a book.
*   **Automated Fines:** Real-time per-day overdue fine calculations.
*   **Student Profiles:** Personal dashboard showing current active loans, borrowing history, and account details.
*   **Librarian Dashboard:** At-a-glance library statistics including total books, low stock alerts, currently borrowed, and overdue items.
*   **Robust Security:** BCrypt hashed passwords and route-protecting interceptors.

## 📸 Screenshots

*(Replace the placeholders below with actual screenshots of your application)*

| Student Dashboard | Book Grid Search |
|:---:|:---:|
| ![Student Dashboard](docs/placeholder-dashboard.png) | ![Book Grid](docs/placeholder-grid.png) |

| Librarian Stats | Borrowing History & Fines |
|:---:|:---:|
| ![Librarian Stats](docs/placeholder-librarian.png) | ![Fines](docs/placeholder-fines.png) |

## 🛠️ How to Run

### Option 1: Local Development (H2 In-Memory DB)
This is the easiest way to run the app quickly without installing MySQL. It uses an in-memory database that wipes clean on every restart.
1. Ensure Java 17+ is installed.
2. Navigate to the `backend/` directory.
3. Run the application using the Maven wrapper:
   ```bash
   ./mvnw spring-boot:run -Dspring-boot.run.profiles=dev
   ```
4. Access the app at `http://localhost:8080`.

### Option 2: Production Setup (MySQL + Docker)
This runs the application with a persistent MySQL database, utilizing Flyway for schema migrations.
1. Make sure you have Docker and Docker Compose installed.
2. From the root directory of the project, spin up the stack:
   ```bash
   docker-compose up -d
   ```
3. The app will automatically connect to the MySQL database, run the `V1` and `V2` Flyway migrations, and start on `http://localhost:8080`.

## 🧪 Testing
The project includes unit tests for all core services (`BookService`, `StudentService`, `BorrowService`) and integration tests for controller workflows using MockMvc and Mockito.

To run tests:
```bash
cd backend
./mvnw test
```
Tests are automatically run on every push via GitHub Actions.
