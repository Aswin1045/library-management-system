import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import Layout from './components/Layout';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Books from './pages/Books';
import StudentDashboard from './pages/StudentDashboard';
import StudentProfile from './pages/StudentProfile';
import LibrarianLogin from './pages/LibrarianLogin';
import LibrarianDashboard from './pages/LibrarianDashboard';
import ManageBooks from './pages/ManageBooks';
import Students from './pages/Students';
import BorrowRecords from './pages/BorrowRecords';

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
