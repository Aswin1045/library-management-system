CREATE TABLE books (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    category VARCHAR(255) NOT NULL,
    isbn VARCHAR(255) NOT NULL,
    quantity INT NOT NULL,
    available_quantity INT NOT NULL,
    CONSTRAINT uk_books_isbn UNIQUE (isbn)
);

CREATE TABLE students (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    department VARCHAR(255) NOT NULL,
    CONSTRAINT uk_students_email UNIQUE (email)
);

CREATE TABLE librarians (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    CONSTRAINT uk_librarians_username UNIQUE (username)
);

CREATE TABLE borrow_records (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT NOT NULL,
    book_id BIGINT NOT NULL,
    borrow_date DATE NOT NULL,
    return_date DATE,
    status VARCHAR(50) NOT NULL,
    CONSTRAINT fk_borrow_records_student FOREIGN KEY (student_id) REFERENCES students(id),
    CONSTRAINT fk_borrow_records_book FOREIGN KEY (book_id) REFERENCES books(id)
);

CREATE INDEX idx_borrow_records_student_id ON borrow_records(student_id);
CREATE INDEX idx_borrow_records_book_id ON borrow_records(book_id);
