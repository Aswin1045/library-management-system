import React from 'react';
import Navbar from './Navbar';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

const pageVariants = {
  initial: { opacity: 0, y: 15 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -15 }
};

const pageTransition = {
  type: "tween",
  ease: "easeOut",
  duration: 0.3
};

const Layout = () => {
  const location = useLocation();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--background)' }}>
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
            style={{ width: '100%', height: '100%' }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
      <footer style={styles.footer}>
        <p>Folio &copy; 2026</p>
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
    textAlign: 'center',
    padding: 'var(--space-lg)',
    color: 'var(--text-muted)',
    borderTop: '1px solid var(--border)',
    marginTop: 'auto',
  }
};

export default Layout;
