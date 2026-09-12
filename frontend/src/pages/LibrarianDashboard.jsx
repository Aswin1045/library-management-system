import React, { useState, useEffect } from 'react';
import client from '../api/client';
import { Spinner, ErrorMessage } from '../components/ui/Feedback';

const LibrarianDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await client.get('/dashboard/stats');
      setStats(res.data);
    } catch (err) {
      setError('Failed to load dashboard statistics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div>
      <h2 style={{ marginBottom: 'var(--space-xl)' }}>Librarian Dashboard</h2>
      
      {error && <ErrorMessage message={error} onRetry={fetchStats} />}
      
      {loading ? <Spinner /> : stats && (
        <div style={styles.grid}>
          <div className="card" style={styles.statCard}>
            <div style={styles.statTitle}>Total Books</div>
            <div style={styles.statValue}>{stats.totalBooks}</div>
          </div>
          <div className="card" style={styles.statCard}>
            <div style={styles.statTitle}>Currently Borrowed</div>
            <div style={{ ...styles.statValue, color: 'var(--accent)' }}>{stats.currentlyBorrowed}</div>
          </div>
          <div className="card" style={styles.statCard}>
            <div style={styles.statTitle}>Low Stock (&lt; 2)</div>
            <div style={{ ...styles.statValue, color: stats.lowStock > 0 ? 'var(--warning)' : 'inherit' }}>
              {stats.lowStock}
            </div>
          </div>
          <div className="card" style={styles.statCard}>
            <div style={styles.statTitle}>Overdue Items</div>
            <div style={{ ...styles.statValue, color: stats.overdue > 0 ? 'var(--danger)' : 'inherit' }}>
              {stats.overdue}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: 'var(--space-lg)'
  },
  statCard: {
    textAlign: 'center',
    padding: 'var(--space-xl) var(--space-md)'
  },
  statTitle: {
    color: 'var(--text-muted)',
    fontSize: '0.9rem',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    fontWeight: 600,
    marginBottom: 'var(--space-sm)'
  },
  statValue: {
    fontFamily: 'var(--font-serif)',
    fontSize: '2.5rem',
    fontWeight: 600,
    color: 'var(--text-main)'
  }
};

export default LibrarianDashboard;
