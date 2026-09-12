import React from 'react';
import Navbar from './Navbar';
import { Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <main style={styles.main}>
        <Outlet />
      </main>
      <footer style={styles.footer}>
        <p>Library Management System &copy; 2026</p>
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
