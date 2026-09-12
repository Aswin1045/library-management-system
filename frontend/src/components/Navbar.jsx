import React, { useContext, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import FolioLogo from './FolioLogo';

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
          <FolioLogo size={28} />
          <span style={{ marginLeft: '10px' }}>Folio</span>
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
