import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import Layout from './components/Layout';

// Quick placeholders for pages
const Home = () => (
  <div style={{ textAlign: 'center', marginTop: 'var(--space-xxl)' }}>
    <h1 className="serif">Welcome to the Library</h1>
    <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginTop: 'var(--space-sm)' }}>
      Discover your next favorite book today.
    </p>
  </div>
);
const Login = () => <h2>Student Login Page</h2>;
const Register = () => <h2>Register Page</h2>;
const Books = () => <h2>Browse Books Page</h2>;
const StudentDashboard = () => <h2>Student Dashboard</h2>;
const StudentProfile = () => <h2>My Profile</h2>;
const LibrarianLogin = () => <h2>Librarian Login Page</h2>;
const LibrarianDashboard = () => <h2>Librarian Dashboard</h2>;
const ManageBooks = () => <h2>Manage Books Page</h2>;
const Students = () => <h2>Manage Students Page</h2>;
const BorrowRecords = () => <h2>Borrow Records Page</h2>;

const App = () => {
  const { loading, role } = useContext(AuthContext);

  if (loading) {
    return <div style={{ padding: 'var(--space-xl)', textAlign: 'center' }}>Loading session...</div>;
  }

  // Basic Route Guards
  const StudentRoute = ({ children }) => role === 'STUDENT' ? children : <Navigate to="/login" />;
  const LibrarianRoute = ({ children }) => role === 'LIBRARIAN' ? children : <Navigate to="/librarian/login" />;

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Public Routes */}
        <Route index element={<Home />} />
        <Route path="books" element={<Books />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="librarian/login" element={<LibrarianLogin />} />
        
        {/* Student Routes */}
        <Route path="student/dashboard" element={<StudentRoute><StudentDashboard /></StudentRoute>} />
        <Route path="student/profile" element={<StudentRoute><StudentProfile /></StudentRoute>} />
        
        {/* Librarian Routes */}
        <Route path="librarian/dashboard" element={<LibrarianRoute><LibrarianDashboard /></LibrarianRoute>} />
        <Route path="librarian/books" element={<LibrarianRoute><ManageBooks /></LibrarianRoute>} />
        <Route path="librarian/students" element={<LibrarianRoute><Students /></LibrarianRoute>} />
        <Route path="librarian/borrow-records" element={<LibrarianRoute><BorrowRecords /></LibrarianRoute>} />
      </Route>
    </Routes>
  );
};

export default App;
