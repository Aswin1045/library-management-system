import React from 'react';
import Navbar from './Navbar';
import FolioLogo from './FolioLogo';
import { Outlet, useLocation, Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

const pageVariants = {
  initial: { opacity: 0, y: 15 },
  in:      { opacity: 1, y: 0  },
  out:     { opacity: 0, y: -15 }
};

const pageTransition = { type: 'tween', ease: 'easeOut', duration: 0.3 };

const Layout = () => {
  const location = useLocation();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--bg-color)' }}>
      <Navbar />

      <main style={styles.main}>
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
            style={{ width: '100%' }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* ── Expanded Footer ── */}
      <footer style={styles.footer}>
        <div style={styles.footerInner}>

          {/* Column 1 — Brand */}
          <div style={styles.footerCol}>
            <Link to="/" style={styles.footerBrand}>
              <FolioLogo size={32} />
              <span style={styles.footerBrandName}>Folio</span>
            </Link>
            <p style={styles.tagline}>
              Your campus library,<br />beautifully organised.
            </p>
          </div>

          {/* Column 2 — Quick Links */}
          <div style={styles.footerCol}>
            <h4 style={styles.footerHeading}>Quick Links</h4>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Link to="/books"          style={styles.footerLink}>Browse Books</Link>
              <Link to="/login"          style={styles.footerLink}>Student Login</Link>
              <Link to="/register"       style={styles.footerLink}>Register</Link>
              <Link to="/librarian/login" style={styles.footerLink}>Librarian Login</Link>
            </nav>
          </div>

          {/* Column 3 — Contact / Source */}
          <div style={styles.footerCol}>
            <h4 style={styles.footerHeading}>Project</h4>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <a
                href="https://github.com/Aswin1045/library-management-system"
                target="_blank"
                rel="noreferrer"
                style={styles.footerLink}
              >
                GitHub Repository ↗
              </a>
              <span style={{ color: 'var(--text-light)', fontSize: '0.85rem' }}>
                Built with Spring Boot + React
              </span>
            </nav>
          </div>
        </div>

        <div style={styles.footerBottom}>
          <span>Folio &copy; {new Date().getFullYear()} — Library Management System</span>
        </div>
      </footer>
    </div>
  );
};

const styles = {
  main: {
    flex: 1,
    maxWidth: '1200px',
    margin: '0 auto',
    padding: 'var(--space-xl) var(--space-lg)',
    width: '100%',
  },
  footer: {
    backgroundColor: 'var(--surface)',
    borderTop: '1px solid var(--border)',
    marginTop: 'auto',
  },
  footerInner: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: 'var(--space-xxl) var(--space-lg) var(--space-xl)',
    display: 'grid',
    gridTemplateColumns: '1.4fr 1fr 1fr',
    gap: 'var(--space-xxl)',
  },
  footerCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-md)',
  },
  footerBrand: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    textDecoration: 'none',
  },
  footerBrandName: {
    fontFamily: 'var(--font-serif)',
    fontSize: '1.4rem',
    fontWeight: 600,
    color: 'var(--text-main)',
  },
  tagline: {
    color: 'var(--text-muted)',
    fontSize: '0.9rem',
    lineHeight: 1.7,
    marginTop: '-4px',
  },
  footerHeading: {
    fontFamily: 'var(--font-serif)',
    fontSize: '1rem',
    fontWeight: 600,
    color: 'var(--text-main)',
    marginBottom: '4px',
  },
  footerLink: {
    color: 'var(--text-muted)',
    fontSize: '0.9rem',
    textDecoration: 'none',
    transition: 'color 0.2s ease',
  },
  footerBottom: {
    borderTop: '1px solid var(--border)',
    padding: 'var(--space-md) var(--space-lg)',
    maxWidth: '1200px',
    margin: '0 auto',
    color: 'var(--text-light)',
    fontSize: '0.8rem',
    textAlign: 'center',
  }
};

export default Layout;

