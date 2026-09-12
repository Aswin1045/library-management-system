import React, { useContext, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';

const Navbar = () => {
  const { user, role, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 20);
  });

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const NavLink = ({ to, children }) => {
    const isActive = location.pathname === to;
    return (
      <Link to={to} style={{ ...styles.link, color: isActive ? 'var(--primary)' : 'var(--text-main)' }}>
        <motion.span whileHover={{ color: 'var(--primary)' }} style={{ position: 'relative' }}>
          {children}
          {isActive && (
            <motion.div
              layoutId="nav-underline"
              style={styles.activeUnderline}
              initial={false}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          )}
        </motion.span>
      </Link>
    );
  };

  return (
    <motion.nav 
      style={styles.nav}
      animate={{ 
        boxShadow: scrolled ? '0 4px 20px rgba(0,0,0,0.05)' : '0 0px 0px rgba(0,0,0,0)',
        borderBottom: scrolled ? '1px solid transparent' : '1px solid var(--border)'
      }}
      transition={{ duration: 0.3 }}
    >
      <div style={styles.container}>
        <Link to="/" style={styles.brand}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '8px' }}>
            <path d="M4 19V6.2C4 5.0799 4 4.51984 4.21799 4.09202C4.40973 3.71569 4.71569 3.40973 5.09202 3.21799C5.51984 3 6.0799 3 7.2 3H16.8C17.9201 3 18.4802 3 18.908 3.21799C19.2843 3.40973 19.5903 3.71569 19.782 4.09202C20 4.51984 20 5.0799 20 6.2V17H6C4.89543 17 4 17.8954 4 19ZM4 19C4 20.1046 4.89543 21 6 21H20" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9 7H15" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round"/>
            <path d="M9 11H15" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          Folio
        </Link>
        <div style={styles.links}>
          {!user && (
            <>
              <NavLink to="/books">Browse Books</NavLink>
              <NavLink to="/login">Student Login</NavLink>
              <NavLink to="/register">Register</NavLink>
              <NavLink to="/librarian/login">Librarian Login</NavLink>
            </>
          )}
          
          {role === 'STUDENT' && (
            <>
              <NavLink to="/student/dashboard">Dashboard</NavLink>
              <NavLink to="/books">Browse Books</NavLink>
              <NavLink to="/student/profile">My Profile</NavLink>
              <motion.button whileTap={{ scale: 0.95 }} whileHover={{ color: '#c0392b' }} onClick={handleLogout} style={styles.logoutBtn}>Logout</motion.button>
            </>
          )}

          {role === 'LIBRARIAN' && (
            <>
              <NavLink to="/librarian/dashboard">Dashboard</NavLink>
              <NavLink to="/librarian/books">Manage Books</NavLink>
              <NavLink to="/librarian/students">Students</NavLink>
              <NavLink to="/librarian/borrow-records">Records</NavLink>
              <motion.button whileTap={{ scale: 0.95 }} whileHover={{ color: '#c0392b' }} onClick={handleLogout} style={styles.logoutBtn}>Logout</motion.button>
            </>
          )}
        </div>
      </div>
    </motion.nav>
  );
};

const styles = {
  nav: {
    backgroundColor: 'var(--surface)',
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
    fontSize: '1.5rem',
    fontWeight: 600,
    color: 'var(--text-main)',
    display: 'flex',
    alignItems: 'center',
  },
  links: {
    display: 'flex',
    gap: 'var(--space-lg)',
    alignItems: 'center',
  },
  link: {
    fontWeight: 500,
    textDecoration: 'none',
    position: 'relative',
    display: 'inline-block'
  },
  activeUnderline: {
    position: 'absolute',
    bottom: '-4px',
    left: 0,
    right: 0,
    height: '2px',
    backgroundColor: 'var(--primary)',
    borderRadius: '2px'
  },
  logoutBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--danger)',
    fontWeight: 500,
    cursor: 'pointer',
    fontSize: '1rem',
    fontFamily: 'var(--font-sans)',
    transition: 'color 0.2s ease',
  }
};

export default Navbar;
