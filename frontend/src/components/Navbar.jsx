import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, role, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.container}>
        <Link to="/" style={styles.brand}>📚 LMS</Link>
        <div style={styles.links}>
          {!user && (
            <>
              <Link to="/books" style={styles.link}>Browse Books</Link>
              <Link to="/login" style={styles.link}>Student Login</Link>
              <Link to="/register" style={styles.link}>Register</Link>
              <Link to="/librarian/login" style={styles.link}>Librarian Login</Link>
            </>
          )}
          
          {role === 'STUDENT' && (
            <>
              <Link to="/student/dashboard" style={styles.link}>Dashboard</Link>
              <Link to="/books" style={styles.link}>Browse Books</Link>
              <Link to="/student/profile" style={styles.link}>My Profile</Link>
              <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
            </>
          )}

          {role === 'LIBRARIAN' && (
            <>
              <Link to="/librarian/dashboard" style={styles.link}>Dashboard</Link>
              <Link to="/librarian/books" style={styles.link}>Manage Books</Link>
              <Link to="/librarian/students" style={styles.link}>Students</Link>
              <Link to="/librarian/borrow-records" style={styles.link}>Records</Link>
              <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    backgroundColor: 'var(--surface)',
    borderBottom: '1px solid var(--border)',
    padding: 'var(--space-md) 0',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 var(--space-lg)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  brand: {
    fontFamily: 'var(--font-serif)',
    fontSize: '1.25rem',
    fontWeight: 600,
    color: 'var(--text-main)',
  },
  links: {
    display: 'flex',
    gap: 'var(--space-lg)',
    alignItems: 'center',
  },
  link: {
    color: 'var(--text-main)',
    fontWeight: 500,
  },
  logoutBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--danger)',
    fontWeight: 500,
    cursor: 'pointer',
    fontSize: '1rem',
    fontFamily: 'var(--font-sans)',
  }
};

export default Navbar;
