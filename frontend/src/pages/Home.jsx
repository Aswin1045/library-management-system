import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div style={{ textAlign: 'center', marginTop: 'var(--space-xxl)', padding: 'var(--space-xl)' }}>
      <h1 className="serif" style={{ fontSize: '3rem', color: 'var(--accent)' }}>Welcome to the Library</h1>
      <p style={{ color: 'var(--text-muted)', fontSize: '1.25rem', marginTop: 'var(--space-md)', maxWidth: '600px', margin: 'var(--space-md) auto var(--space-xl)' }}>
        Discover your next favorite book today. Browse our extensive catalog or log in to manage your active loans.
      </p>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-md)' }}>
        <Link to="/books" className="btn btn-primary" style={{ padding: '12px 24px', fontSize: '1.1rem' }}>Browse Catalog</Link>
        <Link to="/login" className="btn btn-outline" style={{ padding: '12px 24px', fontSize: '1.1rem' }}>Student Login</Link>
      </div>
    </div>
  );
};

export default Home;
